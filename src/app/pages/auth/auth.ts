import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { AlertService } from '@services/alert.service';

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
  private alertService = inject(AlertService);
  private router = inject(Router);
  private location = inject(Location);
  private routerSub?: Subscription;

  /** Contrôle l'affichage du panneau : false = Sign in (/login), true = Sign up (/register). */
  isSignUp = false;

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

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
    
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    this.syncModeFromUrl(this.router.url);

 
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
        const message = err?.error?.message ?? 'Invalid email or password. Please try again.';

        // Cas particulier : compte pas encore vérifié — propose de renvoyer
        // l'email plutôt qu'une simple bannière/popup passive, puisque
        // c'est le blocage exact qui empêche l'utilisateur d'avancer.
        if (typeof message === 'string' && message.toLowerCase().includes('verify your email')) {
          this.offerResendVerification(this.signInForm.getRawValue().email);
          return;
        }

        this.errorMessage.set(message);
      },
    });
  }

  private offerResendVerification(email: string) {
    this.alertService
      .confirm({
        title: 'Oups !',
        text: "Votre email n'est pas encore vérifié. Voulez-vous qu'on vous renvoie le lien de vérification ?",
        confirmButtonText: "Renvoyer l'email",
        cancelButtonText: 'Fermer',
      })
      .then((shouldResend) => {
        if (!shouldResend) return;

        this.authService.resendVerification(email).subscribe({
          next: () => {
            this.alertService.success(
              'Si ce compte existe et est encore non vérifié, un nouvel email vient de partir.',
              'Email envoyé !',
            );
          },
          error: () => {
            this.alertService.error(
              "Impossible d'envoyer l'email pour le moment. Réessayez plus tard.",
              'Oups !',
            );
          },
        });
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

    // Le backend (RegisterDto) n'a pas de champ `username` — il attend
    // `firstName`/`lastName`. On mappe la saisie du champ "username" sur
    // `firstName` pour rester compatible avec le DTO whitelisté côté Nest,
    // sans changer le formulaire ni le template.
    this.authService.register({ email, password, firstName: username }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.alertService.success(
          'Un email de vérification vient de vous être envoyé. Vérifiez votre boîte de réception avant de vous connecter.',
          'Compte créé !',
        );
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

  /**
   * Utilisée par les deux formulaires (Sign in / Sign up) — Google renvoie
   * toujours le même flux de compte, il n'y a pas de distinction "créer"
   * vs "se connecter" côté Firebase, donc un seul handler suffit.
   */
  loginWithGoogle() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.loginWithGoogle().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        // L'utilisateur ferme souvent la popup lui-même (auth/popup-closed-by-user) :
        // ce n'est pas une vraie erreur, pas besoin d'afficher de message dans ce cas.
        if (err?.code === 'auth/popup-closed-by-user') {
          return;
        }
        this.errorMessage.set(
          err?.error?.message ?? 'Could not sign in with Google. Please try again.'
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