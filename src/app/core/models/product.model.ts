import { Category } from '@models/category.model';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  originalPrice?: string;
  discountPercent?: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  brand: string | null;
  attributes: Record<string, unknown> | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  images?: string[];
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
  colors?: ProductColor[];
  storage?: string[];
  specs?: string[];
  specDetails?: Record<string, string>;
  rating: number | null;
  reviewsCount: number | null;
}