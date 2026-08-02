import { Component } from '@angular/core';

interface TrustItem {
  icon: string; // nom d'icône (voir template pour le switch)
  title: string;
  desc: string;
}

@Component({
  selector: 'app-trust-section',
  standalone: true,
  imports: [],
  templateUrl: './trust-section.html',
  styleUrl: './trust-section.css'
})
export class TrustSection {
  readonly trustItems: TrustItem[] = [
    { icon: 'shipping', title: 'Free Shipping', desc: 'On orders over 50 DT. Delivered in 2–5 business days.' },
    { icon: 'warranty', title: '2-Year Warranty', desc: 'All products come with a 2-year manufacturer warranty.' },
    { icon: 'payment', title: 'Secure Payment', desc: 'SSL encrypted checkout. Your data is always safe.' },
    { icon: 'support', title: '24/7 Support', desc: 'Expert tech support available around the clock.' }
  ];
}