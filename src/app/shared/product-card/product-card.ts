import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
  @Input() wishlisted = false;

  @Output() addToCart = new EventEmitter<Product>();
  @Output() toggleWishlist = new EventEmitter<string>();
  @Output() selectProduct = new EventEmitter<Product>();

  protected isAnimating = false;

  onWishlistClick(event: MouseEvent) {
    // Empêche la propagation pour NE PAS ouvrir la modale produit
    event.stopPropagation();

    // Animation Pop (durée 0.2s)
    this.isAnimating = true;
    setTimeout(() => (this.isAnimating = false), 200);

    // Émission de l'événement toggle pour cet ID précis
    this.toggleWishlist.emit(this.product.id);
  }

  onCartClick(event: MouseEvent) {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }
}