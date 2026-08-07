import {
  Component,
  HostListener,
  Input,
  Output,
  EventEmitter,
  inject,
  ElementRef,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Category } from '../../core/models/category.model';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private elementRef = inject(ElementRef<HTMLElement>);

  @Input() cartItems: any[] = [];
  @Input() searchQuery = '';
  @Input() categories: Category[] = [];

  @Output() cartOpen = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();

  scrolled = false;
  catOpen = false;

  // --- User dropdown menu ---
  userMenuOpen = false;
  private hoverCloseTimeout: ReturnType<typeof setTimeout> | null = null;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get wishlistCount(): number {
    return this.cartService.wishlistCount();
  }

  get cartCount(): number {
    return this.cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 20;
  }

  toggleCategoryDropdown() {
    this.catOpen = !this.catOpen;
  }

  closeCategoryDropdown() {
    this.catOpen = false;
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchChange.emit(input.value);
  }

  onCartOpen() {
    this.cartOpen.emit();
  }

  // --- User menu behavior ---

  /** Ouvre le menu au survol (desktop). Annule toute fermeture programmée. */
  onUserMenuMouseEnter() {
    this.cancelScheduledClose();
    this.userMenuOpen = true;
  }

  /** Ferme le menu avec un léger délai pour permettre à la souris de
   *  traverser l'espace entre l'icône et le menu sans le fermer. */
  onUserMenuMouseLeave() {
    this.cancelScheduledClose();
    this.hoverCloseTimeout = setTimeout(() => {
      this.userMenuOpen = false;
    }, 150);
  }

  private cancelScheduledClose() {
    if (this.hoverCloseTimeout) {
      clearTimeout(this.hoverCloseTimeout);
      this.hoverCloseTimeout = null;
    }
  }

  /** Vrai sur les appareils qui supportent réellement le survol (souris précise).
   *  Sur ces appareils, seul le hover doit piloter le menu — le clic sur l'icône
   *  ne doit jamais entrer en conflit avec lui. */
  private supportsHover(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    );
  }

  /** Toggle au clic — nécessaire uniquement sur mobile/tactile où le hover n'existe pas.
   *  Sur desktop, le survol gère déjà l'ouverture/fermeture : on ignore le clic sur
   *  l'icône pour éviter qu'il ne referme un menu que la souris vient d'ouvrir. */
  toggleUserMenu(event: Event) {
    event.stopPropagation();
    if (this.supportsHover()) {
      return;
    }
    this.cancelScheduledClose();
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.cancelScheduledClose();
    this.userMenuOpen = false;
  }

  goToProfile() {
    this.closeUserMenu();
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.closeUserMenu();
        this.router.navigate(['/']);
      },
      error: () => {
        // Même en cas d'erreur réseau, on considère la session locale terminée.
        this.closeUserMenu();
        this.router.navigate(['/']);
      },
    });
  }

  /** Ferme le menu utilisateur si un clic a lieu en dehors de celui-ci. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.userMenuOpen) return;
    const target = event.target as Node;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeUserMenu();
    }
  }

  /** Ferme le menu utilisateur avec la touche Escape. */
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.userMenuOpen) {
      this.closeUserMenu();
    }
  }
}