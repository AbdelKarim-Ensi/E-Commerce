import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected readonly isLoggedIn = this.authService.isLoggedIn;

  ngOnInit() {
    // Sécurité supplémentaire : si jamais la page est atteinte sans session valide
    // (ex: authGuard contourné), on redirige vers /login.
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  protected logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/']),
    });
  }
}