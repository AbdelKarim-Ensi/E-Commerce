import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ProductCard } from '../../../shared/product-card/product-card';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.css',
})
export class FeaturedProducts {
  @Input() products: Product[] = [];
  @Output() addToCart = new EventEmitter<Product>();
}