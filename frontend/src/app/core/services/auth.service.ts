import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { environment } from '../../../environments/environment';
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

  private url = environment.apiUrl + '/auth/';
  isLoggedIn = signal(false);
  sessionChecked = signal(false);
  currentUser = signal<User | null>(null);

  // Initialisé paresseusement, uniquement côté navigateur — le SDK Firebase
  // client (popup, window, etc.) n'a aucun sens en SSR et planterait sur le
  // serveur Node si on essayait de l'instancier au chargement du module.
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

  /**
   * Ouvre la popup Google (SDK Firebase client), récupère l'idToken du
   * compte Google choisi, puis le transmet à notre backend qui le vérifie
   * via Firebase Admin et émet nos propres cookies de session — exactement
   * le même flux que login(), juste une source d'authentification différente.
   * Navigateur uniquement : signInWithPopup n'existe pas côté SSR.
   */
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