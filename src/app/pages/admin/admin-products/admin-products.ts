import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { ProductsService } from '@services/products.service';
import { Product } from '@models/product.model';

@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {
  private productsService = inject(ProductsService);

  readonly Plus = Plus;

  products = signal<Product[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.productsService.getAll().subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  parsePrice(value: string): number {
    return parseFloat(value) ?? 0;
  }
}