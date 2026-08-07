import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { OrdersService } from './orders.service';
import { PaymentService } from './payment.service';
import { ShippingOption, PaymentTab, CheckoutStep, ShippingAddress } from '../models/checkout.model';

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'standard', label: 'Standard Delivery', description: '5-7 business days', price: 0 },
  { id: 'express',  label: 'Express Delivery',  description: '2-3 business days', price: 9.99 },
  { id: 'nextday',  label: 'Next Day Delivery', description: 'Arrives tomorrow',  price: 24.99 },
];

const VALID_PROMOS: Record<string, number> = {
  TECH20: 0.20,
  GEAR10: 0.10,
};

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private cartService = inject(CartService);
  private ordersService = inject(OrdersService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  readonly items = this.cartService.items;

  readonly step = signal<CheckoutStep>(1);
  readonly selectedShipping = signal<ShippingOption>(SHIPPING_OPTIONS[0]);
  readonly paymentTab = signal<PaymentTab>('card');
  readonly promoCode = signal('');
  readonly promoDiscount = signal(0);
  readonly promoStatus = signal<'idle' | 'valid' | 'invalid' | 'empty'>('idle');
  readonly isPlacingOrder = signal(false);
  readonly mobileSummaryOpen = signal(false);
  readonly shippingAddress = signal<ShippingAddress | null>(null);
  readonly orderError = signal<string | null>(null);

  readonly subtotal = this.cartService.subtotal;

  readonly promoSavings = computed(() =>
    Math.round(this.subtotal() * this.promoDiscount() * 100) / 100
  );
  readonly shippingCost = computed(() => this.selectedShipping().price);
  readonly tax = computed(() =>
    Math.round((this.subtotal() - this.promoSavings()) * 0.085 * 100) / 100
  );
  readonly total = computed(() =>
    this.subtotal() - this.promoSavings() + this.shippingCost() + this.tax()
  );

  applyPromo(code: string) {
    if (!code.trim()) { this.promoStatus.set('empty'); return; }
    const rate = VALID_PROMOS[code.trim().toUpperCase()];
    if (rate) {
      this.promoDiscount.set(rate);
      this.promoStatus.set('valid');
    } else {
      this.promoDiscount.set(0);
      this.promoStatus.set('invalid');
    }
  }

  setShippingAddress(address: ShippingAddress) {
    this.shippingAddress.set(address);
    this.nextStep();
  }

  goToStep(s: CheckoutStep) { this.step.set(s); }
  nextStep() { if (this.step() < 3) this.step.update(s => (s + 1) as CheckoutStep); }
  prevStep() { if (this.step() > 1) this.step.update(s => (s - 1) as CheckoutStep); }

  async placeOrder() {
    const address = this.shippingAddress();
    if (!address) {
      this.orderError.set('Missing shipping address.');
      return;
    }

    this.isPlacingOrder.set(true);
    this.orderError.set(null);

    try {
      const order: any = await firstValueFrom(
        this.ordersService.create({
          items: this.items().map(i => ({
            productId: i.product.id,
            quantity: i.quantity,
            selectedColor: i.selectedColor,
            selectedStorage: i.selectedStorage,
          })),
          shippingAddress: address,
          shippingMethod: this.selectedShipping().id,
          promoCode: this.promoStatus() === 'valid' ? this.promoCode() : null,
        })
      );

      await firstValueFrom(this.paymentService.createIntent(order.id));

      this.cartService.items().forEach(i => this.cartService.remove(i.product.id));

      this.router.navigate(['/orders', order.id]);

    } catch (err) {
      console.error('Erreur lors de la création de la commande', err);
      this.orderError.set('Something went wrong while placing your order. Please try again.');
    } finally {
      this.isPlacingOrder.set(false);
    }
  }
}