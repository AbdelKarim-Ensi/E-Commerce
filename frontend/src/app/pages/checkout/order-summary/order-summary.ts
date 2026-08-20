import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../core/models/cartItem.model';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css',
})
export class OrderSummary {
  @Input() items: CartItem[] = [];
  @Input() subtotal = 0;
  @Input() promoSavings = 0;
  @Input() shippingCost = 0;
  @Input() tax = 0;
  @Input() total = 0;
  @Input() promoStatus: 'idle' | 'valid' | 'invalid' | 'empty' = 'idle';
  @Input() isPlacingOrder = false;
  @Input() showPlaceOrder = false;
  @Input() isMobile = false;

  @Output() applyPromo = new EventEmitter<string>();
  @Output() placeOrder = new EventEmitter<void>();

  protected promoInput = '';

  protected get promoMessage(): { text: string; color: string } | null {
    switch (this.promoStatus) {
      case 'valid':   return { text: '✓ Promo code applied!',        color: 'text-green-600' };
      case 'invalid': return { text: '✗ Invalid promo code.',        color: 'text-red-500'   };
      case 'empty':   return { text: '⚠ Please enter a promo code.', color: 'text-amber-600' };
      default:        return null;
    }
  }

  protected lineTotal(item: CartItem): number {
    return parseFloat(item.product.price) * item.quantity;
  }

  protected readonly trustBadges = [
    {
      label: 'Secure Payment',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    },
    {
      label: 'Free Returns',
      icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6',
    },
    {
      label: '24/7 Support',
      icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
    },
  ];
}