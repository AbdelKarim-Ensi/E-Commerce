import { Component } from '@angular/core';

@Component({
  selector: 'app-trust-section',
  standalone: true,
  templateUrl: './trust-section.html',
  styleUrl: './trust-section.css',
})
export class TrustSection {
  protected items = [
    { icon: 'shipping', title: 'Free Shipping', desc: 'On orders over $50. Delivered in 2–5 business days.' },
    { icon: 'warranty', title: '2-Year Warranty', desc: 'All products come with a 2-year manufacturer warranty.' },
    { icon: 'secure', title: 'Secure Payment', desc: 'SSL encrypted checkout. Your data is always safe.' },
    { icon: 'support', title: '24/7 Support', desc: 'Expert tech support available around the clock.' },
  ];
}