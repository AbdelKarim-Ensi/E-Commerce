import { Component, OnInit } from '@angular/core';
import { Hero } from './hero/hero';
import { TrustSection } from './trust-section/trust-section';
import { Categories } from './categories/categories';
import { FlashDeals } from './flash-deals/flash-deals';
import { FeaturedProducts } from './featured-products/featured-products';
import { ProductList } from '@pages/product-list/product-list';
import { ProductDetail } from '@pages/product-detail/product-detail';
import { Product } from '@models/product.model';
import { Category } from '@models/category.model';
import { ProductsService } from '@services/products.service';
import { CategoriesService } from '@services/categories.service';
import { CartService } from '@services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, TrustSection, Categories, FlashDeals, ProductList, ProductDetail],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  products: Product[] = [];
  dealProducts: Product[] = [];
  categories: Category[] = [];
  activeCategory = '';
  selectedProduct: Product | null = null;

  constructor(
  private productsService: ProductsService,
  private categoriesService: CategoriesService,
  protected cartService: CartService
) {}

  ngOnInit(): void {
    this.productsService.getAll().subscribe({
  next: (res) => {
    const products = Array.isArray(res) ? res : (res?.data ?? []);
    this.products = products;
    this.dealProducts = products.filter((p: Product) => !!p.discountPercent);
  },
  error: (err: unknown) => console.error('Erreur chargement produits', err),
});

    this.categoriesService.getCategories().subscribe({
      next: (categories: Category[]) => (this.categories = categories),
      error: (err: unknown) => console.error('Erreur chargement catégories', err),
    });
  }

  onSelectCategory(categoryId: string): void {
    this.activeCategory = categoryId;
  }

  onSelectProduct(product: Product): void {
    this.selectedProduct = product;
  }

  onCloseProductDetail(): void {
    this.selectedProduct = null;
  }

  onAddToCart(product: Product): void {
    this.cartService.addItem(product);
  }

  onAddToCartFromDetail(event: { product: Product; color?: string; storage?: string; qty: number }): void {
    for (let i = 0; i < event.qty; i++) {
      this.cartService.addItem(event.product, event.color, event.storage);
    }
    this.selectedProduct = null;
  }

  onToggleWishlist(productId: string): void {
    this.cartService.toggleWishlist(productId);
  }

  isWishlisted(productId: string): boolean {
    return this.cartService.isWishlisted(productId);
  }

  scrollToFeatured(): void {
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
  }
}