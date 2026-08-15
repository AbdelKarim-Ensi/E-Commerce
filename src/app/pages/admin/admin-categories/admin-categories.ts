import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '@services/categories.service';
import { Category } from '@models/category.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategories {
  private categoriesService = inject(CategoriesService);

  isLoading = signal(true);
  categories = signal<Category[]>([]);

  // Formulaire (mode création si editingId() === null, sinon édition)
  editingId = signal<string | null>(null);
  name = signal('');
  slug = signal('');
  emoji = signal('');
  slugManuallyEdited = signal(false);

  isSaving = signal(false);
  formError = signal<string | null>(null);

  deletingId = signal<string | null>(null);
  deleteError = signal<string | null>(null);

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.isLoading.set(true);
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error: () => {
        this.categories.set([]);
        this.isLoading.set(false);
      },
    });
  }

  get isValid(): boolean {
    return this.name().trim().length >= 2 && this.slug().trim().length >= 2;
  }

  get isEditing(): boolean {
    return this.editingId() !== null;
  }

  onNameChange(value: string) {
    this.name.set(value);
    // Auto-génère le slug tant que l'utilisateur ne l'a pas modifié à la main
    if (!this.slugManuallyEdited()) {
      this.slug.set(this.slugify(value));
    }
  }

  onSlugChange(value: string) {
    this.slug.set(value);
    this.slugManuallyEdited.set(true);
  }

  private slugify(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  startEdit(category: Category) {
    this.editingId.set(category.id);
    this.name.set(category.name);
    this.slug.set(category.slug);
    this.emoji.set(category.emoji ?? '');
    this.slugManuallyEdited.set(true);
    this.formError.set(null);
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.editingId.set(null);
    this.name.set('');
    this.slug.set('');
    this.emoji.set('');
    this.slugManuallyEdited.set(false);
    this.formError.set(null);
  }

  submit() {
    if (!this.isValid || this.isSaving()) return;

    this.isSaving.set(true);
    this.formError.set(null);

    const payload = {
      name: this.name().trim(),
      slug: this.slug().trim(),
      emoji: this.emoji().trim() || undefined,
    };

    const request = this.isEditing
      ? this.categoriesService.update(this.editingId()!, payload)
      : this.categoriesService.create(payload);

    request.subscribe({
      next: (saved) => {
        this.isSaving.set(false);
        this.categories.update((list) => {
          if (this.isEditing) {
            return list
              .map((c) => (c.id === saved.id ? saved : c))
              .sort((a, b) => a.name.localeCompare(b.name));
          }
          return [...list, saved].sort((a, b) => a.name.localeCompare(b.name));
        });
        this.resetForm();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.formError.set(
          err?.error?.message ?? "Impossible d'enregistrer cette catégorie.",
        );
      },
    });
  }

  deleteCategory(category: Category) {
    const confirmed = confirm(`Supprimer la catégorie "${category.name}" ?`);
    if (!confirmed) return;

    this.deletingId.set(category.id);
    this.deleteError.set(null);

    this.categoriesService.remove(category.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.categories.update((list) => list.filter((c) => c.id !== category.id));
        if (this.editingId() === category.id) {
          this.resetForm();
        }
      },
      error: (err) => {
        this.deletingId.set(null);
        this.deleteError.set(
          err?.error?.message ?? 'Impossible de supprimer cette catégorie.',
        );
      },
    });
  }
}