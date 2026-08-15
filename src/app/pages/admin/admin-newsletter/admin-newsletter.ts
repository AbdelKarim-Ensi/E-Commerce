import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '@services/newsletter.service';

@Component({
  selector: 'app-admin-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-newsletter.html',
  styleUrl: './admin-newsletter.css',
})
export class AdminNewsletter {
  private newsletterService = inject(NewsletterService);

  subject = signal('');
  message = signal('');
  ctaLink = signal('');
  ctaText = signal('');

  isSending = signal(false);
  errorMessage = signal<string | null>(null);
  successCount = signal<number | null>(null);

  get isValid(): boolean {
    return this.subject().trim().length >= 3 && this.message().trim().length >= 10;
  }

  send() {
    if (!this.isValid || this.isSending()) return;

    this.isSending.set(true);
    this.errorMessage.set(null);
    this.successCount.set(null);

    const ctaLink = this.ctaLink().trim() || undefined;
    const ctaText = this.ctaText().trim() || undefined;

    this.newsletterService
      .broadcast(this.subject().trim(), this.message().trim(), ctaLink, ctaText)
      .subscribe({
        next: (result) => {
          this.isSending.set(false);
          this.successCount.set(result.queued);
          this.subject.set('');
          this.message.set('');
          this.ctaLink.set('');
          this.ctaText.set('');
        },
        error: (err) => {
          this.isSending.set(false);
          this.errorMessage.set(
            err?.error?.message ?? "Échec de l'envoi de la newsletter.",
          );
        },
      });
  }
}