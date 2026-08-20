import { Component, Output, EventEmitter, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ShippingAddress } from '../../../core/models/checkout.model';

@Component({
  selector: 'app-shipping-address-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './shipping-address-form.html',
  styleUrl: './shipping-address-form.css',
})
export class ShippingAddressForm {
  @Output() next = new EventEmitter<ShippingAddress>();

  private fb = inject(FormBuilder);

  protected form = this.fb.group({
    fullName:    ['', [Validators.required, Validators.minLength(2)]],
    email:       ['', [Validators.required, Validators.email]],
    phone:       ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{8,}$/)]],
    street:      ['', Validators.required],
    apartment:   [''],
    city:        ['', Validators.required],
    state:       ['', Validators.required],
    zip:         ['', [Validators.required, Validators.pattern(/^\d{4,10}$/)]],
    country:     ['US', Validators.required],
    saveAddress: [false],
  });

  protected submitted = false;

  protected readonly countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'AU', name: 'Australia' },
    { code: 'JP', name: 'Japan' },
  ];

  protected get f() { return this.form.controls; }

  protected isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted);
  }

  protected getError(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl?.errors) return '';
    if (ctrl.errors['required'])  return 'This field is required.';
    if (ctrl.errors['email'])     return 'Please enter a valid email address.';
    if (ctrl.errors['pattern'])   return field === 'phone' ? 'Please enter a valid phone number.' : 'Invalid format.';
    if (ctrl.errors['minlength']) return `Minimum ${ctrl.errors['minlength'].requiredLength} characters.`;
    return 'Invalid value.';
  }

  protected onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.next.emit(this.form.value as ShippingAddress);
    }
  }
}