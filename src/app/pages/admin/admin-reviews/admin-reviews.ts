import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsService } from '@services/reviews.service';
import { AdminReview } from '@models/review.model';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reviews.html',
  styleUrl: './admin-reviews.css',
})
export class AdminReviews {
  private reviewsService = inject(ReviewsService);

  readonly pageSize = 10;

  isLoading = signal(true);
  reviews = signal<AdminReview[]>([]);
  total = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);

  deletingId = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadReviews(1);
  }

  private loadReviews(page: number) {
    this.isLoading.set(true);
    this.reviewsService.getAllForAdmin(page, this.pageSize).subscribe({
      next: (result) => {
        this.reviews.set(result.data);
        this.total.set(result.total);
        this.currentPage.set(result.page);
        this.totalPages.set(result.totalPages);
        this.isLoading.set(false);
      },
      error: () => {
        this.reviews.set([]);
        this.isLoading.set(false);
      },
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.loadReviews(page);
  }

  deleteReview(review: AdminReview) {
    const confirmed = confirm(
      `Supprimer l'avis de ${this.reviewerLabel(review)} sur "${review.product.name}" ?`,
    );
    if (!confirmed) return;

    this.deletingId.set(review.id);
    this.errorMessage.set(null);

    this.reviewsService.remove(review.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        // Recharge la page courante (ou la précédente si elle devient vide)
        const remaining = this.reviews().length - 1;
        const targetPage = remaining === 0 && this.currentPage() > 1
          ? this.currentPage() - 1
          : this.currentPage();
        this.loadReviews(targetPage);
      },
      error: (err) => {
        this.deletingId.set(null);
        this.errorMessage.set(
          err?.error?.message ?? "Impossible de supprimer cet avis.",
        );
      },
    });
  }

  reviewerLabel(review: AdminReview): string {
    const fullName = [review.user.firstName, review.user.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
    return fullName || review.user.email;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}