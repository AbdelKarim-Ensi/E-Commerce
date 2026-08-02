import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private url = environment.apiUrl + '/orders/';

  constructor(private http: HttpClient) {}

  create(order: any) {
    return this.http.post(this.url, order, { withCredentials: true });
  }

  getAll() {
    return this.http.get(this.url, { withCredentials: true });
  }

  updateStatus(id: string, status: string) {
    return this.http.patch(this.url + id + '/status', { status }, { withCredentials: true });
  }
}