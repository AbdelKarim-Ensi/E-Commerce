import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

const RECENT_ORDERS_LIMIT = 5;

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
} as const;

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics() {
    const [productsCount, ordersCount, revenueAggregate, recentOrders] =
      await this.prisma.$transaction([
        this.prisma.product.count(),
        this.prisma.order.count(),
        // Somme calculée côté DB sur TOUTES les commandes non annulées —
        // contrairement à l'ancien calcul frontend limité aux 100
        // premières commandes chargées, ce total est toujours exact.
        this.prisma.order.aggregate({
          where: { status: { not: OrderStatus.CANCELLED } },
          _sum: { totalAmount: true },
        }),
        this.prisma.order.findMany({
          include: { user: { select: USER_SELECT } },
          orderBy: { createdAt: 'desc' },
          take: RECENT_ORDERS_LIMIT,
        }),
      ]);

    return {
      productsCount,
      ordersCount,
      revenue: revenueAggregate._sum.totalAmount?.toNumber() ?? 0,
      recentOrders,
    };
  }
}