import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '@services/users.service';
import { AuthService } from '@services/auth.service';
import { User, Role } from '@models/user.model';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers {
  private usersService = inject(UsersService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  isLoading = signal(true);
  users = signal<User[]>([]);

  currentPage = signal(1);
  totalPages = signal(1);
  totalUsers = signal(0);
  readonly pageSize = PAGE_SIZE;

  // Suivi par utilisateur : quel select est en cours de sauvegarde,
  // et l'éventuelle erreur associée à CET utilisateur.
  updatingUserId = signal<string | null>(null);
  errorUserId = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  readonly roles: { value: Role; label: string }[] = [
    { value: 'CLIENT', label: 'Client' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'STOCK_MANAGER', label: 'Gestionnaire de stock' },
  ];

  ngOnInit() {
    this.loadUsers(1);
  }

  private loadUsers(page: number) {
    this.isLoading.set(true);
    this.usersService.getAll(page, this.pageSize).subscribe({
      next: (result) => {
        this.users.set(result.data);
        this.currentPage.set(result.page);
        this.totalPages.set(result.totalPages);
        this.totalUsers.set(result.total);
        this.isLoading.set(false);
      },
      error: () => {
        this.users.set([]);
        this.isLoading.set(false);
      },
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.loadUsers(page);
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage() - 1);
  }

  isSelf(user: User): boolean {
    return user.id === this.currentUser()?.id;
  }

  onRoleChange(user: User, newRole: Role) {
    if (newRole === user.role) return;

    this.updatingUserId.set(user.id);
    this.errorUserId.set(null);

    this.usersService.updateRole(user.id, newRole).subscribe({
      next: (updated) => {
        this.users.update((list) =>
          list.map((u) => (u.id === updated.id ? updated : u)),
        );
        this.updatingUserId.set(null);
      },
      error: (err) => {
        this.updatingUserId.set(null);
        this.errorUserId.set(user.id);
        this.errorMessage.set(
          err?.error?.message ?? 'Impossible de changer le rôle de cet utilisateur.',
        );
      },
    });
  }

  roleBadgeClasses(role: Role): string {
    switch (role) {
      case 'ADMIN':
        return 'bg-orange-50 text-orange-700 ring-orange-600/20';
      case 'STOCK_MANAGER':
        return 'bg-indigo-50 text-indigo-700 ring-indigo-600/20';
      case 'CLIENT':
      default:
        return 'bg-slate-50 text-slate-700 ring-slate-600/20';
    }
  }

  customerLabel(user: User): string {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return fullName || user.email;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}