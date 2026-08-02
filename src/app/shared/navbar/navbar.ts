import { Component, Input, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '@models/cartItem.model';
import { Category } from '@models/category.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  @Input() cartItems: CartItem[] = [];
  @Input() wishlistCount = 0;
  @Input() searchQuery = '';
  @Input() categories: Category[] = []; // fourni par CategoriesService via le parent

  @Output() cartOpen = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();

  @ViewChild('dropRef') dropRef?: ElementRef<HTMLDivElement>;

  catOpen = false;
  scrolled = false;

  get cartCount(): number {
    return this.cartItems.reduce((sum, i) => sum + i.quantity, 0);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled = window.scrollY > 20;
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.dropRef && !this.dropRef.nativeElement.contains(event.target as Node)) {
      this.catOpen = false;
    }
  }

  toggleCategoryDropdown(): void {
    this.catOpen = !this.catOpen;
  }

  closeCategoryDropdown(): void {
    this.catOpen = false;
  }

  onSearchInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }

  onCartOpen(): void {
    this.cartOpen.emit();
  }
}