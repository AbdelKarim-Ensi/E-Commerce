import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '@services/orders.service';
import { Order, OrderStatus } from '@models/order.model';

type StatusFilter = 'ALL' | OrderStatus;

/**
 * Miroir côté client de order-status.state-machine.ts (backend).
 * Sert uniquement à proposer les bons boutons dans l'UI — le backend
 * reste la seule source de vérité et revalidera via assertValidTransition().
 */
const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

const STATUS_STEPS: OrderStatus[] = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'En attente',
  PAID: 'Payée',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders {
  private ordersService = inject(OrdersService);

  isLoading = signal(true);
  orders = signal<Order[]>([]);
  statusFilter = signal<StatusFilter>('ALL');

  selectedOrder = signal<Order | null>(null);
  isUpdatingStatus = signal(false);
  errorMessage = signal<string | null>(null);

  readonly statusSteps = STATUS_STEPS;
  readonly statusLabels = STATUS_LABELS;

  readonly tabs: { value: StatusFilter; label: string }[] = [
    { value: 'ALL', label: 'Toutes' },
    { value: 'PENDING', label: 'En attente' },
    { value: 'PAID', label: 'Payées' },
    { value: 'SHIPPED', label: 'Expédiées' },
    { value: 'DELIVERED', label: 'Livrées' },
    { value: 'CANCELLED', label: 'Annulées' },
  ];

  filteredOrders = computed(() => {
    const filter = this.statusFilter();
    const orders = this.orders();
    if (filter === 'ALL') return orders;
    return orders.filter((o) => o.status === filter);
  });

  countFor(status: StatusFilter): number {
    if (status === 'ALL') return this.orders().length;
    return this.orders().filter((o) => o.status === status).length;
  }

  ngOnInit() {
    this.loadOrders();
  }

  private loadOrders() {
    this.isLoading.set(true);
    this.ordersService.getAll().subscribe({
      next: (orders) => {
        this.orders.set(orders ?? []);
        this.isLoading.set(false);

        // Garde le drawer synchronisé si une commande ouverte a changé
        const current = this.selectedOrder();
        if (current) {
          const refreshed = orders.find((o) => o.id === current.id);
          this.selectedOrder.set(refreshed ?? null);
        }
      },
      error: () => {
        this.orders.set([]);
        this.isLoading.set(false);
      },
    });
  }

  setFilter(filter: StatusFilter) {
    this.statusFilter.set(filter);
  }

  openDrawer(order: Order) {
    this.selectedOrder.set(order);
    this.errorMessage.set(null);
  }

  closeDrawer() {
    this.selectedOrder.set(null);
    this.errorMessage.set(null);
  }

  nextStatuses(order: Order): OrderStatus[] {
    return ORDER_TRANSITIONS[order.status] ?? [];
  }

  changeStatus(order: Order, newStatus: OrderStatus) {
    this.isUpdatingStatus.set(true);
    this.errorMessage.set(null);

    this.ordersService.updateStatus(order.id, newStatus).subscribe({
      next: () => {
        this.isUpdatingStatus.set(false);
        this.loadOrders();
      },
      error: () => {
        this.isUpdatingStatus.set(false);
        this.errorMessage.set('Impossible de changer le statut de cette commande.');
      },
    });
  }

  stepIndex(status: OrderStatus): number {
    return this.statusSteps.indexOf(status);
  }

  statusBadgeClasses(status: OrderStatus): string {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      case 'PAID':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'SHIPPED':
        return 'bg-indigo-50 text-indigo-700 ring-indigo-600/20';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 ring-red-600/20';
    }
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

  customerEmail(order: Order): string | null {
    return order.user?.email ?? null;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatPrice(value: string): string {
    return parseFloat(value).toFixed(2);
  }
}