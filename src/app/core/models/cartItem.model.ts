import { Product } from '@models/product.model';

// Concept frontend uniquement — pas de modèle Cart côté backend.
export interface CartItem {
  product: Product;
  quantity: number;
}