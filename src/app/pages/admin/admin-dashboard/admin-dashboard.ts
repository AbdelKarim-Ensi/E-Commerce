import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '@services/products.service';
import { OrdersService } from '@services/orders.service';
import { Order } from '@models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private productsService = inject(ProductsService);
  private ordersService = inject(OrdersService);

  isLoading = signal(true);

  productsCount = signal(0);
  ordersCount = signal(0);
  revenue = signal(0);
  recentOrders = signal<Order[]>([]);

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.isLoading.set(true);

    this.productsService.getAll({ limit: 1 }).subscribe({
      next: (result) => this.productsCount.set(result?.total ?? 0),
      error: () => this.productsCount.set(0),
    });

    // limit=100 pour avoir un échantillon représentatif du calcul de revenu
    // et du top 5 récent — le vrai total vient de result.total, pas de la
    // taille du tableau reçu (qui n'est qu'une page, plafonnée à 100 max
    // côté backend).
    this.ordersService.getAll(1, 100).subscribe({
      next: (result) => {
        const orders = result.data;
        this.ordersCount.set(result.total);
        this.recentOrders.set(
          [...orders]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );
        this.revenue.set(
          orders
            .filter((order) => order.status !== 'CANCELLED')
            .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0)
        );
        this.isLoading.set(false);
      },
      error: () => {
        this.recentOrders.set([]);
        this.isLoading.set(false);
      },
    });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'EN ATTENTE',
      PAID: 'PAYÉE',
      SHIPPED: 'EXPÉDIÉE',
      DELIVERED: 'LIVRÉE',
      CANCELLED: 'ANNULÉE',
    };
    return labels[status] ?? status;
  }

  statusClasses(status: string): string {
    const classes: Record<string, string> = {
      PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
      PAID: 'bg-sky-50 text-sky-700 ring-sky-600/20',
      SHIPPED: 'bg-violet-50 text-violet-700 ring-violet-600/20',
      DELIVERED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
      CANCELLED: 'bg-red-50 text-red-700 ring-red-600/20',
    };
    return classes[status] ?? 'bg-slate-50 text-slate-700 ring-slate-600/20';
  }

  shortUserId(userId: string): string {
    return userId.slice(0, 8);
  }

  customerLabel(order: Order): string {
    const user = order.user;
    if (!user) return this.shortUserId(order.userId);

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return fullName || user.email;
  }
}