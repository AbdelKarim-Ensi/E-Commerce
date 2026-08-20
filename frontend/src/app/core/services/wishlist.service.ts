import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '@models/product.model';
import { environment } from '../../../environments/environment';
import { API_BASE_URL } from '../api-base-url.token';

@Injectable({ providedIn: 'root' })
export class WishlistApiService {
  private http = inject(HttpClient);
  private baseUrl = `${inject(API_BASE_URL)}/wishlist`;

  getWishlist(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl, { withCredentials: true });
  }

  toggle(productId: string): Observable<{ inWishlist: boolean }> {
    return this.http.post<{ inWishlist: boolean }>(
      `${this.baseUrl}/${productId}/toggle`,
      {},
      { withCredentials: true }
    );
  }
}