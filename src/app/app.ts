import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { CartDrawer } from './shared/cart-drawer/cart-drawer';
import { CartService } from '@services/cart.service';
import { CategoriesService } from '@services/categories.service';
import { Category } from '@models/category.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, CartDrawer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly cartService = inject(CartService);
  private categoriesService = inject(CategoriesService);

  protected searchQuery = '';
  protected categories = signal<Category[]>([]);

  ngOnInit() {
    this.categoriesService.getCategories().subscribe({
      next: cats => this.categories.set(cats),
      error: err => console.error('Erreur chargement catégories', err),
    });
  }

  protected onSearch(query: string) {
    this.searchQuery = query;
    // TODO: navigation vers /products?search=...
  }
}