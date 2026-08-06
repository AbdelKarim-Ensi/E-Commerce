import { Injectable, signal } from '@angular/core';
import { Product } from '@models/product.model';

@Injectable({ providedIn: 'root' })
export class ShowcaseService {
  private _product = signal<Product | null>(null);
  readonly product = this._product.asReadonly();

  setProduct(product: Product) {
    this._product.set(product);
  }

  clear() {
    this._product.set(null);
  }
}