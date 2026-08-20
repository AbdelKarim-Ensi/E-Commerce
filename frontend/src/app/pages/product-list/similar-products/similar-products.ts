import { Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '@services/products.service';
import { Product } from '@models/product.model';
import { ProductCard } from '../../../shared/product-card/product-card';

const FETCH_POOL_SIZE = 12;
const DISPLAY_COUNT = 4;

@Component({
  selector: 'app-similar-products',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './similar-products.html',
})
export class SimilarProducts {
  private productsService = inject(ProductsService);

  /** Produit actuellement affiché — sert de base au calcul de similarité. */
  currentProduct = input.required<Product>();

  similarProducts = signal<Product[]>([]);
  isLoading = signal(true);

  constructor() {
    effect(() => {
      const product = this.currentProduct();
      this.fetchSimilar(product);
    });
  }

  private fetchSimilar(product: Product): void {
    this.isLoading.set(true);

    this.productsService
      .getAll({ categoryId: product.categoryId, limit: FETCH_POOL_SIZE })
      .subscribe({
        next: (res) => {
          const filtered = res.data.filter((p) => p.id !== product.id);

          // Tri pondéré : même marque d'abord, le reste ensuite — à score
          // égal, on conserve l'ordre renvoyé par l'API.
          const sorted = [...filtered].sort((a, b) => {
            const scoreA = a.brand && a.brand === product.brand ? 1 : 0;
            const scoreB = b.brand && b.brand === product.brand ? 1 : 0;
            return scoreB - scoreA;
          });

          this.similarProducts.set(sorted.slice(0, DISPLAY_COUNT));
          this.isLoading.set(false);
        },
        error: () => {
          this.similarProducts.set([]);
          this.isLoading.set(false);
        },
      });
  }
}