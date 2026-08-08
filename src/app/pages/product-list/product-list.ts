import { Component, Input, Output, EventEmitter, signal, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductCard } from '../../shared/product-card/product-card';
import { CartService } from '../../core/services/cart.service';
import { ProductsService } from '../../core/services/products.service';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

interface PriceRange {
  label: string;
  max: number;
}

interface RatingOption {
  label: string;
  value: number;
}

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Dell', 'Logitech', 'Razer', 'LG', 'Amazon'];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
];

const PRICE_RANGES: PriceRange[] = [
  { label: '$0–$200', max: 200 },
  { label: '$200–$500', max: 500 },
  { label: '$500–$1K', max: 1000 },
  { label: '$1K–$2K', max: 2000 },
];

const RATING_OPTIONS: RatingOption[] = [
  { label: '4.5+', value: 4.5 },
  { label: '4.0+', value: 4.0 },
  { label: '3.5+', value: 3.5 },
  { label: 'Any', value: 0 },
];

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, NgTemplateOutlet, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  protected cartService = inject(CartService);

  private _inputProvided = false;

  @Input() set products(val: Product[]) {
    this._inputProvided = true;
    this._products.set(val ?? []);
  }
  @Input() set activeCategoryId(val: string) {
    this._activeCategoryId.set(val ?? '');
  }

  @Output() addToCart = new EventEmitter<Product>();

  private _products = signal<Product[]>([]);
  private _activeCategoryId = signal<string>('');

  protected sidebarOpen = signal<boolean>(false);
  protected selectedBrands = signal<string[]>([]);
  protected maxPrice = signal<number>(2000);
  protected minRating = signal<number>(0);
  protected inStockOnly = signal<boolean>(false);
  protected sort = signal<SortOption>('featured');
  protected wishlistOnly = signal<boolean>(false);

  protected readonly brands = BRANDS;
  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly priceRanges = PRICE_RANGES;
  protected readonly ratingOptions = RATING_OPTIONS;

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.wishlistOnly.set(params.get('wishlist') === 'true');

      const catId = params.get('category');
      if (catId) this._activeCategoryId.set(catId);

     
      if (!this._inputProvided) {
        this.productsService.getAll().subscribe({
          next: (res: any) => {
            const list = Array.isArray(res) ? res : (res?.data ?? []);
            this._products.set(list);
          },
          error: (err: unknown) => console.error('Erreur chargement produits', err),
        });
      }
    });
  }

  protected hasFilters = computed(() => {
    return (
      this.selectedBrands().length > 0 ||
      this.maxPrice() < 2000 ||
      this.minRating() > 0 ||
      this.inStockOnly() ||
      this.wishlistOnly()
    );
  });

  protected filtered = computed(() => {
    let list = [...this._products()];
    const catId = this._activeCategoryId();
    const brands = this.selectedBrands();

    if (this.wishlistOnly()) {
      const wishlist = this.cartService.wishlist();
      list = list.filter((p) => wishlist.includes(String(p.id)));
    }
    if (catId) {
      list = list.filter((p) => p.categoryId === catId);
    }
    if (brands.length > 0) {
      list = list.filter((p) => p.brand && brands.includes(p.brand));
    }
    list = list.filter((p) => parseFloat(p.price as any) <= this.maxPrice());
    if (this.minRating() > 0) {
      list = list.filter((p) => (p.rating ?? 0) >= this.minRating());
    }
    if (this.inStockOnly()) {
      list = list.filter((p) => p.stock > 0);
    }

    switch (this.sort()) {
      case 'price-asc':
        return list.sort((a, b) => parseFloat(a.price as any) - parseFloat(b.price as any));
      case 'price-desc':
        return list.sort((a, b) => parseFloat(b.price as any) - parseFloat(a.price as any));
      case 'rating':
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default:
        return list;
    }
  });

  toggleBrand(brand: string) {
    this.selectedBrands.update((current) =>
      current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand]
    );
  }

  setMaxPrice(max: number) {
    this.maxPrice.set(max);
  }

  clearFilters() {
    this.selectedBrands.set([]);
    this.maxPrice.set(2000);
    this.minRating.set(0);
    this.inStockOnly.set(false);
    this.wishlistOnly.set(false);
    this.router.navigate([], { queryParams: {} });
  }

  goToEarbudShowcase() {
    this.router.navigate(['/products/earbud-showcase']);
  }
}