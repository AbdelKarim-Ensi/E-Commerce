import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewsService } from '@services/reviews.service';
import { AuthService } from '@services/auth.service';
import { Review } from '@models/review.model';
import { StarRating } from '../star-rating/star-rating';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRating],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.css',
})
export class ProductReviews implements OnInit {
  @Input({ required: true }) productId!: string;

  private reviewsService = inject(ReviewsService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  isLoading = signal(true);
  reviews = signal<Review[]>([]);
  total = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  readonly pageSize = 5;

  formRating = signal(0);
  formComment = signal('');
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);
  submitSuccess = signal(false);

  // Note survolée par la souris (0 = pas de survol en cours)
  hoveredRating = signal(0);

  ngOnInit() {
    this.loadReviews(1);
  }

  private loadReviews(page: number) {
    this.isLoading.set(true);
    this.reviewsService.getByProduct(this.productId, page, this.pageSize).subscribe({
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

  setFormRating(value: number) {
    this.formRating.set(value);
  }

  onStarHover(value: number) {
    this.hoveredRating.set(value);
  }

  onStarLeave() {
    this.hoveredRating.set(0);
  }

  /**
   * Valeur à utiliser pour l'affichage visuel de l'étoile (remplie ou non) :
   * priorité au survol en cours, sinon la note déjà sélectionnée.
   */
  displayRating(): number {
    return this.hoveredRating() || this.formRating();
  }

  submitReview() {
    if (this.formRating() < 1 || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.submitError.set(null);
    this.submitSuccess.set(false);

    const comment = this.formComment().trim() || undefined;

    this.reviewsService.create(this.productId, this.formRating(), comment).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        this.formRating.set(0);
        this.formComment.set('');
        this.loadReviews(1);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.submitError.set(
          err?.error?.message ?? "Impossible d'envoyer votre avis.",
        );
      },
    });
  }

  reviewerLabel(review: Review): string {
    const fullName = [review.user.firstName, review.user.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
    return fullName || 'Client TechGear';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}