import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@models/product.model';

const LOW_STOCK_THRESHOLD = 5;

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
  @Input() wishlisted = false; // état géré par le parent, pas de backend Wishlist

  @Output() addToCart = new EventEmitter<Product>();
  @Output() toggleWishlist = new EventEmitter<string>();
  @Output() selectProduct = new EventEmitter<Product>();

  get isOutOfStock(): boolean {
    return this.product.stock <= 0;
  }

  get isLowStock(): boolean {
    return !this.isOutOfStock && this.product.stock <= LOW_STOCK_THRESHOLD;
  }

  get isOnSale(): boolean {
    return !!this.product.discountPercent && this.product.discountPercent > 0;
  }

  onSelect(): void {
    this.selectProduct.emit(this.product);
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    if (!this.isOutOfStock) {
      this.addToCart.emit(this.product);
    }
  }

  onWishlist(event: Event): void {
    event.stopPropagation();
    this.toggleWishlist.emit(this.product.id);
  }
}