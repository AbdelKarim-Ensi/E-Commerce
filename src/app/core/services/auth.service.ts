import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { environment } from '../../../environments/environment';
import { catchError, tap, throwError, of, switchMap } from 'rxjs';
import { UsersService } from './users.service';
import { User } from '@models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private usersService = inject(UsersService);
  private platformId = inject(PLATFORM_ID);

  private url = environment.apiUrl + '/auth/';
  isLoggedIn = signal(false);
  sessionChecked = signal(false);
  currentUser = signal<User | null>(null);

  register(data: any) {
    return this.http.post(this.url + 'register', data);
  }

  login(data: any) {
    return this.http.post(this.url + 'login', data).pipe(
      tap(() => this.isLoggedIn.set(true)),
      switchMap(() => this.loadCurrentUser())
    );
  }

  logout() {
    return this.http.post(this.url + 'logout', {}).pipe(
      tap(() => {
        this.isLoggedIn.set(false);
        this.currentUser.set(null);
      })
    );
  }

  /**
   * Fait tourner le refresh token (le backend invalide l'ancien et en émet un
   * nouveau via Set-Cookie). SÛR uniquement côté navigateur, où le vrai cookie
   * jar reçoit le nouveau cookie. Ne JAMAIS appeler depuis le SSR : le serveur
   * Node ne peut pas relayer le Set-Cookie du backend vers le navigateur, donc
   * le navigateur retenterait l'ancien token déjà invalidé au prochain appel,
   * ce qui déclenche la détection de réutilisation du backend et révoque
   * TOUTES les sessions de l'utilisateur.
   */
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

  /**
   * Vérification "légère" et non-mutante de la session : lit uniquement
   * GET /users/me avec le cookie access_token existant. N'échoue jamais
   * bruyamment (access_token expire vite, ~15min) et ne touche jamais au
   * refresh_token. Utilisée exclusivement côté SSR.
   */
  private verifySessionReadOnly() {
    return this.loadCurrentUser().pipe(
      tap(() => this.isLoggedIn.set(true)),
      catchError(() => {
        // access_token probablement expiré ou absent : on ne sait pas encore
        // si l'utilisateur est connecté. Le client corrigera après hydratation.
        this.isLoggedIn.set(false);
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
      tap((user) => this.currentUser.set(user)),
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
}