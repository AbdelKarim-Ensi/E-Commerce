import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_BASE_URL } from '../api-base-url.token';
import { PaginatedReviews, PaginatedAdminReviews, Review } from '@models/review.model';
import { Product } from '@models/product.model';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);

  getByProduct(productId: string, page = 1, limit = 10): Observable<PaginatedReviews> {
    return this.http.get<PaginatedReviews>(
      `${this.baseUrl}/products/${productId}/reviews`,
      { params: { page, limit } },
    );
  }

  create(productId: string, rating: number, comment?: string): Observable<Review> {
    return this.http.post<Review>(
      `${this.baseUrl}/products/${productId}/reviews`,
      { rating, comment },
      { withCredentials: true },
    );
  }

  remove(reviewId: string): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(
      `${this.baseUrl}/reviews/${reviewId}`,
      { withCredentials: true },
    );
  }

  // --- Admin ---

  getAllForAdmin(page = 1, limit = 10): Observable<PaginatedAdminReviews> {
    return this.http.get<PaginatedAdminReviews>(`${this.baseUrl}/admin/reviews`, {
      params: { page, limit },
      withCredentials: true,
    });
  }

  getTopRatedProducts(limit = 5): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/admin/products/top-rated`, {
      params: { limit },
      withCredentials: true,
    });
  }

  getLowRatedProducts(limit = 5): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/admin/products/low-rated`, {
      params: { limit },
      withCredentials: true,
    });
  }
}