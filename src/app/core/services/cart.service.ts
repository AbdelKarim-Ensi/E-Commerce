import { Injectable, signal, computed } from '@angular/core';
import { Product } from '@models/product.model';
import { CartItem } from '@models/cartItem.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);
  private _wishlist = signal<string[]>([]);
  private _isOpen = signal(false);

  readonly items = this._items.asReadonly();
  readonly wishlist = this._wishlist.asReadonly();
  readonly isOpen = this._isOpen.asReadonly();

  readonly totalCount = computed(() =>
    this._items().reduce((s, i) => s + i.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((s, i) => s + parseFloat(i.product.price) * i.quantity, 0)
  );

  readonly savings = computed(() =>
    this._items().reduce((s, i) => {
      if (i.product.originalPrice) {
        const diff = parseFloat(i.product.originalPrice) - parseFloat(i.product.price);
        return s + diff * i.quantity;
      }
      return s;
    }, 0)
  );

  readonly shipping = computed(() => this.subtotal() >= 50 ? 0 : 9.99);
  readonly total = computed(() => this.subtotal() + this.shipping());

  open() { this._isOpen.set(true); }
  close() { this._isOpen.set(false); }

  addItem(product: Product, color?: string, storage?: string) {
    this._items.update(items => {
      const idx = items.findIndex(
        i => i.product.id === product.id &&
             i.selectedColor === color &&
             i.selectedStorage === storage
      );
      if (idx >= 0) {
        const updated = [...items];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...items, { product, quantity: 1, selectedColor: color, selectedStorage: storage }];
    });
    this.open();
  }

  updateQty(productId: string, qty: number) {
    if (qty <= 0) this.remove(productId);
    else this._items.update(items =>
      items.map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
    );
  }

  remove(productId: string) {
    this._items.update(items => items.filter(i => i.product.id !== productId));
  }


readonly wishlistCount = computed(() => this._wishlist().length);

toggleWishlist(id: string | number) {
  const strId = String(id);
  this._wishlist.update(wl =>
    wl.includes(strId) ? wl.filter(x => x !== strId) : [...wl, strId]
  );
}

isWishlisted(id: string | number): boolean {
  if (!id) return false;
  return this._wishlist().includes(String(id));
}
}