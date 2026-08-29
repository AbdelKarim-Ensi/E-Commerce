import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from '@models/category.model';
import { API_BASE_URL } from '../api-base-url.token';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private http = inject(HttpClient);
  private baseUrl = `${inject(API_BASE_URL)}/categories`;

  private categories$: Observable<Category[]> | null = null;

 
  getCategories(): Observable<Category[]> {
    if (!this.categories$) {
      this.categories$ = this.http.get<Category[]>(this.baseUrl).pipe(
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.categories$;
  }

  getOne(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  
  create(payload: CreateCategoryPayload): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, payload, { withCredentials: true }).pipe(
      
    );
  }

  update(id: string, payload: UpdateCategoryPayload): Observable<Category> {
    return this.http.patch<Category>(`${this.baseUrl}/${id}`, payload, {
      withCredentials: true,
    });
  }

  remove(id: string): Observable<Category> {
    return this.http.delete<Category>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  
  invalidateCache(): void {
    this.categories$ = null;
  }
}