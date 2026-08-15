import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

const RECENT_ORDERS_LIMIT = 5;
const TOP_PRODUCTS_LIMIT = 5;
const ALLOWED_DAYS = [7, 30, 90] as const;
const DEFAULT_DAYS = 30;

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

  /**
   * Données pour les graphiques Chart.js du dashboard :
   * - revenueByDay : somme du totalAmount groupée par jour, sur les N
   *   derniers jours (commandes non annulées uniquement)
   * - topProducts : les produits les plus vendus en quantité sur la
   *   même période, avec leur revenu associé
   *
   * @param days Fenêtre temporelle en jours. Restreint à 7/30/90 pour
   *             éviter qu'un paramètre arbitraire ne déclenche un scan
   *             coûteux sur toute la table.
   */
  async getChartsData(days: number) {
    const safeDays = ALLOWED_DAYS.includes(days as any) ? days : DEFAULT_DAYS;
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

  // Prisma groupBy ne sait pas tronquer une date au jour près, d'où le
  // recours à $queryRaw avec DATE_TRUNC (PostgreSQL).
  //
  // Le SQL ne renvoie une ligne QUE pour les jours ayant au moins une
  // commande. On comble ensuite les jours manquants avec revenue: 0,
  // pour que le frontend reçoive toujours un tableau complet et continu
  // (indispensable pour un line chart propre — sinon Chart.js relierait
  // directement deux jours non consécutifs, donnant une fausse impression
  // de continuité là où il y a en réalité un ou plusieurs jours à zéro).
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

    // Génère la plage complète de dates entre `since` et aujourd'hui inclus,
    // en comblant avec 0 les jours absents de revenueByDate.
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