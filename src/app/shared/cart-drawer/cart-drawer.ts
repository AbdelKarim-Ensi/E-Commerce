import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from '@models/cartItem.model';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.css'
})
export class CartDrawer {
  @Input() isOpen = false;
  @Input() items: CartItem[] = [];

  @Output() closeDrawer = new EventEmitter<void>();
  @Output() updateQty = new EventEmitter<{ productId: string; qty: number }>();
  @Output() removeItem = new EventEmitter<string>();

  private readonly FREE_SHIPPING_THRESHOLD = 50;
  private readonly SHIPPING_COST = 9.99;

  get totalItemsCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get subtotal(): number {
    return this.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
  }

  get shipping(): number {
    return this.subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_COST;
  }

  get total(): number {
    return this.subtotal + this.shipping;
  }

  get amountUntilFreeShipping(): number {
    return this.FREE_SHIPPING_THRESHOLD - this.subtotal;
  }

  itemLineTotal(item: CartItem): number {
    return Number(item.product.price) * item.quantity;
  }

  onClose(): void {
    this.closeDrawer.emit();
  }

  onUpdateQty(productId: string, qty: number): void {
    if (qty < 1) return;
    this.updateQty.emit({ productId, qty });
  }

  onRemove(productId: string): void {
    this.removeItem.emit(productId);
  }
}