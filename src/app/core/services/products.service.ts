import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

export interface ProductQueryParams {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/products`;

  getAll(params?: ProductQueryParams): Observable<PaginatedProducts> {
    let httpParams = new HttpParams();
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params?.search)     httpParams = httpParams.set('search', params.search);
    if (params?.page)       httpParams = httpParams.set('page', params.page);
    if (params?.limit)      httpParams = httpParams.set('limit', params.limit);

    return this.http.get<PaginatedProducts>(this.baseUrl, { params: httpParams });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getFeatured(): Observable<PaginatedProducts> {
    let httpParams = new HttpParams().set('isFeatured', 'true');
    return this.http.get<PaginatedProducts>(this.baseUrl, { params: httpParams });
  }

  create(payload: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadImage(id: string, file: File): Observable<Product> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Product>(`${this.baseUrl}/${id}/image`, formData);
  }
}