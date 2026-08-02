import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@models/product.model';
import { StarRating } from '@shared/star-rating/star-rating';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [StarRating],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail {
  @Input({ required: true }) product!: Product;
  @Input() wishlisted = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<{ product: Product; color?: string; storage?: string; qty: number }>();
  @Output() toggleWishlist = new EventEmitter<string>();

  selectedImageIndex = 0;
  selectedColor = '';
  selectedStorage = '';
  qty = 1;
  zoomed = false;
  zoomPos = { x: 50, y: 50 };

  ngOnChanges(): void {
    this.selectedColor = this.product.colors?.[0]?.name ?? '';
    this.selectedStorage = this.product.storage?.[0] ?? '';
    this.selectedImageIndex = 0;
    this.qty = 1;
  }

  get images(): string[] {
    return this.product.images?.length
      ? this.product.images
      : [this.product.thumbnailUrl || this.product.imageUrl || 'assets/placeholder-product.webp'];
  }

  get isOutOfStock(): boolean {
    return this.product.stock <= 0;
  }

  get specEntries(): [string, string][] {
    return this.product.specDetails ? Object.entries(this.product.specDetails) : [];
  }

  readonly trustBadges = ['Free Shipping', '2-Year Warranty', 'Secure Payment', '30-Day Returns'];

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  selectColor(colorName: string): void {
    this.selectedColor = colorName;
  }

  selectStorage(storage: string): void {
    this.selectedStorage = storage;
  }

  decreaseQty(): void {
    this.qty = Math.max(1, this.qty - 1);
  }

  increaseQty(): void {
    this.qty = Math.min(this.product.stock, this.qty + 1);
  }

  onMouseMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.zoomPos = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100
    };
  }

  get zoomTransform(): string {
    return this.zoomed ? `scale(1.8)` : 'scale(1)';
  }

  get zoomOrigin(): string {
    return `${this.zoomPos.x}% ${this.zoomPos.y}%`;
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onWishlist(): void {
    this.toggleWishlist.emit(this.product.id);
  }

  onAddToCart(): void {
    if (this.isOutOfStock) return;
    this.addToCart.emit({
      product: this.product,
      color: this.selectedColor || undefined,
      storage: this.selectedStorage || undefined,
      qty: this.qty
    });
  }
}