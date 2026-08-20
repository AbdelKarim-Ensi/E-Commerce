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
  couponId: string | null;
  discountAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateOrderPayload {
  items: { productId: string; quantity: number }[];
  shippingAddress: string;
  couponCode?: string;
}