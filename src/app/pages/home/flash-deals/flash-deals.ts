import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Product } from '@models/product.model';

interface CountdownTime {
  h: number;
  m: number;
  s: number;
}

@Component({
  selector: 'app-flash-deals',
  standalone: true,
  imports: [],
  templateUrl: './flash-deals.html',
  styleUrl: './flash-deals.css'
})
export class FlashDeals implements OnInit, OnDestroy {
  @Input() products: Product[] = [];

  @Output() addToCart = new EventEmitter<Product>();
  @Output() selectProduct = new EventEmitter<Product>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  time: CountdownTime = { h: 5, m: 34, s: 17 };
  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      if (this.time.s > 0) {
        this.time = { ...this.time, s: this.time.s - 1 };
      } else if (this.time.m > 0) {
        this.time = { ...this.time, m: this.time.m - 1, s: 59 };
      } else if (this.time.h > 0) {
        this.time = { h: this.time.h - 1, m: 59, s: 59 };
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  scroll(direction: 'left' | 'right'): void {
    if (!this.scrollContainer) return;
    this.scrollContainer.nativeElement.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth'
    });
  }

  stockPercent(stock: number): number {
    return Math.min((stock / 100) * 100, 100);
  }

  onSelect(product: Product): void {
    this.selectProduct.emit(product);
  }

  onAddToCart(event: Event, product: Product): void {
    event.stopPropagation();
    this.addToCart.emit(product);
  }
}