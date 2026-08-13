import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrdersService } from '@services/orders.service';
import { Order } from '@models/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css',
})
export class OrderConfirmation implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);

  protected order = signal<Order | null>(null);
  protected loading = signal(true);
  protected error = signal<string | null>(null);
  protected processingPayment = signal(false);

  protected cancelling = signal(false);
  protected cancelError = signal<string | null>(null);
  protected confirmingCancel = signal(false);

  private pollTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private readonly MAX_ATTEMPTS = 10;
  private readonly POLL_INTERVAL_MS = 1500;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Commande introuvable.');
      this.loading.set(false);
      return;
    }
    this.fetchAndPoll(id, 0);
  }

  ngOnDestroy() {
    if (this.pollTimeoutId) {
      clearTimeout(this.pollTimeoutId);
    }
  }

  private fetchAndPoll(id: string, attempt: number) {
    this.ordersService.getById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);

        if (order.status === 'PENDING' && attempt < this.MAX_ATTEMPTS) {
          this.processingPayment.set(true);
          this.pollTimeoutId = setTimeout(
            () => this.fetchAndPoll(id, attempt + 1),
            this.POLL_INTERVAL_MS,
          );
        } else {
          this.processingPayment.set(false);
        }
      },
      error: () => {
        this.error.set('Impossible de charger cette commande.');
        this.loading.set(false);
      },
    });
  }

  protected itemsCount(): number {
    const order = this.order();
    if (!order) return 0;
    return order.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  protected askCancelConfirmation() {
    this.confirmingCancel.set(true);
  }

  protected dismissCancelConfirmation() {
    this.confirmingCancel.set(false);
  }

  protected confirmCancel() {
    const order = this.order();
    if (!order) return;

    this.cancelling.set(true);
    this.cancelError.set(null);

    this.ordersService.refund(order.id).subscribe({
      next: (updatedOrder) => {
        this.order.set(updatedOrder);
        this.cancelling.set(false);
        this.confirmingCancel.set(false);
      },
      error: (err) => {
        this.cancelError.set(
          err?.error?.message ?? "Le remboursement a échoué. Veuillez réessayer.",
        );
        this.cancelling.set(false);
        this.confirmingCancel.set(false);
      },
    });
  }
}