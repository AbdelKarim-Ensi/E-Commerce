import { Component, inject } from '@angular/core';
import { CheckoutService } from '@services/checkout.service';
import { CheckoutHeader } from './checkout-header/checkout-header';
import { CheckoutStepper } from './checkout-stepper/checkout-stepper';
import { ShippingAddressForm } from './shipping-address-form/shipping-address-form';
import { ShippingMethod } from './shipping-method/shipping-method';
import { PaymentMethod } from './payment-method/payment-method';
import { OrderSummary } from './order-summary/order-summary';
import { CheckoutFooter } from './checkout-footer/checkout-footer';
import { ShippingAddress } from '@models/checkout.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CheckoutHeader,
    CheckoutStepper,
    ShippingAddressForm,
    ShippingMethod,
    PaymentMethod,
    OrderSummary,
    CheckoutFooter,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  protected readonly checkout = inject(CheckoutService);

  protected onShippingSubmit(address: ShippingAddress) {
    this.checkout.setShippingAddress(address);
  }
}