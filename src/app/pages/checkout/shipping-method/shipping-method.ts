import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ShippingOption } from '../../../core/models/checkout.model';
import { SHIPPING_OPTIONS } from '../../../core/services/checkout.service';

@Component({
  selector: 'app-shipping-method',
  standalone: true,
  templateUrl: './shipping-method.html',
  styleUrl: './shipping-method.css',
})
export class ShippingMethod {
  @Input() selected!: ShippingOption;
  @Output() select = new EventEmitter<ShippingOption>();

  protected readonly options = SHIPPING_OPTIONS;
}