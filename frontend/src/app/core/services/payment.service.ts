import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { API_BASE_URL } from '../api-base-url.token';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private url = inject(API_BASE_URL) + '/payments/';

  constructor(private http: HttpClient) {}

  createIntent(orderId: string) {
    return this.http.post(this.url + 'create-intent', { orderId });
  }
}