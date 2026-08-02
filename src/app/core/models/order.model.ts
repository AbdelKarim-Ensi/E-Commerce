import { Product } from '@models/product.model';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: string; // Decimal Prisma → string
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: string; // Decimal Prisma → string
  stripePaymentIntentId: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Payload pour POST /orders
export interface CreateOrderPayload {
  items: { productId: string; quantity: number }[];
}