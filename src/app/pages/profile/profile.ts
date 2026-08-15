import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, User as UserIcon, Package, MapPin, Shield } from 'lucide-angular';
import { AuthService } from '@services/auth.service';
import { UsersService } from '@services/users.service';
import { OrdersService } from '@services/orders.service';
import { AddressesService } from '@services/address.service';
import { User } from '@models/user.model';
import { Order } from '@models/order.model';
import { Address, CreateAddressPayload } from '@models/address.model';

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

interface AddressForm {
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  country: string;
}

const EMPTY_ADDRESS_FORM: AddressForm = {
  label: '',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  postalCode: '',
  country: 'Tunisie',
};

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
  private addressesService = inject(AddressesService);
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

  // Adresses
  protected addresses = signal<Address[]>([]);
  protected addressesLoading = signal(false);
  protected addressesError = signal<string | null>(null);
  protected addressesLoaded = false;

  protected addressFormOpen = signal(false);
  protected editingAddressId = signal<string | null>(null);
  protected addressForm: AddressForm = { ...EMPTY_ADDRESS_FORM };
  protected addressSaving = signal(false);
  protected addressFormError = signal<string | null>(null);
  protected deletingAddressId = signal<string | null>(null);
  protected settingDefaultId = signal<string | null>(null);

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

  get isEditingAddress(): boolean {
    return this.editingAddressId() !== null;
  }

  get isAddressFormValid(): boolean {
    return (
      this.addressForm.fullName.trim().length >= 2 &&
      this.addressForm.line1.trim().length >= 3 &&
      this.addressForm.city.trim().length >= 2
    );
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
    if (key === 'adresses' && !this.addressesLoaded) {
      this.loadAddresses();
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

  // --- Adresses ---

  private loadAddresses() {
    this.addressesLoading.set(true);
    this.addressesError.set(null);
    this.addressesService.getAll().subscribe({
      next: (addresses) => {
        this.addresses.set(addresses);
        this.addressesLoaded = true;
        this.addressesLoading.set(false);
      },
      error: () => {
        this.addressesError.set('Impossible de charger vos adresses.');
        this.addressesLoading.set(false);
      },
    });
  }

  startAddAddress() {
    this.editingAddressId.set(null);
    this.addressForm = { ...EMPTY_ADDRESS_FORM };
    this.addressFormError.set(null);
    this.addressFormOpen.set(true);
  }

  startEditAddress(address: Address) {
    this.editingAddressId.set(address.id);
    this.addressForm = {
      label: address.label ?? '',
      fullName: address.fullName,
      phone: address.phone ?? '',
      line1: address.line1,
      line2: address.line2 ?? '',
      city: address.city,
      postalCode: address.postalCode ?? '',
      country: address.country,
    };
    this.addressFormError.set(null);
    this.addressFormOpen.set(true);
  }

  cancelAddressForm() {
    this.addressFormOpen.set(false);
    this.editingAddressId.set(null);
    this.addressForm = { ...EMPTY_ADDRESS_FORM };
    this.addressFormError.set(null);
  }

  submitAddressForm() {
    if (!this.isAddressFormValid || this.addressSaving()) return;

    this.addressSaving.set(true);
    this.addressFormError.set(null);

    const payload: CreateAddressPayload = {
      label: this.addressForm.label.trim() || undefined,
      fullName: this.addressForm.fullName.trim(),
      phone: this.addressForm.phone.trim() || undefined,
      line1: this.addressForm.line1.trim(),
      line2: this.addressForm.line2.trim() || undefined,
      city: this.addressForm.city.trim(),
      postalCode: this.addressForm.postalCode.trim() || undefined,
      country: this.addressForm.country.trim() || undefined,
    };

    const editingId = this.editingAddressId();
    const request = editingId
      ? this.addressesService.update(editingId, payload)
      : this.addressesService.create(payload);

    request.subscribe({
      next: (saved) => {
        this.addressSaving.set(false);
        this.addresses.update((list) => {
          const updatedList = editingId
            ? list.map((a) => (a.id === saved.id ? saved : a))
            : [...list, saved];
          // Si l'adresse enregistrée est désormais par défaut (première
          // adresse ou changement explicite), on désactive ce flag sur
          // les autres côté affichage local, en cohérence avec le backend.
          return saved.isDefault
            ? updatedList.map((a) => (a.id === saved.id ? a : { ...a, isDefault: false }))
            : updatedList;
        });
        this.cancelAddressForm();
      },
      error: (err) => {
        this.addressSaving.set(false);
        this.addressFormError.set(
          err?.error?.message ?? "Impossible d'enregistrer cette adresse.",
        );
      },
    });
  }

  setDefaultAddress(address: Address) {
    if (address.isDefault || this.settingDefaultId()) return;

    this.settingDefaultId.set(address.id);
    this.addressesService.setDefault(address.id).subscribe({
      next: (updated) => {
        this.settingDefaultId.set(null);
        this.addresses.update((list) =>
          list.map((a) => ({ ...a, isDefault: a.id === updated.id })),
        );
      },
      error: () => {
        this.settingDefaultId.set(null);
        this.addressesError.set('Impossible de définir cette adresse par défaut.');
      },
    });
  }

  deleteAddress(address: Address) {
    const confirmed = confirm(`Supprimer l'adresse "${address.label || address.fullName}" ?`);
    if (!confirmed) return;

    this.deletingAddressId.set(address.id);
    this.addressesService.remove(address.id).subscribe({
      next: () => {
        this.deletingAddressId.set(null);
        // Recharge pour refléter la promotion éventuelle d'une nouvelle
        // adresse par défaut, gérée côté backend.
        this.addressesLoaded = false;
        this.loadAddresses();
      },
      error: () => {
        this.deletingAddressId.set(null);
        this.addressesError.set('Impossible de supprimer cette adresse.');
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