import { Product } from '@models/product.model';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: string;
}

export interface OrderUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface Order {
  total: unknown;
  id: string;
  userId: string;
  user?: OrderUser;
  status: OrderStatus;
  totalAmount: string;
  shippingAddress: string;
  stripePaymentIntentId: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  items: { productId: string; quantity: number }[];
  shippingAddress: string;
}