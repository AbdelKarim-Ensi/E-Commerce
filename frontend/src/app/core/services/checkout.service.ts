import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from '@services/cart.service';
import { OrdersService } from '@services/orders.service';
import { PaymentService } from '@services/payment.service';
import { StripeService } from '@services/stripe.service';
import { CouponsService } from '@services/coupons.service';
import { ShippingOption, PaymentTab, CheckoutStep, ShippingAddress, PaymentMethodSubmit } from '@models/checkout.model';

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'standard', label: 'Standard Delivery', description: '5-7 business days', price: 0 },
  { id: 'express',  label: 'Express Delivery',  description: '2-3 business days', price: 9.99 },
  { id: 'nextday',  label: 'Next Day Delivery', description: 'Arrives tomorrow',  price: 24.99 },
];

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private cartService = inject(CartService);
  private ordersService = inject(OrdersService);
  private paymentService = inject(PaymentService);
  private stripeService = inject(StripeService);
  private couponsService = inject(CouponsService);
  private router = inject(Router);

  readonly items = this.cartService.items;

  readonly step = signal<CheckoutStep>(1);
  readonly selectedShipping = signal<ShippingOption>(SHIPPING_OPTIONS[0]);
  readonly paymentTab = signal<PaymentTab>('card');
  readonly promoCode = signal('');
  readonly promoDiscount = signal(0); // montant fixe en devise, renvoyé par le backend
  readonly promoStatus = signal<'idle' | 'valid' | 'invalid' | 'empty'>('idle');
  readonly isApplyingPromo = signal(false);
  readonly isPlacingOrder = signal(false);
  readonly mobileSummaryOpen = signal(false);
  readonly shippingAddress = signal<ShippingAddress | null>(null);
  readonly orderError = signal<string | null>(null);

  private appliedCouponCode = signal<string | null>(null);
  private cardholderName = signal<string | null>(null);

  readonly subtotal = this.cartService.subtotal;

  readonly promoSavings = computed(() => this.promoDiscount());
  readonly shippingCost = computed(() => this.selectedShipping().price);
  readonly tax = computed(() =>
    Math.round((this.subtotal() - this.promoSavings()) * 0.085 * 100) / 100
  );
  readonly total = computed(() =>
    this.subtotal() - this.promoSavings() + this.shippingCost() + this.tax()
  );

  async applyPromo(code: string) {
    const trimmed = code.trim();
    if (!trimmed) {
      this.promoStatus.set('empty');
      return;
    }

    this.isApplyingPromo.set(true);

    try {
      const result = await firstValueFrom(
        this.couponsService.validate(trimmed.toUpperCase(), this.subtotal())
      );
      this.promoDiscount.set(result.discountAmount);
      this.appliedCouponCode.set(result.code);
      this.promoStatus.set('valid');
    } catch (err) {
      this.promoDiscount.set(0);
      this.appliedCouponCode.set(null);
      this.promoStatus.set('invalid');
    } finally {
      this.isApplyingPromo.set(false);
    }
  }

  setShippingAddress(address: ShippingAddress) {
    this.shippingAddress.set(address);
    this.nextStep();
  }

  onPaymentSubmit(event: PaymentMethodSubmit | void) {
    if (event) {
      this.cardholderName.set(event.cardholderName);
    }
    this.nextStep();
  }

  goToStep(s: CheckoutStep) { this.step.set(s); }
  nextStep() { if (this.step() < 3) this.step.update(s => (s + 1) as CheckoutStep); }
  prevStep() { if (this.step() > 1) this.step.update(s => (s - 1) as CheckoutStep); }

  private formatShippingAddress(address: ShippingAddress): string {
    const parts = [
      address.fullName,
      address.street + (address.apartment ? `, ${address.apartment}` : ''),
      `${address.city}, ${address.state} ${address.zip}`,
      address.country,
      address.phone,
    ];
    return parts.filter(Boolean).join(', ');
  }

  async placeOrder() {

    if (this.isPlacingOrder()) {
      return;
    }

    const address = this.shippingAddress();
    if (!address) {
      this.orderError.set('Missing shipping address.');
      return;
    }

    if (this.paymentTab() === 'card' && !this.cardholderName()) {
      this.orderError.set('Missing card details. Please go back to the payment step.');
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
          })),
          shippingAddress: this.formatShippingAddress(address),
          ...(this.appliedCouponCode() ? { couponCode: this.appliedCouponCode()! } : {}),
        })
      );

      if (this.paymentTab() === 'card') {
        const intentResponse = await firstValueFrom(
          this.paymentService.createIntent(order.id)
        ) as { clientSecret: string; paymentIntentId: string };

        const result = await this.stripeService.confirmCardPayment(intentResponse.clientSecret, {
          name: this.cardholderName()!,
        });

        if (!result.success) {
          this.orderError.set(result.message);
          this.isPlacingOrder.set(false);
          return;
        }
      }

      this.stripeService.destroy();
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