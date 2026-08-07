import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);
  private routerSub?: Subscription;

  /** Contrôle l'affichage du panneau : false = Sign in (/login), true = Sign up (/register). */
  isSignUp = false;

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  signInForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  signUpForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    // Si déjà connecté, /login et /register n'ont rien à faire ici.
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
      return;
    }

    this.syncModeFromUrl(this.router.url);

    // Garde la synchronisation si l'utilisateur navigue directement via l'URL
    // (barre d'adresse, lien externe, bouton retour du navigateur).
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.syncModeFromUrl(event.urlAfterRedirects));
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  private syncModeFromUrl(url: string) {
    this.isSignUp = url.startsWith('/register');
  }

  /**
   * Bascule visuelle vers le mode Sign up, déclenchée par les boutons du panneau.
   * Met à jour la barre d'URL SANS déclencher de navigation Angular Router complète :
   * les routes /login et /register pointent vers ce même composant, et une navigation
   * "classique" détruirait puis recréerait l'instance (comportement par défaut du
   * Router), ce qui casserait l'animation de transition entre les deux panneaux.
   * Location.go() met à jour l'URL affichée tout en conservant l'instance du composant.
   */
  showSignUp() {
    if (this.isSignUp) return;
    this.isSignUp = true;
    this.errorMessage.set(null);
    this.location.go('/register');
  }

  showSignIn() {
    if (!this.isSignUp) return;
    this.isSignUp = false;
    this.errorMessage.set(null);
    this.location.go('/login');
  }

  submitSignIn() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.signInForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'Invalid email or password. Please try again.'
        );
      },
    });
  }

  submitSignUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password, username } = this.signUpForm.getRawValue();

    this.authService.register({ email, password, username }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Account created! Please sign in.');
        this.signInForm.patchValue({ email });
        this.showSignIn();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'Could not create your account. Please try again.'
        );
      },
    });
  }

  get siEmail() { return this.signInForm.controls.email; }
  get siPassword() { return this.signInForm.controls.password; }
  get suUsername() { return this.signUpForm.controls.username; }
  get suEmail() { return this.signUpForm.controls.email; }
  get suPassword() { return this.signUpForm.controls.password; }
}