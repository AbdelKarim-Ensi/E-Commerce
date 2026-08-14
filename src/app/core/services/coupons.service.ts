import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CouponValidationResult {
  couponId: string;
  code: string;
  discountAmount: number;
  newTotal: number;
}

@Injectable({ providedIn: 'root' })
export class CouponsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/coupons`;

  validate(code: string, cartTotal: number): Observable<CouponValidationResult> {
    return this.http.post<CouponValidationResult>(
      `${this.baseUrl}/validate`,
      { code, cartTotal },
      { withCredentials: true }
    );
  }
}