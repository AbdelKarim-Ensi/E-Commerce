import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Role, PaginatedUsers } from '@models/user.model';
import { environment } from '../../../environments/environment';
import { API_BASE_URL } from '../api-base-url.token';

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private baseUrl = `${inject(API_BASE_URL)}/users`;

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  updateMe(payload: UpdateUserPayload): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/me`, payload);
  }

  changePassword(payload: ChangePasswordPayload): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(`${this.baseUrl}/me/password`, payload);
  }

  getAll(page = 1, limit = 20): Observable<PaginatedUsers> {
    return this.http.get<PaginatedUsers>(this.baseUrl, {
      params: { page: page.toString(), limit: limit.toString() },
    });
  }

  updateRole(userId: string, role: Role): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${userId}/role`, { role });
  }
}