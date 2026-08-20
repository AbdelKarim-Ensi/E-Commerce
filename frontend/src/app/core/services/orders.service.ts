import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_BASE_URL } from '../api-base-url.token';
import { Order, CreateOrderPayload, PaginatedOrders, OrderStatus } from '@models/order.model';

export type OrderStatusCounts = Record<'ALL' | OrderStatus, number>;

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private url = inject(API_BASE_URL) + '/orders/';

  create(order: CreateOrderPayload): Observable<Order> {
    return this.http.post<Order>(this.url, order, { withCredentials: true });
  }

  getAll(
    page = 1,
    limit = 20,
    status?: OrderStatus,
    search?: string,
  ): Observable<PaginatedOrders> {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    if (status) params['status'] = status;
    if (search && search.trim()) params['search'] = search.trim();

    return this.http.get<PaginatedOrders>(this.url, {
      withCredentials: true,
      params,
    });
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(this.url + id, { withCredentials: true });
  }

  // Comptage par statut sur l'INTÉGRALITÉ de la table (pas seulement la
  // page/recherche/filtre actifs côté UI). Utilisé pour les badges des
  // onglets dans AdminOrders — ils doivent rester exacts indépendamment
  // du filtre sélectionné.
  getStatusCounts(): Observable<OrderStatusCounts> {
    return this.http.get<OrderStatusCounts>(this.url + 'status-counts', {
      withCredentials: true,
    });
  }

  updateStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(this.url + id + '/status', { status }, { withCredentials: true });
  }

  refund(id: string): Observable<Order> {
    return this.http.post<Order>(this.url + id + '/refund', {}, { withCredentials: true });
  }
}