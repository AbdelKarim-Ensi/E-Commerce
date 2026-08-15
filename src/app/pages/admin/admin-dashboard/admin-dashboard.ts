import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ReviewsService } from '@services/reviews.service';
import { OrdersService, OrderStatusCounts } from '@services/orders.service';
import { Order, OrderStatus } from '@models/order.model';
import { Product } from '@models/product.model';
import { ChartCanvas } from '@shared/chart-canvas/chart-canvas';
import type { ChartConfiguration } from 'chart.js';

interface DashboardAnalytics {
  productsCount: number;
  ordersCount: number;
  revenue: number;
  recentOrders: Order[];
}

interface RevenueByDayPoint {
  date: string; // "YYYY-MM-DD"
  revenue: number;
}

interface TopProduct {
  productId: string;
  name: string;
  quantitySold: number;
}

interface DashboardChartsData {
  days: number;
  revenueByDay: RevenueByDayPoint[];
  topProducts: TopProduct[];
}

type PeriodOption = 7 | 30 | 90;

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: '#f59e0b', // amber-500
  PAID: '#0ea5e9', // sky-500
  SHIPPED: '#8b5cf6', // violet-500
  DELIVERED: '#10b981', // emerald-500
  CANCELLED: '#ef4444', // red-500
};

const STATUS_LABELS_FR: Record<OrderStatus, string> = {
  PENDING: 'En attente',
  PAID: 'Payées',
  SHIPPED: 'Expédiées',
  DELIVERED: 'Livrées',
  CANCELLED: 'Annulées',
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ChartCanvas],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private http = inject(HttpClient);
  private reviewsService = inject(ReviewsService);
  private ordersService = inject(OrdersService);

  isLoading = signal(true);

  productsCount = signal(0);
  ordersCount = signal(0);
  revenue = signal(0);
  recentOrders = signal<Order[]>([]);

  isLoadingRatings = signal(true);
  topRatedProducts = signal<Product[]>([]);
  lowRatedProducts = signal<Product[]>([]);

  // --- Graphiques ---
  readonly periodOptions: PeriodOption[] = [7, 30, 90];
  selectedPeriod = signal<PeriodOption>(30);

  isLoadingCharts = signal(true);
  private revenueByDay = signal<RevenueByDayPoint[]>([]);
  private topProducts = signal<TopProduct[]>([]);
  private statusCounts = signal<OrderStatusCounts | null>(null);

  // Ligne : revenu par jour sur la période sélectionnée
  revenueChartData = computed<ChartConfiguration['data']>(() => {
    const points = this.revenueByDay();
    return {
      labels: points.map((p) => this.formatShortDate(p.date)),
      datasets: [
        {
          label: 'Revenu (€)',
          data: points.map((p) => p.revenue),
          borderColor: '#f97316', // orange-500, couleur de marque
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    };
  });

  readonly revenueChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v) => `${v} €` } },
    },
  };

  // Doughnut : réutilise directement getStatusCounts() (déjà utilisé pour
  // les badges d'AdminOrders) — pas de duplication backend.
  statusChartData = computed<ChartConfiguration['data']>(() => {
    const counts = this.statusCounts();
    const statuses = Object.keys(STATUS_LABELS_FR) as OrderStatus[];

    return {
      labels: statuses.map((s) => STATUS_LABELS_FR[s]),
      datasets: [
        {
          data: statuses.map((s) => counts?.[s] ?? 0),
          backgroundColor: statuses.map((s) => STATUS_COLORS[s]),
          borderWidth: 0,
        },
      ],
    };
  });

  readonly statusChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: { legend: { display: false } },
  } as any;

  // Légende construite en HTML (plutôt que le plugin legend natif de
  // Chart.js) pour garder le contrôle total sur l'espacement et
  // l'alignement — le rendu interne à Chart.js ne permet pas ce niveau
  // de personnalisation (gap, padding, alignement vertical).
  statusLegendItems = computed(() => {
    const counts = this.statusCounts();
    const statuses = Object.keys(STATUS_LABELS_FR) as OrderStatus[];

    return statuses.map((status) => ({
      status,
      label: STATUS_LABELS_FR[status],
      color: STATUS_COLORS[status],
      value: counts?.[status] ?? 0,
    }));
  });

  // Barres horizontales : top produits vendus sur la période sélectionnée
  topProductsChartData = computed<ChartConfiguration['data']>(() => {
    const products = this.topProducts();
    return {
      labels: products.map((p) => p.name),
      datasets: [
        {
          label: 'Quantité vendue',
          data: products.map((p) => p.quantitySold),
          backgroundColor: '#f97316',
          borderRadius: 4,
        },
      ],
    };
  });

  readonly topProductsChartOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  ngOnInit() {
    this.loadDashboardData();
    this.loadRatedProducts();
    this.loadStatusCounts();
    this.loadChartsData();
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

  // Comptage par statut — indépendant de la période sélectionnée pour les
  // graphiques (le doughnut reflète l'état actuel global, pas une fenêtre
  // temporelle), cohérent avec son usage dans AdminOrders.
  private loadStatusCounts() {
    this.ordersService.getStatusCounts().subscribe({
      next: (counts) => this.statusCounts.set(counts),
      error: () => {
        // Non bloquant : le doughnut affichera simplement des valeurs à 0.
      },
    });
  }

  private loadChartsData() {
    this.isLoadingCharts.set(true);

    this.http
      .get<DashboardChartsData>(`${environment.apiUrl}/admin/dashboard/charts`, {
        withCredentials: true,
        params: { days: this.selectedPeriod().toString() },
      })
      .subscribe({
        next: (data) => {
          this.revenueByDay.set(data.revenueByDay);
          this.topProducts.set(data.topProducts);
          this.isLoadingCharts.set(false);
        },
        error: () => {
          this.revenueByDay.set([]);
          this.topProducts.set([]);
          this.isLoadingCharts.set(false);
        },
      });
  }

  setPeriod(period: PeriodOption) {
    if (this.selectedPeriod() === period) return;
    this.selectedPeriod.set(period);
    this.loadChartsData();
  }

  private formatShortDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
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