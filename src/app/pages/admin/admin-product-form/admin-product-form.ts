import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '@services/products.service';
import { CategoriesService } from '@services/categories.service';
import { AlertService } from '@services/alert.service';
import { Category } from '@models/category.model';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-product-form.html',
  styleUrl: './admin-product-form.css',
})
export class AdminProductForm {
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private alertService = inject(AlertService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  productId = signal<string | null>(null);
  productName = signal<string>('');

  categories = signal<Category[]>([]);
  isSaving = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  imagePreview = signal<string | null>(null);
  private selectedImageFile: File | null = null;

  private slugManuallyEdited = false;

  form: FormGroup = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    description: [''],
    brand: [''],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    originalPrice: [null as number | null],
    stock: [0, [Validators.required, Validators.min(0)]],
    isActive: [true],
    isFeatured: [false],
    categoryId: ['', [Validators.required]],
    specs: this.fb.array([]),
    colors: this.fb.array([]),
  });

  discountPercent = computed(() => {
    const price = this.form.get('price')?.value;
    const originalPrice = this.form.get('originalPrice')?.value;
    if (!price || !originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  });

  get specsArray(): FormArray {
    return this.form.get('specs') as FormArray;
  }

  get colorsArray(): FormArray {
    return this.form.get('colors') as FormArray;
  }

  ngOnInit() {
    this.loadCategories();

    this.form.get('name')?.valueChanges.subscribe((name: string) => {
      if (!this.slugManuallyEdited) {
        this.form.get('slug')?.setValue(this.slugify(name), { emitEvent: false });
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(id);
      this.loadProduct(id);
    }
  }

  onSlugInput() {
    this.slugManuallyEdited = true;
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.categories.set([]),
    });
  }

  private loadProduct(id: string) {
    this.isLoading.set(true);
    this.productsService.getById(id).subscribe({
      next: (product) => {
        this.productName.set(product.name);
        this.slugManuallyEdited = true;

        this.form.patchValue({
          name: product.name,
          slug: product.slug,
          description: product.description ?? '',
          brand: product.brand ?? '',
          price: parseFloat(product.price),
          originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
          stock: product.stock,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          categoryId: product.categoryId,
        });

        this.specsArray.clear();
        if (product.specDetails) {
          for (const [key, value] of Object.entries(product.specDetails)) {
            this.specsArray.push(this.buildSpecGroup(key, value));
          }
        }

        this.colorsArray.clear();
        if (product.colors) {
          for (const color of product.colors) {
            this.colorsArray.push(this.buildColorGroup(color.name, color.hex));
          }
        }

        if (product.thumbnailUrl) {
          this.imagePreview.set(product.thumbnailUrl);
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger ce produit.');
        this.isLoading.set(false);
      },
    });
  }

  private buildSpecGroup(key = '', value = ''): FormGroup {
    return this.fb.nonNullable.group({ key, value });
  }

  private buildColorGroup(name = '', hex = '#000000'): FormGroup {
    return this.fb.nonNullable.group({ name, hex });
  }

  addSpec() {
    this.specsArray.push(this.buildSpecGroup());
  }

  removeSpec(index: number) {
    this.specsArray.removeAt(index);
  }

  addColor() {
    this.colorsArray.push(this.buildColorGroup());
  }

  removeColor(index: number) {
    this.colorsArray.removeAt(index);
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedImageFile = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  saveProduct() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Popup exacte demandée : un champ requis manque.
      this.alertService.error('Something went wrong!', 'Oops...');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();

    const specDetails: Record<string, string> = {};
    for (const spec of raw.specs) {
      if (spec.key?.trim()) {
        specDetails[spec.key.trim()] = spec.value ?? '';
      }
    }

    const colors = raw.colors
      .filter((color: { name: string; hex: string }) => color.name?.trim())
      .map((color: { name: string; hex: string }) => ({ name: color.name, hex: color.hex }));

    const payload = {
      name: raw.name,
      slug: raw.slug,
      description: raw.description || null,
      brand: raw.brand || null,
      price: String(raw.price),
      originalPrice: raw.originalPrice ? String(raw.originalPrice) : undefined,
      stock: raw.stock,
      isActive: raw.isActive,
      isFeatured: raw.isFeatured,
      categoryId: raw.categoryId,
      specDetails,
      colors,
    };

    const request$ = this.isEditMode()
      ? this.productsService.update(this.productId()!, payload)
      : this.productsService.create(payload);

    request$.subscribe({
      next: (product) => {
        if (this.selectedImageFile) {
          this.productsService.uploadImage(product.id, this.selectedImageFile).subscribe({
            next: () => this.onSaveSuccess(),
            error: () => this.onSaveSuccess(), // le produit est sauvé même si l'upload échoue
          });
        } else {
          this.onSaveSuccess();
        }
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set("Impossible d'enregistrer le produit. Vérifiez les champs et réessayez.");
        this.alertService.error("Impossible d'enregistrer le produit. Vérifiez les champs et réessayez.");
      },
    });
  }

  private onSaveSuccess() {
    this.isSaving.set(false);
    this.alertService.success(
      this.isEditMode() ? 'Le produit a bien été modifié.' : 'Le produit a bien été ajouté au catalogue.',
      this.isEditMode() ? 'Produit mis à jour' : 'Produit ajouté',
    );
    this.router.navigate(['/admin/products']);
  }
}