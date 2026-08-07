import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PaymentTab } from '../../../core/models/checkout.model';

type CardBrand = 'visa' | 'mastercard' | 'amex' | null;

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './payment-method.html',
  styleUrl: './payment-method.css',
})
export class PaymentMethod {
  @Input() activeTab: PaymentTab = 'card';
  @Output() tabChange = new EventEmitter<PaymentTab>();
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  protected submitted = false;

  protected cardForm = this.fb.group({
    cardNumber:    ['', [Validators.required, Validators.pattern(/^[\d\s]{16,19}$/)]],
    expiry:        ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvv:           ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    nameOnCard:    ['', Validators.required],
    billingIsSame: [true],
  });

  protected readonly tabs: { id: PaymentTab; label: string }[] = [
    { id: 'card',     label: 'Credit Card' },
    { id: 'paypal',   label: 'PayPal'      },
    { id: 'applepay', label: 'Apple Pay'   },
  ];

  protected get cardBrand(): CardBrand {
    const digits = (this.cardForm.get('cardNumber')?.value ?? '').replace(/\s/g, '');
    if (/^4/.test(digits)) return 'visa';
    if (/^5[1-5]/.test(digits)) return 'mastercard';
    if (/^3[47]/.test(digits)) return 'amex';
    return null;
  }

  protected isInvalid(field: string): boolean {
    const ctrl = this.cardForm.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted);
  }

  protected getError(field: string): string {
    const ctrl = this.cardForm.get(field);
    if (!ctrl?.errors) return '';
    if (ctrl.errors['required']) return 'This field is required.';
    if (ctrl.errors['pattern']) {
      if (field === 'cardNumber') return 'Please enter a valid 16-digit card number.';
      if (field === 'expiry') return 'Format must be MM/YY.';
      if (field === 'cvv') return 'Please enter a valid CVV.';
      return 'Invalid format.';
    }
    return 'Invalid value.';
  }

  protected onCardNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.cardForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });
  }

  protected onExpiryInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) {
      digits = digits.slice(0, 2) + '/' + digits.slice(2);
    }
    this.cardForm.get('expiry')?.setValue(digits, { emitEvent: false });
  }

  protected setTab(tab: PaymentTab) {
    this.tabChange.emit(tab);
  }

  protected onSubmit() {
    this.submitted = true;
    if (this.cardForm.valid) this.next.emit();
  }

  protected onContinue() {
    // Pour PayPal / Apple Pay — pas de formulaire à valider ici
    this.next.emit();
  }
}