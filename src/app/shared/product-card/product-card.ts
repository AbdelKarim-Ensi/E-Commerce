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

  protected isAnimating = false;

  get wishlisted(): boolean {
    return this.cartService.isWishlisted(this.product.id);
  }

  onCardClick() {
    // Stocke le produit cliqué et navigue vers le showcase avec CE produit
    this.showcaseService.setProduct(this.product);
    this.router.navigate(['/products/earbud-showcase'], {
      queryParams: { slug: this.product.id }
    });
  }

  onWishlistClick(event: MouseEvent) {
    event.stopPropagation();
    this.isAnimating = true;
    setTimeout(() => (this.isAnimating = false), 200);
    this.cartService.toggleWishlist(this.product.id);
  }

  onCartClick(event: MouseEvent) {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }
}