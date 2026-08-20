import { Injectable, signal } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement, StripeElements, StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  
  readonly ready = signal(false);
  /** True while the card input is complete and passes Stripe's own validation. */
  readonly cardComplete = signal(false);
  /** Latest validation error message from the card element itself (e.g. "Your card number is incomplete."). */
  readonly cardError = signal<string | null>(null);

  private async ensureStripeLoaded(): Promise<Stripe> {
    if (this.stripe) return this.stripe;

    const stripe = await loadStripe(environment.stripePublishableKey);
    if (!stripe) {
      throw new Error('Impossible de charger Stripe.js. Vérifiez la clé publique configurée.');
    }
    this.stripe = stripe;
    return stripe;
  }

  
 async mountCard(containerId: string): Promise<void> {
  const stripe = await this.ensureStripeLoaded();
  const container = document.getElementById(containerId);

  // "Déjà monté" ne suffit pas comme vérification : StripeService est un
  // singleton qui survit à la destruction/recréation de PaymentMethod par
  // Angular (ex: navigation hors de /checkout puis retour). this.cardElement
  // peut alors pointer vers une iframe orpheline, plus dans le DOM, pendant
  // qu'un TOUT NOUVEAU <div id="stripe-card-element"> vide vient d'être créé.
  // On vérifie donc que le conteneur actuel contient réellement une iframe.
  if (this.cardElement && container?.querySelector('iframe')) {
    this.ready.set(true);
    return;
  }

  // Référence obsolète : on la nettoie avant de recréer proprement.
  if (this.cardElement) {
    this.cardElement.destroy();
    this.cardElement = null;
  }

  this.elements = stripe.elements();
 this.cardElement = this.elements.create('card', {
  style: {
    base: {
      fontSize: '14px',
      color: '#18181b',
      fontFamily: 'inherit',
      lineHeight: '24px',
      '::placeholder': { color: '#a1a1aa' },
    },
    invalid: {
      color: '#ef4444',
    },
  },
});

  this.cardElement.mount(`#${containerId}`);

  this.cardElement.on('change', (event: StripeCardElementChangeEvent) => {
    this.cardComplete.set(event.complete);
    this.cardError.set(event.error ? event.error.message : null);
  });

  this.ready.set(true);
}

  async confirmCardPayment(
    clientSecret: string,
    billingDetails: { name: string },
  ): Promise<{ success: true } | { success: false; message: string }> {
    if (!this.stripe || !this.cardElement) {
      return { success: false, message: 'Le formulaire de paiement n\'est pas prêt. Veuillez réessayer.' };
    }

    const result = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.cardElement,
        billing_details: { name: billingDetails.name },
      },
    });

    if (result.error) {
      return { success: false, message: result.error.message ?? 'Le paiement a été refusé.' };
    }

    if (result.paymentIntent?.status === 'succeeded') {
      return { success: true };
    }

    return {
      success: false,
      message: `Statut de paiement inattendu : ${result.paymentIntent?.status ?? 'inconnu'}.`,
    };
  }

  /** À appeler quand l'utilisateur quitte définitivement le checkout (ex: navigation vers /orders). */
  destroy(): void {
    this.cardElement?.destroy();
    this.cardElement = null;
    this.elements = null;
    this.ready.set(false);
    this.cardComplete.set(false);
    this.cardError.set(null);
  }
}