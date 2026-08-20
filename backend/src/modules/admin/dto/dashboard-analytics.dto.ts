// Décrit la forme de la réponse de GET /admin/dashboard.
// Pas de validation ici (c'est une réponse, pas un input) — sert juste de
// contrat de type partagé entre service et controller.
export class DashboardAnalyticsDto {
  productsCount!: number;
  ordersCount!: number;
  revenue!: number;
  recentOrders!: {
    id: string;
    status: string;
    totalAmount: string;
    createdAt: Date;
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  }[];
}