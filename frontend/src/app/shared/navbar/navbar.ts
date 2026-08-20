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
  /** Émis quand l'utilisateur valide sa recherche (touche Entrée). */
  @Output() searchSubmit = new EventEmitter<string>();

  scrolled = false;
  catOpen = false;

  
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

  onSearchEnter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubmit.emit(input.value);
  }

  onCartOpen() {
    this.cartOpen.emit();
  }

  onUserMenuMouseEnter() {
    this.cancelScheduledClose();
    this.userMenuOpen = true;
  }

 
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

 
  private supportsHover(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    );
  }

 
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

        this.closeUserMenu();
        this.router.navigate(['/']);
      },
    });
  }

 
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.userMenuOpen) return;
    const target = event.target as Node;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeUserMenu();
    }
  }
  get isAdmin(): boolean {
  return this.authService.isAdmin();
}

 
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.userMenuOpen) {
      this.closeUserMenu();
    }
  }
}