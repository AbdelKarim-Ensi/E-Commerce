import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { NotificationsQueue } from '../notifications/queues/notifications.queue';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus, Role } from '@prisma/client';
import { assertValidTransition } from './order-status.state-machine';

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
} as const;

interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
    private readonly notificationsQueue: NotificationsQueue,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    return this.prisma.$transaction(
      async (tx) => {
        const productIds = dto.items.map((i) => i.productId);

        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
        });

        if (products.length !== productIds.length) {
          throw new NotFoundException(
            'Un ou plusieurs produits sont introuvables',
          );
        }

        const inactive = products.find((p) => !p.isActive);
        if (inactive) {
          throw new BadRequestException(
            `Le produit "${inactive.name}" n'est plus disponible`,
          );
        }

        let totalAmount = 0;
        const orderItemsData: {
          productId: string;
          quantity: number;
          unitPrice: number;
        }[] = [];

        for (const item of dto.items) {
          const product = products.find((p) => p.id === item.productId)!;

          // Décrément atomique — condition vérifiée directement par Postgres
          const updateResult = await tx.product.updateMany({
            where: {
              id: item.productId,
              stock: { gte: item.quantity },
            },
            data: {
              stock: { decrement: item.quantity },
            },
          });

          if (updateResult.count === 0) {
            throw new ConflictException(
              `Stock insuffisant pour le produit "${product.name}"`,
            );
          }

          const unitPrice = product.price.toNumber();
          totalAmount += unitPrice * item.quantity;

          orderItemsData.push({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice, // prix figé au moment T
          });
        }

        const order = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          totalAmount,
          shippingAddress: dto.shippingAddress,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });

        return order;
      },
      {
        isolationLevel: 'Serializable',
        timeout: 10000,
      },
    );
  }

async findAll(userId: string, role: Role) {
  const where = role === Role.CLIENT ? { userId } : {};
  return this.prisma.order.findMany({
    where,
    include: {
      items: { include: { product: true } },
      user: { select: USER_SELECT },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async findOne(id: string, userId: string, role: Role) {
  const order = await this.prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      user: { select: USER_SELECT },
    },
  });

  if (!order) throw new NotFoundException('Commande introuvable');

  if (role === Role.CLIENT && order.userId !== userId) {
    throw new ForbiddenException('Accès refusé à cette commande');
  }

  return order;
}

  async updateStatus(id: string, dto: UpdateOrderDto) {
    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id } });
      if (!order) throw new NotFoundException('Commande introuvable');

      assertValidTransition(order.status, dto.status);

      // Restitution du stock en cas d'annulation
      if (dto.status === OrderStatus.CANCELLED) {
        const items = await tx.orderItem.findMany({ where: { orderId: id } });
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      return tx.order.update({
        where: { id },
        data: { status: dto.status },
        include: { items: true, user: { select: USER_SELECT } },
      });
    });

    
    if (dto.status === OrderStatus.CANCELLED) {
      await this.notificationsQueue.enqueueOrderCancelled(
        updatedOrder.user.email,
        updatedOrder.id,
        updatedOrder.totalAmount.toNumber(),
        false,
      );
    }

    return updatedOrder;
  }

 
  async refundOrder(id: string, currentUser: AuthenticatedUser) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Commande introuvable');

    if (currentUser.role === Role.CLIENT && order.userId !== currentUser.userId) {
      throw new ForbiddenException('Accès refusé à cette commande');
    }

    if (order.status !== OrderStatus.PAID) {
      throw new BadRequestException(
        `Seule une commande au statut PAID peut être remboursée (statut actuel : ${order.status})`,
      );
    }

    if (!order.stripePaymentIntentId) {
      throw new BadRequestException(
        "Cette commande n'a pas de paiement Stripe associé, impossible de la rembourser",
      );
    }

    
    assertValidTransition(order.status, OrderStatus.CANCELLED);

    await this.paymentService.refundPayment(order.stripePaymentIntentId);

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      const items = await tx.orderItem.findMany({ where: { orderId: id } });
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
        include: { items: true, user: { select: USER_SELECT } },
      });
    });

    await this.notificationsQueue.enqueueOrderCancelled(
      updatedOrder.user.email,
      updatedOrder.id,
      updatedOrder.totalAmount.toNumber(),
      true,
    );

    return updatedOrder;
  }
}