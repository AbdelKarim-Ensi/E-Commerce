import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderPayload } from '@models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private url = environment.apiUrl + '/orders/';

  create(order: CreateOrderPayload): Observable<Order> {
    return this.http.post<Order>(this.url, order, { withCredentials: true });
  }

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url, { withCredentials: true });
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(this.url + id, { withCredentials: true });
  }

  updateStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(this.url + id + '/status', { status }, { withCredentials: true });
  }
}