import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { ShowcaseService } from '../../core/services/showcase.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private cartService = inject(CartService);
  private router = inject(Router);
  private showcaseService = inject(ShowcaseService);

  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  protected isWishlistAnimating = false;
  protected isCartAnimating = false;

  get wishlisted(): boolean {
    return this.cartService.isWishlisted(this.product.id);
  }

  onCardClick() {
    this.showcaseService.setProduct(this.product);
    this.router.navigate(['/products', this.product.id]);
  }

  onWishlistClick(event: MouseEvent) {
    event.stopPropagation();
    this.isWishlistAnimating = true;
    setTimeout(() => (this.isWishlistAnimating = false), 200);
    this.cartService.toggleWishlist(this.product.id);
  }

  onCartClick(event: MouseEvent) {
    event.stopPropagation();
    this.isCartAnimating = true;
    setTimeout(() => (this.isCartAnimating = false), 200);
    this.cartService.addItem(this.product);
    this.addToCart.emit(this.product);
  }
}