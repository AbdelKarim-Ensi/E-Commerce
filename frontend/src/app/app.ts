import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
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
  private router = inject(Router);

  protected searchQuery = '';
  protected categories = signal<Category[]>([]);

  protected isAdminRoute = signal(this.router.url.startsWith('/admin'));

  ngOnInit() {
    this.categoriesService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => console.error('Erreur chargement catégories', err),
    });

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.isAdminRoute.set(event.urlAfterRedirects.startsWith('/admin'));

        const isOnProductsSearch = event.urlAfterRedirects.startsWith('/products');
        if (!isOnProductsSearch) {
          this.searchQuery = '';
        }
      });
  }

  protected onSearch(query: string) {
    this.searchQuery = query;
  }


  protected onSearchSubmit(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;
    this.router.navigate(['/products'], { queryParams: { search: trimmed } });
  }
}