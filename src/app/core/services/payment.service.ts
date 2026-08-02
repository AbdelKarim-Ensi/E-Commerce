import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private url = environment.apiUrl + '/payment/';

  constructor(private http: HttpClient) {}

  createIntent(orderId: string) {
    return this.http.post(this.url + 'create-intent', { orderId });
  }
}