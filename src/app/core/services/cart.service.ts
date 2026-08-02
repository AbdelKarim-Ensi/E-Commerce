import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '@models/cartItem.model';
import { Product } from '@models/product.model';

const CART_STORAGE_KEY = 'techhub_cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  items$ = this.itemsSubject.asObservable();

  private loadFromStorage(): CartItem[] {
    if (typeof window === 'undefined') return []; // SSR safety
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }

  private update(items: CartItem[]): void {
    this.itemsSubject.next(items);
    this.saveToStorage(items);
  }

  get currentItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  addToCart(product: Product, quantity = 1): void {
    const items = [...this.currentItems];
    const existing = items.find(i => i.product.id === product.id);

    if (existing) {
      const newQty = Math.min(existing.quantity + quantity, product.stock);
      this.update(items.map(i => i.product.id === product.id ? { ...i, quantity: newQty } : i));
    } else {
      this.update([...items, { product, quantity: Math.min(quantity, product.stock) }]);
    }
  }

  updateQuantity(productId: string, qty: number): void {
    if (qty < 1) {
      this.removeFromCart(productId);
      return;
    }
    const items = this.currentItems.map(i =>
      i.product.id === productId ? { ...i, quantity: Math.min(qty, i.product.stock) } : i
    );
    this.update(items);
  }

  removeFromCart(productId: string): void {
    this.update(this.currentItems.filter(i => i.product.id !== productId));
  }

  clearCart(): void {
    this.update([]);
  }
}