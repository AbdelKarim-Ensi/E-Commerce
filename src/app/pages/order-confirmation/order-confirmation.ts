import { Component, inject, signal, OnInit } from '@angular/core';
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
export class OrderConfirmation implements OnInit {
  private route = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);

  protected order = signal<Order | null>(null);
  protected loading = signal(true);
  protected error = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Commande introuvable.');
      this.loading.set(false);
      return;
    }

    this.ordersService.getById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);
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
}