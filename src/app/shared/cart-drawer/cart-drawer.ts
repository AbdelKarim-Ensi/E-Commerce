import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from '../../core/models/cartItem.model';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.css',
})
export class CartDrawer {
  @Input() isOpen = false;
  @Input() items: CartItem[] = [];
  @Input() subtotal = 0;
  @Input() savings = 0;
  @Input() shipping = 0;
  @Input() total = 0;
  @Output() close = new EventEmitter<void>();
  @Output() updateQty = new EventEmitter<{ id: string; qty: number }>();
  @Output() remove = new EventEmitter<string>();

  get totalCount() {
    return this.items.reduce((s, i) => s + i.quantity, 0);
  }

  lineTotal(item: CartItem): number {
    return parseFloat(item.product.price) * item.quantity;
  }
}