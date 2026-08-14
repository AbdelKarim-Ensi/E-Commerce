import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, User as UserIcon, Package, MapPin, Shield } from 'lucide-angular';
import { AuthService } from '@services/auth.service';
import { UsersService } from '@services/users.service';
import { OrdersService } from '@services/orders.service';
import { User } from '@models/user.model';
import { Order } from '@models/order.model';

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type NavKey = 'profil' | 'commandes' | 'adresses' | 'securite';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private ordersService = inject(OrdersService);
  private router = inject(Router);

  protected readonly isLoggedIn = this.authService.isLoggedIn;

  protected activeSection = signal<NavKey>('profil');
  protected loading = signal(true);
  protected saving = signal(false);
  protected saved = signal(false);
  protected error = signal<string | null>(null);

  protected user = signal<User | null>(null);
  protected form: ProfileForm = { firstName: '', lastName: '', email: '', phone: '', address: '' };
  private originalForm: ProfileForm = { ...this.form };

  // Commandes
  protected orders = signal<Order[]>([]);
  protected ordersLoading = signal(false);
  protected ordersError = signal<string | null>(null);
  protected ordersLoaded = false; // évite de recharger à chaque clic sur l'onglet

  // Sécurité
  protected passwordForm: PasswordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  protected passwordSaving = signal(false);
  protected passwordSaved = signal(false);
  protected passwordError = signal<string | null>(null);

  protected navigation: { key: NavKey; label: string; icon: any }[] = [
    { key: 'profil', label: 'Profil', icon: UserIcon },
    { key: 'commandes', label: 'Commandes', icon: Package },
    { key: 'adresses', label: 'Adresses', icon: MapPin },
    { key: 'securite', label: 'Sécurité', icon: Shield },
  ];

  get initials(): string {
    const f = this.form.firstName?.[0] ?? '';
    const l = this.form.lastName?.[0] ?? '';
    return (f + l).toUpperCase() || '?';
  }

  ngOnInit() {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.usersService.getMe().subscribe({
      next: (u) => {
        this.user.set(u);
        this.form = {
          firstName: u.firstName ?? '',
          lastName: u.lastName ?? '',
          email: u.email ?? '',
          phone: u.phone ?? '',
          address: u.address ?? '',
        };
        this.originalForm = { ...this.form };
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger votre profil.');
        this.loading.set(false);
      },
    });
  }

  setSection(key: NavKey) {
    this.activeSection.set(key);
    if (key === 'commandes' && !this.ordersLoaded) {
      this.loadOrders();
    }
  }

 private loadOrders() {
  this.ordersLoading.set(true);
  this.ordersError.set(null);
  this.ordersService.getAll().subscribe({
    next: (result) => {
      this.orders.set(result.data);
      this.ordersLoaded = true;
      this.ordersLoading.set(false);
    },
    error: () => {
      this.ordersError.set('Impossible de charger vos commandes.');
      this.ordersLoading.set(false);
    },
  });
}

  protected statusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      PAID: 'Payée',
      SHIPPED: 'Expédiée',
      DELIVERED: 'Livrée',
      CANCELLED: 'Annulée',
    };
    return labels[status] ?? status;
  }

  protected statusColor(status: string): string {
    const colors: Record<string, string> = {
      PENDING: 'bg-amber-50 text-amber-600',
      PAID: 'bg-blue-50 text-blue-600',
      SHIPPED: 'bg-purple-50 text-purple-600',
      DELIVERED: 'bg-green-50 text-green-600',
      CANCELLED: 'bg-red-50 text-red-600',
    };
    return colors[status] ?? 'bg-gray-50 text-gray-600';
  }

  protected itemsCount(order: Order): number {
    return order.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  saveProfile() {
    this.saving.set(true);
    this.error.set(null);
    this.usersService.updateMe(this.form).subscribe({
      next: (u) => {
        this.user.set(u);
        this.originalForm = { ...this.form };
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
      },
      error: () => {
        this.saving.set(false);
        this.error.set("La mise à jour a échoué. Réessayez.");
      },
    });
  }

  cancelChanges() {
    this.form = { ...this.originalForm };
    this.saved.set(false);
    this.error.set(null);
  }

  changePassword() {
    this.passwordError.set(null);

    if (this.passwordForm.newPassword.length < 8) {
      this.passwordError.set('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordError.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.passwordSaving.set(true);
    this.usersService.changePassword({
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword,
    }).subscribe({
      next: () => {
        this.passwordSaving.set(false);
        this.passwordSaved.set(true);
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
        setTimeout(() => this.passwordSaved.set(false), 3000);
      },
      error: (err) => {
        this.passwordSaving.set(false);
        if (err.status === 400) {
          this.passwordError.set('Mot de passe actuel incorrect.');
        } else {
          this.passwordError.set('Une erreur est survenue. Réessayez.');
        }
      },
    });
  }

  protected logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/']),
    });
  }
}