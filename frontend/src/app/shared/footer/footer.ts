import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NewsletterService } from '@services/newsletter.service';
import { CategoriesService } from '@services/categories.service';
import { Category } from '@models/category.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  private newsletterService = inject(NewsletterService);
  private categoriesService = inject(CategoriesService);

  protected email = signal('');
  protected subscribed = signal(false);
  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected categories = signal<Category[]>([]);

  protected readonly payments = ['VISA', 'MC', 'AMEX', 'PayPal', 'Apple Pay'];
  protected readonly socials = ['T', 'I', 'F', 'Y'];

  // Coordonnées de contact — à remplacer par les vraies infos de contact.
  protected readonly contactEmail = 'contact@techgear.com';
  protected readonly contactPhone = '+216 XX XXX XXX';

  /**
   * Lien Gmail web compose direct — force l'ouverture de Gmail (pas le
   * client mail par défaut de l'OS), avec le destinataire pré-rempli.
   */
  protected readonly gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${this.contactEmail}`;

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.categories.set([]),
    });
  }

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