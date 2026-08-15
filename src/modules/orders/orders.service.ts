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
import { OrderStatus, Prisma, Role } from '@prisma/client';
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
            unitPrice,
          });
        }

       
        let couponId: string | undefined;
        let discountAmount = 0;

        if (dto.couponCode) {
          const coupon = await tx.coupon.findUnique({
            where: { code: dto.couponCode.toUpperCase() },
          });

          if (!coupon || !coupon.isActive) {
            throw new BadRequestException('Coupon invalide');
          }
          if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            throw new BadRequestException('Coupon expiré');
          }
          if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
            throw new BadRequestException('Coupon épuisé');
          }
          if (coupon.minOrderValue && totalAmount < coupon.minOrderValue) {
            throw new BadRequestException(
              `Montant minimum requis : ${coupon.minOrderValue}`,
            );
          }

          const rawDiscount =
            coupon.type === 'PERCENTAGE'
              ? totalAmount * (coupon.value / 100)
              : coupon.value;
          discountAmount = Math.min(rawDiscount, totalAmount);
          couponId = coupon.id;

          
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }

        const finalAmount = totalAmount - discountAmount;

        const order = await tx.order.create({
          data: {
            userId,
            status: OrderStatus.PENDING,
            totalAmount: finalAmount,
            shippingAddress: dto.shippingAddress,
            couponId,
            discountAmount,
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

  /**
   * @param status  Filtre optionnel par statut exact.
   * @param search  Filtre optionnel : recherche insensible à la casse sur
   *                l'ID de commande, l'email du client, ou son nom/prénom.
   *                Appliqué côté DB pour rester exact quel que soit le
   *                volume de commandes (contrairement à un filtrage
   *                uniquement sur la page déjà chargée).
   */
  async findAll(
    userId: string,
    role: Role,
    page = 1,
    limit = 20,
    status?: OrderStatus,
    search?: string,
  ) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100); // borne haute anti-abus
    const skip = (safePage - 1) * safeLimit;

    const where: Prisma.OrderWhereInput = {
      ...(role === Role.CLIENT ? { userId } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { id: { contains: search, mode: 'insensitive' } },
              { user: { email: { contains: search, mode: 'insensitive' } } },
              { user: { firstName: { contains: search, mode: 'insensitive' } } },
              { user: { lastName: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: {
          items: { include: { product: true } },
          user: { select: USER_SELECT },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
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