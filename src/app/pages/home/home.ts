import { Component, OnInit } from '@angular/core';
import { Hero } from './hero/hero';
import { TrustSection } from './trust-section/trust-section';
import { Categories } from '@shared/categories/categories';
import { FlashDeals } from './flash-deals/flash-deals';
import { FeaturedProducts } from './featured-products/featured-products';
import { ProductDetail } from '@pages/product-detail/product-detail';
import { Product } from '@models/product.model';
import { Category } from '@models/category.model';
import { ProductsService } from '@services/products.service';
import { CategoriesService } from '@services/categories.service';
import { CartService } from '@services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, TrustSection, Categories, FlashDeals, FeaturedProducts, ProductDetail],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  products: Product[] = [];
  dealProducts: Product[] = [];
  categories: Category[] = [];
  activeCategory = '';
  selectedProduct: Product | null = null;
  wishlist: string[] = []; // 🚧 pas de backend Wishlist — state local uniquement

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        // 🚧 "deal" = produits avec discountPercent défini, en attendant le vrai champ backend
        this.dealProducts = products.filter(p => !!p.discountPercent);
      },
      error: (err) => console.error('Erreur chargement produits', err)
    });

    this.categoriesService.getCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (err) => console.error('Erreur chargement catégories', err)
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
    this.cartService.addToCart(product);
  }

  onAddToCartFromDetail(event: { product: Product; color?: string; storage?: string; qty: number }): void {
    this.cartService.addToCart(event.product, event.qty);
    this.selectedProduct = null;
  }

  onToggleWishlist(productId: string): void {
    this.wishlist = this.wishlist.includes(productId)
      ? this.wishlist.filter(id => id !== productId)
      : [...this.wishlist, productId];
  }

  isWishlisted(productId: string): boolean {
    return this.wishlist.includes(productId);
  }

  scrollToFeatured(): void {
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
  }
}