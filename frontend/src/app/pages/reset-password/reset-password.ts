import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private token = '';
  tokenMissing = signal(false);

  password = signal('');
  confirmation = signal('');
  showPassword = signal(false);
  showConfirmation = signal(false);

  isSubmitting = signal(false);
  submitted = signal(false);
  errorMessage = signal<string | null>(null);

  redirectSeconds = signal(3);
  private redirectTimer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    const tokenParam = this.route.snapshot.queryParamMap.get('token');
    if (!tokenParam) {
      this.tokenMissing.set(true);
      return;
    }
    this.token = tokenParam;
  }

  onPasswordInput(value: string) {
    this.password.set(value);
  }

  onConfirmationInput(value: string) {
    this.confirmation.set(value);
  }

  get passwordsMismatch(): boolean {
    return this.confirmation().length > 0 && this.password() !== this.confirmation();
  }

  get isFormValid(): boolean {
    return this.password().length >= 8 && this.password() === this.confirmation();
  }

  submit(event: Event) {
    event.preventDefault();

    if (!this.isFormValid || !this.token) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.resetPassword(this.token, this.password()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitted.set(true);
        this.startRedirectCountdown();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          'Ce lien de réinitialisation est invalide ou a expiré.'
        );
      },
    });
  }

  private startRedirectCountdown() {
    this.redirectTimer = setInterval(() => {
      const next = this.redirectSeconds() - 1;
      if (next <= 0) {
        clearInterval(this.redirectTimer);
        this.router.navigate(['/login']);
        return;
      }
      this.redirectSeconds.set(next);
    }, 1000);
  }

  ngOnDestroy() {
    if (this.redirectTimer) clearInterval(this.redirectTimer);
  }
}