import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  ShoppingBag,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
} from 'lucide-angular';
import { OrdersService } from '@services/orders.service';
import { Order } from '@models/order.model';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory implements OnInit {
  private ordersService = inject(OrdersService);

  readonly ShoppingBag = ShoppingBag;
  readonly AlertTriangle = AlertTriangle;
  readonly ChevronRight = ChevronRight;
  readonly RefreshCw = RefreshCw;

  orders = signal<Order[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Suivi par commande : quelle carte est en confirmation, laquelle est
  // en cours d'annulation, et l'éventuelle erreur associée à CETTE commande.
  confirmingCancelId = signal<string | null>(null);
  cancellingId = signal<string | null>(null);
  cancelErrorId = signal<string | null>(null);
  cancelErrorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.error.set(null);

    this.ordersService.getAll().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger vos commandes. Veuillez réessayer.');
        this.loading.set(false);
      },
    });
  }

  parsePrice(value: string): number {
    return parseFloat(value) ?? 0;
  }

  itemCount(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'PAID':
        return 'Payée';
      case 'SHIPPED':
        return 'Expédiée';
      case 'DELIVERED':
        return 'Livrée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  }

  statusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'PAID':
        return 'status-paid';
      case 'SHIPPED':
        return 'status-shipped';
      case 'DELIVERED':
        return 'status-delivered';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  askCancelConfirmation(orderId: string, event: Event): void {
    event.stopPropagation(); // évite de déclencher le routerLink de la carte
    this.confirmingCancelId.set(orderId);
    this.cancelErrorId.set(null);
  }

  dismissCancelConfirmation(event: Event): void {
    event.stopPropagation();
    this.confirmingCancelId.set(null);
  }

  confirmCancel(orderId: string, event: Event): void {
    event.stopPropagation();

    this.cancellingId.set(orderId);
    this.cancelErrorId.set(null);

    this.ordersService.refund(orderId).subscribe({
      next: (updatedOrder) => {
        this.orders.update((list) =>
          list.map((o) => (o.id === orderId ? updatedOrder : o)),
        );
        this.cancellingId.set(null);
        this.confirmingCancelId.set(null);
      },
      error: (err) => {
        this.cancelErrorId.set(orderId);
        this.cancelErrorMessage.set(
          err?.error?.message ?? "Le remboursement a échoué. Veuillez réessayer.",
        );
        this.cancellingId.set(null);
        this.confirmingCancelId.set(null);
      },
    });
  }
}