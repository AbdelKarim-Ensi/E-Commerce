import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ReviewsService } from '@services/reviews.service';
import { Order } from '@models/order.model';
import { Product } from '@models/product.model';

interface DashboardAnalytics {
  productsCount: number;
  ordersCount: number;
  revenue: number;
  recentOrders: Order[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private http = inject(HttpClient);
  private reviewsService = inject(ReviewsService);

  isLoading = signal(true);

  productsCount = signal(0);
  ordersCount = signal(0);
  revenue = signal(0);
  recentOrders = signal<Order[]>([]);

  isLoadingRatings = signal(true);
  topRatedProducts = signal<Product[]>([]);
  lowRatedProducts = signal<Product[]>([]);

  ngOnInit() {
    this.loadDashboardData();
    this.loadRatedProducts();
  }

  private loadDashboardData() {
    this.isLoading.set(true);

    // Remplace l'ancien calcul manuel (limité aux 100 premières commandes
    // chargées, donc potentiellement faux) par les vraies agrégations DB
    // exposées par GET /admin/dashboard.
    this.http
      .get<DashboardAnalytics>(`${environment.apiUrl}/admin/dashboard`, { withCredentials: true })
      .subscribe({
        next: (analytics) => {
          this.productsCount.set(analytics.productsCount);
          this.ordersCount.set(analytics.ordersCount);
          this.revenue.set(analytics.revenue);
          this.recentOrders.set(analytics.recentOrders);
          this.isLoading.set(false);
        },
        error: () => {
          this.recentOrders.set([]);
          this.isLoading.set(false);
        },
      });
  }

  private loadRatedProducts() {
    this.isLoadingRatings.set(true);

    this.reviewsService.getTopRatedProducts(5).subscribe({
      next: (products) => this.topRatedProducts.set(products),
      error: () => this.topRatedProducts.set([]),
    });

    this.reviewsService.getLowRatedProducts(5).subscribe({
      next: (products) => {
        this.lowRatedProducts.set(products);
        this.isLoadingRatings.set(false);
      },
      error: () => {
        this.lowRatedProducts.set([]);
        this.isLoadingRatings.set(false);
      },
    });
  }

  productImage(product: Product): string {
    return product.thumbnailUrl || product.imageUrl || '/favicon.ico';
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