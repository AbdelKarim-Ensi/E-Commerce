import { OrderStatus } from '@prisma/client';


export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [], // terminal state — nothing can happen after delivery
  [OrderStatus.CANCELLED]: [], // terminal state — a cancelled order stays cancelled
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return false; // no-op transitions are rejected, not silently allowed
  return ORDER_STATUS_TRANSITIONS[from].includes(to);
}