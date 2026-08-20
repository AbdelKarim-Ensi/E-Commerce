import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
})
export class StarRating {
  @Input() rating = 0;
  @Input() reviews?: number;
  @Input() size: 'sm' | 'md' = 'sm';

  get stars() {
    return [1, 2, 3, 4, 5].map(i => Math.min(Math.max(this.rating - (i - 1), 0), 1) * 100);
  }
}