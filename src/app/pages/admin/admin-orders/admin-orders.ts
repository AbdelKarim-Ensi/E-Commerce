import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '@services/orders.service';
import { Order, OrderStatus } from '@models/order.model';

type StatusFilter = 'ALL' | OrderStatus;

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

const PAGE_SIZE = 20;

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

  // État de pagination — reflète ce que renvoie le backend
  currentPage = signal(1);
  totalPages = signal(1);
  totalOrders = signal(0);
  readonly pageSize = PAGE_SIZE;

  selectedOrder = signal<Order | null>(null);
  isUpdatingStatus = signal(false);
  errorMessage = signal<string | null>(null);

  confirmingRefund = signal(false);

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

  // Le filtre par statut s'applique uniquement à la page actuellement
  // chargée (pas à l'ensemble des commandes en DB). C'est un compromis
  // volontaire pour rester simple : filtrer server-side viendrait plus
  // tard si le besoin se confirme.
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
    this.loadOrders(1);
  }

  private loadOrders(page: number) {
    this.isLoading.set(true);
    this.ordersService.getAll(page, this.pageSize).subscribe({
      next: (result) => {
        this.orders.set(result.data ?? []);
        this.currentPage.set(result.page);
        this.totalPages.set(result.totalPages);
        this.totalOrders.set(result.total);
        this.isLoading.set(false);

        const current = this.selectedOrder();
        if (current) {
          const refreshed = result.data.find((o) => o.id === current.id);
          this.selectedOrder.set(refreshed ?? null);
        }
      },
      error: () => {
        this.orders.set([]);
        this.isLoading.set(false);
      },
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.loadOrders(page);
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage() - 1);
  }

  setFilter(filter: StatusFilter) {
    this.statusFilter.set(filter);
  }

  openDrawer(order: Order) {
    this.selectedOrder.set(order);
    this.errorMessage.set(null);
    this.confirmingRefund.set(false);
  }

  closeDrawer() {
    this.selectedOrder.set(null);
    this.errorMessage.set(null);
    this.confirmingRefund.set(false);
  }

  nextStatuses(order: Order): OrderStatus[] {
    return ORDER_TRANSITIONS[order.status] ?? [];
  }

  isRefundAction(order: Order, newStatus: OrderStatus): boolean {
    return order.status === 'PAID' && newStatus === 'CANCELLED';
  }

  onStatusButtonClick(order: Order, newStatus: OrderStatus) {
    if (this.isRefundAction(order, newStatus)) {
      this.confirmingRefund.set(true);
      return;
    }
    this.changeStatus(order, newStatus);
  }

  dismissRefundConfirmation() {
    this.confirmingRefund.set(false);
  }

  changeStatus(order: Order, newStatus: OrderStatus) {
    this.isUpdatingStatus.set(true);
    this.errorMessage.set(null);

    this.ordersService.updateStatus(order.id, newStatus).subscribe({
      next: () => {
        this.isUpdatingStatus.set(false);
        this.loadOrders(this.currentPage());
      },
      error: () => {
        this.isUpdatingStatus.set(false);
        this.errorMessage.set('Impossible de changer le statut de cette commande.');
      },
    });
  }

  confirmRefund(order: Order) {
    this.isUpdatingStatus.set(true);
    this.errorMessage.set(null);

    this.ordersService.refund(order.id).subscribe({
      next: () => {
        this.isUpdatingStatus.set(false);
        this.confirmingRefund.set(false);
        this.loadOrders(this.currentPage());
      },
      error: (err) => {
        this.isUpdatingStatus.set(false);
        this.confirmingRefund.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'Le remboursement a échoué. Veuillez réessayer.',
        );
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