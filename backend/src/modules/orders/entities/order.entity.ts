import { OrderStatus } from '@prisma/client';

export class OrderItemEntity {
  id!: string;
  productId!: string;
  quantity!: number;
  unitPrice!: number;
}

export class OrderEntity {
  id!: string;
  userId!: string;
  status!: OrderStatus;
  totalAmount!: number;
  stripePaymentIntentId!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  items!: OrderItemEntity[];
}
