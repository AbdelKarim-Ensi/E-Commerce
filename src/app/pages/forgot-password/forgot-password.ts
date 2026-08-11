import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private authService = inject(AuthService);

  email = signal('');
  isSubmitting = signal(false);
  submitted = signal(false);
  errorMessage = signal<string | null>(null);

  onEmailInput(value: string) {
    this.email.set(value);
  }

  submit() {
    if (!this.email().trim()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.forgotPassword(this.email().trim()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitted.set(true);
      },
      error: () => {
        this.isSubmitting.set(false);
        // Message générique : ne jamais révéler si l'email existe ou non,
        // et ne pas bloquer l'utilisateur sur une erreur réseau ponctuelle.
        this.submitted.set(true);
      },
    });
  }
}