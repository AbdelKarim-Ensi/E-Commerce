import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@models/product.model';
import { ProductCard } from '@shared/product-card/product-card';
import { NgTemplateOutlet } from '@angular/common';

type SortOption = 'featured' | 'price-asc' | 'price-desc';

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' }
];

const PRICE_PRESETS: [number, number][] = [
  [0, 200], [200, 500], [500, 1000], [1000, 2000]
];

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [ProductCard, NgTemplateOutlet],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.css'
})
export class FeaturedProducts {
  @Input() products: Product[] = [];
  @Input() activeCategory = '';

  @Output() addToCart = new EventEmitter<Product>();
  @Output() selectProduct = new EventEmitter<Product>();

  readonly sortOptions = sortOptions;
  readonly pricePresets = PRICE_PRESETS;

  priceRange: [number, number] = [0, 2000];
  inStockOnly = false;
  sort: SortOption = 'featured';
  sidebarOpen = false;

  selectedBrands: Set<string> = new Set();
  minRating: number | null = null;

  readonly ratingOptions = [4.5, 4, 3.5];

  get availableBrands(): string[] {
    const brands = new Set<string>();
    for (const p of this.products) {
      if (p.brand) brands.add(p.brand);
    }
    return Array.from(brands).sort();
  }

  get filtered(): Product[] {
    let list = [...this.products];

    if (this.activeCategory) {
      list = list.filter(p => p.categoryId === this.activeCategory);
    }

    if (this.selectedBrands.size > 0) {
      list = list.filter(p => p.brand && this.selectedBrands.has(p.brand));
    }

    list = list.filter(p => {
      const price = Number(p.price);
      return price >= this.priceRange[0] && price <= this.priceRange[1];
    });

    if (this.inStockOnly) {
      list = list.filter(p => p.stock > 0);
    }

    if (this.minRating !== null) {
      list = list.filter(p => (p.rating ?? 0) >= this.minRating!);
    }

    switch (this.sort) {
      case 'price-asc':
        return list.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price-desc':
        return list.sort((a, b) => Number(b.price) - Number(a.price));
      default:
        return list;
    }
  }

  get hasFilters(): boolean {
    return (
      this.priceRange[0] > 0 ||
      this.priceRange[1] < 2000 ||
      this.inStockOnly ||
      this.selectedBrands.size > 0
    );
  }

  toggleBrand(brand: string): void {
    if (this.selectedBrands.has(brand)) {
      this.selectedBrands.delete(brand);
    } else {
      this.selectedBrands.add(brand);
    }
    // force change detection on the Set reference
    this.selectedBrands = new Set(this.selectedBrands);
  }

  isBrandSelected(brand: string): boolean {
    return this.selectedBrands.has(brand);
  }

  setPricePreset(lo: number, hi: number): void {
    this.priceRange = [lo, hi];
  }

  isPricePresetActive(lo: number, hi: number): boolean {
    return this.priceRange[0] === lo && this.priceRange[1] === hi;
  }

  onPriceMaxChange(value: number): void {
    this.priceRange = [this.priceRange[0], value];
  }

  toggleInStock(): void {
    this.inStockOnly = !this.inStockOnly;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  clearFilters(): void {
    this.priceRange = [0, 2000];
    this.inStockOnly = false;
    this.selectedBrands = new Set();
  }

  onSortChange(event: Event): void {
    this.sort = (event.target as HTMLSelectElement).value as SortOption;
  }

  onAddToCart(product: Product): void {
    this.addToCart.emit(product);
  }

  onSelect(product: Product): void {
    this.selectProduct.emit(product);
  }
}