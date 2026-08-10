import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '@services/orders.service';
import { Order } from '@models/order.model';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  private ordersService = inject(OrdersService);

  orders = signal<Order[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.ordersService.getAll().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  parsePrice(value: string): number {
    return parseFloat(value) ?? 0;
  }
}