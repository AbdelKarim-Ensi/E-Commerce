import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductsService } from '@services/products.service';
import { CategoriesService } from '@services/categories.service';
import { AlertService } from '@services/alert.service';
import { Product } from '@models/product.model';
import { Category } from '@models/category.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts {
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  private searchSubject = new Subject<string>();

  isLoading = signal(true);
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  search = signal('');
  selectedCategoryId = signal<string>('');

  page = signal(1);
  limit = signal(10);
  total = signal(0);

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit())));

  constructor() {
    this.searchSubject.pipe(debounceTime(350), distinctUntilChanged()).subscribe((value) => {
      this.search.set(value);
      this.page.set(1);
      this.loadProducts();
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  onSearchInput(value: string) {
    this.searchSubject.next(value);
  }

  onCategoryChange(categoryId: string) {
    this.selectedCategoryId.set(categoryId);
    this.page.set(1);
    this.loadProducts();
  }

  private loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.categories.set([]),
    });
  }

  private loadProducts() {
    this.isLoading.set(true);
    this.productsService
      .getAllAdmin({
        search: this.search() || undefined,
        categoryId: this.selectedCategoryId() || undefined,
        page: this.page(),
        limit: this.limit(),
      })
      .subscribe({
        next: (result) => {
          this.products.set(result?.data ?? []);
          this.total.set(result?.total ?? 0);
          this.isLoading.set(false);
        },
        error: () => {
          this.products.set([]);
          this.total.set(0);
          this.isLoading.set(false);
        },
      });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.page.set(page);
    this.loadProducts();
  }

  goToNewProduct() {
    this.router.navigate(['/admin/products/new']);
  }

  goToEditProduct(product: Product) {
    this.router.navigate(['/admin/products', product.id, 'edit']);
  }

  async deleteProduct(product: Product) {
    const confirmed = await this.alertService.confirm({
      title: 'Supprimer ce produit ?',
      text: `"${product.name}" sera définitivement supprimé. Cette action est irréversible.`,
      danger: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    });
    if (!confirmed) return;

    this.productsService.delete(product.id).subscribe({
      next: () => {
        this.loadProducts();
        this.alertService.success('Produit supprimé.');
      },
      error: () => {
        this.alertService.error('Impossible de supprimer ce produit.');
      },
    });
  }

  stockClasses(stock: number): string {
    if (stock === 0) return 'bg-red-50 text-red-700 ring-red-600/20';
    if (stock < 5) return 'bg-amber-50 text-amber-700 ring-amber-600/20';
    return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
  }

  displayRangeEnd(): number {
    return Math.min(this.page() * this.limit(), this.total());
  }
}