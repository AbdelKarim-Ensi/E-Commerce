import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderPayload, PaginatedOrders } from '@models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private url = environment.apiUrl + '/orders/';

  create(order: CreateOrderPayload): Observable<Order> {
    return this.http.post<Order>(this.url, order, { withCredentials: true });
  }

  getAll(page = 1, limit = 20): Observable<PaginatedOrders> {
    return this.http.get<PaginatedOrders>(this.url, {
      withCredentials: true,
      params: { page: page.toString(), limit: limit.toString() },
    });
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(this.url + id, { withCredentials: true });
  }

  updateStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(this.url + id + '/status', { status }, { withCredentials: true });
  }

  refund(id: string): Observable<Order> {
    return this.http.post<Order>(this.url + id + '/refund', {}, { withCredentials: true });
  }
}