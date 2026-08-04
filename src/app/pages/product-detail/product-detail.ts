import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { StarRating } from '../../shared/star-rating/star-rating';

const NEW_THRESHOLD_DAYS = 14;

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [StarRating],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  @Output() addToCart = new EventEmitter<{ product: Product; color?: string; storage?: string; qty: number }>();
  @Input() product!: Product;
  @Input() wishlisted = false;
 
  @Output() toggleWishlist = new EventEmitter<string>();

  protected selectedImage = signal(0);
  protected selectedColor = signal('');
  protected selectedStorage = signal('');
  protected qty = signal(1);
  protected zoomed = signal(false);
  protected zoomX = signal(50);
  protected zoomY = signal(50);
Math: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.selectedColor.set(this.product.colors?.[0]?.name ?? '');
    this.selectedStorage.set(this.product.storage?.[0] ?? '');
  }

  get images(): string[] {
    if (this.product.images?.length) return this.product.images;
    return [this.product.imageUrl ?? '/assets/products/placeholder.jpg'];
  }

  get specEntries() {
    return Object.entries(this.product.specDetails ?? {});
  }

  get price(): number {
    return parseFloat(this.product.price);
  }

  get originalPrice(): number | null {
    return this.product.originalPrice ? parseFloat(this.product.originalPrice) : null;
  }

  get isOutOfStock() {
    return this.product.stock <= 0;
  }

  private get isNew(): boolean {
    const created = new Date(this.product.createdAt).getTime();
    const days = (Date.now() - created) / (1000 * 60 * 60 * 24);
    return days <= NEW_THRESHOLD_DAYS;
  }

  get badgeLabel(): string {
    if (this.isOutOfStock) return 'SOLD OUT';
    if (this.product.discountPercent) return `-${this.product.discountPercent}%`;
    if (this.isNew) return 'NEW';
    return '';
  }

  onMouseMove(e: MouseEvent, el: HTMLElement) {
    const r = el.getBoundingClientRect();
    this.zoomX.set(((e.clientX - r.left) / r.width) * 100);
    this.zoomY.set(((e.clientY - r.top) / r.height) * 100);
  }

  close() {
    this.router.navigate(['/']);
  }

  protected readonly trustBadges = ['Free Shipping', '2-Year Warranty', 'Secure Payment', '30-Day Returns'];
}