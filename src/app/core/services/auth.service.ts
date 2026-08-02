import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated() {
      throw new Error('Method not implemented.');
  }
  private url = environment.apiUrl + '/auth/';
  isLoggedIn = signal(false);

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(this.url + 'register', data);
  }

  login(data: any) {
    return this.http.post(this.url + 'login', data).pipe(
      tap(() => this.isLoggedIn.set(true))
    );
  }

  logout() {
    return this.http.post(this.url + 'logout', {}).pipe(
      tap(() => this.isLoggedIn.set(false))
    );
  }

  refresh() {
    return this.http.post(this.url + 'refresh', {}).pipe(
      tap(() => this.isLoggedIn.set(true)),
      catchError((err) => {
        this.isLoggedIn.set(false);
        return throwError(() => err);
      })
    );
  }
}