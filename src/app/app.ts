import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '@shared/navbar/navbar';
import { Footer } from '@shared/footer/footer';
import { CartDrawer } from '@shared/cart-drawer/cart-drawer';
import { CartItem } from '@models/cartItem.model';
import { Category } from '@models/category.model';
import { CartService } from '@services/cart.service';
import { CategoriesService } from '@services/categories.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, CartDrawer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  cartItems: CartItem[] = [];
  cartOpen = false;
  searchQuery = '';
  categories: Category[] = [];
  wishlistCount = 0; // 🚧 pas de backend Wishlist — placeholder à 0 pour l'instant

  constructor(
    private cartService: CartService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
    });

    this.categoriesService.getCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (err) => console.error('Erreur chargement catégories', err)
    });
  }

  onCartOpen(): void {
    this.cartOpen = true;
  }

  onCartClose(): void {
    this.cartOpen = false;
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    // 🚧 À connecter à une vraie recherche produits (ex: routerLink vers /products?search=...)
  }

  onUpdateQty(event: { productId: string; qty: number }): void {
    this.cartService.updateQuantity(event.productId, event.qty);
  }

  onRemoveItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }
}