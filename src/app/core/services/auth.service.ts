import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, tap, throwError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private url = environment.apiUrl + '/auth/';
  isLoggedIn = signal(false);
  sessionChecked = signal(false);

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

  checkSession() {
    return this.refresh().pipe(
      catchError(() => of(null)),
      tap(() => this.sessionChecked.set(true))
    );
  }
}