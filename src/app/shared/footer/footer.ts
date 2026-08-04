import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected email = signal('');
  protected subscribed = signal(false);

  protected readonly columns = [
    { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Blog', 'Partners'] },
    { title: 'Support', links: ['Help Center', 'Track Order', 'Returns & Refunds', 'Warranty Claims', 'Contact Us'] },
    { title: 'Categories', links: ['Smartphones', 'Laptops', 'Audio', 'Gaming', 'Wearables', 'Smart Home'] },
  ];
  protected readonly payments = ['VISA', 'MC', 'AMEX', 'PayPal', 'Apple Pay'];
  protected readonly socials = ['T', 'I', 'F', 'Y'];

  protected subscribe(e: Event) {
    e.preventDefault();
    if (this.email().trim()) {
      this.subscribed.set(true);
      this.email.set('');
    }
  }
}