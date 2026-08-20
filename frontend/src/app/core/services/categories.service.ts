import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from '@models/category.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/categories`;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  getOne(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  // --- Admin (ADMIN uniquement côté backend) ---

  create(payload: CreateCategoryPayload): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, payload, { withCredentials: true });
  }

  update(id: string, payload: UpdateCategoryPayload): Observable<Category> {
    return this.http.patch<Category>(`${this.baseUrl}/${id}`, payload, {
      withCredentials: true,
    });
  }

  remove(id: string): Observable<Category> {
    return this.http.delete<Category>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}