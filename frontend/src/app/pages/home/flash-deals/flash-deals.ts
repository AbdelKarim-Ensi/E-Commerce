import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '@models/product.model';
import { StarRating } from '../../../shared/star-rating/star-rating';
import { ShowcaseService } from '@services/showcase.service';
import { CartService } from '@services/cart.service';

@Component({
  selector: 'app-flash-deals',
  standalone: true,
  imports: [StarRating],
  templateUrl: './flash-deals.html',
  styleUrl: './flash-deals.css',
})
export class FlashDeals implements OnInit, OnDestroy {
  @Input() products: Product[] = [];
  @Output() addToCart = new EventEmitter<Product>();
  @Output() selectProduct = new EventEmitter<Product>();

  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;

  private router = inject(Router);
  private showcaseService = inject(ShowcaseService);
  private cartService = inject(CartService);

  time = { h: 5, m: 34, s: 17 };
  private timer?: ReturnType<typeof setInterval>;

  protected isCartAnimating: Record<string, boolean> = {};

  ngOnInit() {
    this.timer = setInterval(() => {
      if (this.time.s > 0) { this.time = { ...this.time, s: this.time.s - 1 }; return; }
      if (this.time.m > 0) { this.time = { ...this.time, m: this.time.m - 1, s: 59 }; return; }
      if (this.time.h > 0) { this.time = { h: this.time.h - 1, m: 59, s: 59 }; }
    }, 1000);
  }

  ngOnDestroy() { clearInterval(this.timer); }

  pad(n: number) { return String(n).padStart(2, '0'); }

  scroll(dir: 'left' | 'right') {
    this.carousel.nativeElement.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  }

  price(p: Product): number {
    return parseFloat(p.price);
  }

  originalPrice(p: Product): number | null {
    return p.originalPrice ? parseFloat(p.originalPrice) : null;
  }

  get units() {
    return [
      { val: this.time.h, label: 'Hrs' },
      { val: this.time.m, label: 'Min' },
      { val: this.time.s, label: 'Sec' },
    ];
  }

  onCardClick(product: Product) {
    this.showcaseService.setProduct(product);
    this.router.navigate(['/products', product.id]);
    this.selectProduct.emit(product);
  }

  onCartClick(event: MouseEvent, product: Product) {
    event.stopPropagation();
    this.isCartAnimating[product.id] = true;
    setTimeout(() => { this.isCartAnimating[product.id] = false; }, 200);
    this.cartService.addItem(product);
    this.addToCart.emit(product);
  }
}