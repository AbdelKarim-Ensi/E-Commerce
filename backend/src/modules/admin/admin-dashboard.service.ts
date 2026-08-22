import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

const RECENT_ORDERS_LIMIT = 5;
const TOP_PRODUCTS_LIMIT = 5;
const ALLOWED_DAYS = [7, 30, 90] as const;
type AllowedDays = (typeof ALLOWED_DAYS)[number];
const DEFAULT_DAYS = 30;

function isAllowedDays(value: number): value is AllowedDays {
  return (ALLOWED_DAYS as readonly number[]).includes(value);
}

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
} as const;

interface RevenueByDayRow {
  date: Date;
  revenue: string | null; // Prisma renvoie les DECIMAL en string via $queryRaw
}

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics() {
    const [productsCount, ordersCount, revenueAggregate, recentOrders] =
      await this.prisma.$transaction([
        this.prisma.product.count(),
        this.prisma.order.count(),

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

  async getChartsData(days: number) {
    const safeDays = isAllowedDays(days) ? days : DEFAULT_DAYS;
    const since = new Date();
    since.setDate(since.getDate() - safeDays);
    since.setHours(0, 0, 0, 0);

    const [revenueRows, topProductsRaw] = await Promise.all([
      this.getRevenueByDay(since),
      this.getTopProducts(since),
    ]);

    return {
      days: safeDays,
      revenueByDay: revenueRows,
      topProducts: topProductsRaw,
    };
  }

  private async getRevenueByDay(since: Date) {
    const rows = await this.prisma.$queryRaw<RevenueByDayRow[]>`
      SELECT
        DATE_TRUNC('day', "createdAt") AS date,
        SUM("totalAmount") AS revenue
      FROM "Order"
      WHERE "createdAt" >= ${since}
        AND "status" != ${OrderStatus.CANCELLED}::"OrderStatus"
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC
    `;

    const revenueByDate = new Map<string, number>();
    for (const row of rows) {
      const key = row.date.toISOString().slice(0, 10);
      revenueByDate.set(key, row.revenue ? parseFloat(row.revenue) : 0);
    }

    const result: { date: string; revenue: number }[] = [];
    const cursor = new Date(since);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (cursor <= today) {
      const key = cursor.toISOString().slice(0, 10);
      result.push({ date: key, revenue: revenueByDate.get(key) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  }

  private async getTopProducts(since: Date) {
    const grouped = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: { gte: since },
          status: { not: OrderStatus.CANCELLED },
        },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: TOP_PRODUCTS_LIMIT,
    });

    if (grouped.length === 0) return [];

    const products = await this.prisma.product.findMany({
      where: { id: { in: grouped.map((g) => g.productId) } },
      select: { id: true, name: true },
    });
    const nameById = new Map(products.map((p) => [p.id, p.name]));

    return grouped.map((g) => ({
      productId: g.productId,
      name: nameById.get(g.productId) ?? 'Produit supprimé',
      quantitySold: g._sum.quantity ?? 0,
    }));
  }
}
