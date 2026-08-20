import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PaymentTab, PaymentMethodSubmit } from '../../../core/models/checkout.model';
import { StripeService } from '../../../core/services/stripe.service';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './payment-method.html',
  styleUrl: './payment-method.css',
})
export class PaymentMethod implements OnChanges {
  @Input() activeTab: PaymentTab = 'card';
  @Output() tabChange = new EventEmitter<PaymentTab>();
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<PaymentMethodSubmit | void>();

  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  protected readonly stripeService = inject(StripeService);
  protected submitted = false;
  protected mountError: string | null = null;

  protected cardholderForm = this.fb.group({
    nameOnCard:    ['', Validators.required],
    billingIsSame: [true],
  });

  protected readonly tabs: { id: PaymentTab; label: string }[] = [
    { id: 'card',     label: 'Credit Card' },
    { id: 'paypal',   label: 'PayPal'      },
    { id: 'applepay', label: 'Apple Pay'   },
  ];

  constructor() {
   
    afterNextRender(() => {
      if (this.activeTab === 'card') {
        this.mountCardElement();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!isPlatformBrowser(this.platformId)) return;
    // On ignore le tout premier changement : il est déjà géré par afterNextRender.
    // Ce hook ne gère plus que les changements d'onglet APRÈS le montage initial
    // (ex: l'utilisateur clique PayPal puis revient sur Card).
    if (changes['activeTab'] && !changes['activeTab'].firstChange && this.activeTab === 'card') {
      this.mountCardElement();
    }
  }

  private async mountCardElement() {
    this.mountError = null;
    try {
      await this.stripeService.mountCard('stripe-card-element');
    } catch (err) {
      console.error('[Stripe] Échec du montage de l\'élément carte:', err);
      this.mountError = err instanceof Error
        ? err.message
        : 'Impossible de charger le formulaire de paiement. Veuillez rafraîchir la page.';
    }
  }

  protected isInvalid(field: string): boolean {
    const ctrl = this.cardholderForm.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted);
  }

  protected setTab(tab: PaymentTab) {
    this.tabChange.emit(tab);
  }

  protected get canSubmitCard(): boolean {
    return this.cardholderForm.get('nameOnCard')!.valid && this.stripeService.cardComplete();
  }

  protected onSubmit() {
    this.submitted = true;
    if (!this.canSubmitCard) return;
    this.next.emit({ cardholderName: this.cardholderForm.get('nameOnCard')!.value! });
  }

  protected onContinue() {
    this.next.emit();
  }
}