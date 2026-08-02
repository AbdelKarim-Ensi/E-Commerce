import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css'
})
export class StarRating {
  @Input({ required: true }) rating = 0;
  @Input() reviews?: number;
  @Input() size: 'sm' | 'md' = 'sm';

  readonly stars = [1, 2, 3, 4, 5];

  get starSizeClass(): string {
    return this.size === 'sm' ? 'text-xs' : 'text-sm';
  }

  fillPercent(starIndex: number): number {
    const fill = Math.min(Math.max(this.rating - (starIndex - 1), 0), 1);
    return fill * 100;
  }

  get formattedReviews(): string {
    return this.reviews !== undefined ? this.reviews.toLocaleString() : '';
  }
}