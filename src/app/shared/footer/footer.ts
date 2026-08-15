import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '@services/newsletter.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private newsletterService = inject(NewsletterService);

  protected email = signal('');
  protected subscribed = signal(false);
  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected readonly columns = [
    { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Blog', 'Partners'] },
    { title: 'Support', links: ['Help Center', 'Track Order', 'Returns & Refunds', 'Warranty Claims', 'Contact Us'] },
    { title: 'Categories', links: ['Smartphones', 'Laptops', 'Audio', 'Gaming', 'Wearables', 'Smart Home'] },
  ];
  protected readonly payments = ['VISA', 'MC', 'AMEX', 'PayPal', 'Apple Pay'];
  protected readonly socials = ['T', 'I', 'F', 'Y'];

  protected subscribe(e: Event) {
    e.preventDefault();
    const value = this.email().trim();
    if (!value || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.newsletterService.subscribe(value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.subscribed.set(true);
        this.email.set('');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'Une erreur est survenue. Réessayez.',
        );
      },
    });
  }
}