import { Component, HostListener, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Category } from '../../core/models/category.model';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private cartService = inject(CartService);

  @Input() cartItems: any[] = [];
  @Input() searchQuery = '';
  @Input() categories: Category[] = [];

  @Output() cartOpen = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();

  scrolled = false;
  catOpen = false;

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
}