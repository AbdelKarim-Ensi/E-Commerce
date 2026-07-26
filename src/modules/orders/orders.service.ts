import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { canTransition } from './order-status.state-machine';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const productIds = dto.items.map((i) => i.productId);
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });
      const productMap = new Map(products.map((p) => [p.id, p]));

      let totalAmount = 0;
      const itemsData: { productId: string; quantity: number; unitPrice: number }[] = [];

      for (const item of dto.items) {
        const product = productMap.get(item.productId);
        if (!product || !product.isActive) {
          throw new BadRequestException(`Product ${item.productId} is not available`);
        }

        const unitPrice = Number(product.price);
        totalAmount += unitPrice * item.quantity;
        itemsData.push({ productId: product.id, quantity: item.quantity, unitPrice });

        // --- Atomic stock decrement: fixes the race condition from Phase 5 ---
        // Instead of "read stock, check in JS, then write" (3 separate steps where
        // another transaction can slip in between the read and the write), this is
        // ONE statement: "decrement stock WHERE stock >= quantity". The database
        // guarantees no other transaction can observe or act on this row mid-operation
        // (row-level locking under the hood). If the WHERE clause doesn't match —
        // because stock is now too low — `count` comes back 0 and we know immediately,
        // with zero risk of two concurrent requests both succeeding on the last unit.
        const result = await tx.product.updateMany({
          where: { id: product.id, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (result.count === 0) {
          // Either stock just ran out (race lost) or was already insufficient — either
          // way, throwing here rolls back the ENTIRE transaction, including any stock
          // already decremented earlier in this loop for other items in the same order.
          throw new BadRequestException(
            `Insufficient stock for product "${product.name}"`,
          );
        }
      }

      return tx.order.create({
        data: {
          userId,
          totalAmount,
          status: OrderStatus.PENDING,
          items: { create: itemsData },
        },
        include: { items: { include: { product: true } } },
      });
    });
  }

  findAllForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true } }, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, requester?: { userId: string; role: Role }) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    if (requester && requester.role === Role.CLIENT && order.userId !== requester.userId) {
      throw new ForbiddenException('You do not have access to this order');
    }
    return order;
  }

  // --- State machine enforcement ---
  // Every status change goes through canTransition() first. This is what stops
  // someone (even an admin, even by API bug) from doing SHIPPED -> PENDING or
  // reviving a CANCELLED order — moves that make no sense once you think about
  // what each status represents in the real world (a shipped package can't un-ship).
  async update(id: string, dto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    if (!canTransition(order.status, dto.status)) {
      throw new BadRequestException(
        `Cannot transition order from ${order.status} to ${dto.status}`,
      );
    }

    if (dto.status === OrderStatus.CANCELLED) {
      return this.cancel(id);
    }

    return this.prisma.order.update({ where: { id }, data: { status: dto.status } });
  }

  // Cancelling restores stock — this ALSO needs to be atomic and transactional,
  // otherwise a crash mid-loop leaves some products restocked and others not.
  async cancel(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id }, include: { items: true } });
      if (!order) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }
      if (!canTransition(order.status, OrderStatus.CANCELLED)) {
        throw new BadRequestException(
          `Cannot cancel an order with status ${order.status}`,
        );
      }
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      return tx.order.update({ where: { id }, data: { status: OrderStatus.CANCELLED } });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.delete({ where: { id } });
  }
}