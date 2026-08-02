import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  email = '';
  subscribed = false;

  readonly footerColumns = [
    { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Blog', 'Partners'] },
    { title: 'Support', links: ['Help Center', 'Track Order', 'Returns & Refunds', 'Warranty Claims', 'Contact Us'] },
    { title: 'Categories', links: ['Smartphones', 'Laptops', 'Audio', 'Gaming', 'Wearables', 'Smart Home'] }
  ];

  readonly socials = ['twitter', 'instagram', 'facebook', 'youtube'];
  readonly payments = ['VISA', 'MC', 'AMEX', 'PayPal', 'Apple Pay'];

  onSubscribe(event: Event): void {
    event.preventDefault();
    if (this.email.trim()) {
      // ⚠️ Pas d'endpoint backend "POST /newsletter" — simulation UI uniquement
      this.subscribed = true;
      this.email = '';
    }
  }

  socialInitial(s: string): string {
    return s.charAt(0).toUpperCase();
  }
}