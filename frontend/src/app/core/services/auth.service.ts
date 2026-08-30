import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { environment } from '../../../environments/environment';
import { API_BASE_URL } from '../api-base-url.token';
import { catchError, tap, throwError, of, switchMap, from } from 'rxjs';
import { UsersService } from './users.service';
import { CartService } from './cart.service';
import { User } from '@models/user.model';
import {
  initializeApp,
  FirebaseApp,
} from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private usersService = inject(UsersService);
  private cartService = inject(CartService);
  private platformId = inject(PLATFORM_ID);

  private url = inject(API_BASE_URL) + '/auth/';
  isLoggedIn = signal(false);
  sessionChecked = signal(false);
  currentUser = signal<User | null>(null);

  
  private firebaseApp: FirebaseApp | null = null;

  private getFirebaseApp(): FirebaseApp {
    if (!this.firebaseApp) {
      this.firebaseApp = initializeApp(environment.firebase);
    }
    return this.firebaseApp;
  }

  register(data: any) {
    return this.http.post(this.url + 'register', data);
  }

  login(data: any) {
    return this.http.post(this.url + 'login', data).pipe(
      tap(() => this.isLoggedIn.set(true)),
      switchMap(() => this.loadCurrentUser())
    );
  }

  loginWithGoogle() {
    if (isPlatformServer(this.platformId)) {
      return throwError(() => new Error('Google sign-in is only available in the browser'));
    }

    const auth = getAuth(this.getFirebaseApp());
    const provider = new GoogleAuthProvider();

    return from(signInWithPopup(auth, provider)).pipe(
      switchMap((result) => from(result.user.getIdToken())),
      switchMap((idToken) => this.http.post(this.url + 'google', { idToken })),
      tap(() => this.isLoggedIn.set(true)),
      switchMap(() => this.loadCurrentUser())
    );
  }

  logout() {
    return this.http.post(this.url + 'logout', {}).pipe(
      tap(() => {
        this.isLoggedIn.set(false);
        this.currentUser.set(null);
        this.cartService.clearWishlist();
      })
    );
  }

  refresh() {
    return this.http.post(this.url + 'refresh', {}).pipe(
      tap(() => this.isLoggedIn.set(true)),
      switchMap(() =>
        this.loadCurrentUser().pipe(
          catchError(() => {
            this.currentUser.set(null);
            return of(null);
          })
        )
      ),
      catchError((err) => {
        this.isLoggedIn.set(false);
        this.currentUser.set(null);
        return throwError(() => err);
      })
    );
  }

  
  private verifySessionReadOnly() {
    return this.loadCurrentUser().pipe(
      tap(() => this.isLoggedIn.set(true)),
      catchError(() => {
        
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  checkSession() {
    if (isPlatformServer(this.platformId)) {
      return this.verifySessionReadOnly().pipe(
        tap(() => this.sessionChecked.set(true))
      );
    }

    return this.refresh().pipe(
      catchError(() => of(null)),
      tap(() => this.sessionChecked.set(true))
    );
  }

  private loadCurrentUser() {
    return this.usersService.getMe().pipe(
      tap((user) => {
        this.currentUser.set(user);
        this.cartService.loadWishlist();
      }),
      catchError((err) => {
        this.currentUser.set(null);
        return throwError(() => err);
      })
    );
  }

  isAdmin(): boolean {
    const role = this.currentUser()?.role;
    return role === 'ADMIN' || role === 'STOCK_MANAGER';
  }

  forgotPassword(email: string) {
    return this.http.post<{ success: boolean; message: string }>(this.url + 'forgot-password', {
      email,
    });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post<{ success: boolean }>(this.url + 'reset-password', {
      token,
      newPassword,
    });
  }

  verifyEmail(token: string) {
    return this.http.post<{ success: boolean }>(this.url + 'verify-email', {
      token,
    });
  }

  resendVerification(email: string) {
    return this.http.post<{ success: boolean; message: string }>(
      this.url + 'resend-verification',
      { email },
    );
  }
}