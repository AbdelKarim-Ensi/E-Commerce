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

  // Vrai dès que l'URL courante commence par /admin.
  // Navbar/Footer (boutique) n'ont rien à faire sur les pages admin,
  // qui ont leur propre layout (AdminLayout, sidebar dédiée).
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

        // La recherche de la navbar est globale (le champ vit dans App,
        // pas dans une page précise) : sans ce reset, le texte tapé reste
        // affiché même après avoir navigué vers une fiche produit, une
        // catégorie ou l'admin, ce qui donne l'impression d'un champ
        // "bloqué" en focus. On ne le vide pas si on est justement en
        // train d'atterrir sur /products avec ce même terme de recherche
        // (cas du submit ci-dessous), pour ne pas effacer ce que
        // l'utilisateur vient de valider.
        const isOnProductsSearch = event.urlAfterRedirects.startsWith('/products');
        if (!isOnProductsSearch) {
          this.searchQuery = '';
        }
      });
  }

  protected onSearch(query: string) {
    this.searchQuery = query;
  }

  /**
   * Déclenché quand l'utilisateur valide sa recherche (touche Entrée dans
   * la navbar). Jusqu'ici rien ne consommait la saisie : elle restait
   * affichée sans jamais filtrer les produits.
   */
  protected onSearchSubmit(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;
    this.router.navigate(['/products'], { queryParams: { search: trimmed } });
  }
}