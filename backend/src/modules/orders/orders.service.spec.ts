import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Prisma, Role } from '@prisma/client';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockPrismaService, MockPrismaService } from '../../prisma/prisma.mock';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const moduleRef = await Test.createTestingModule({
      providers: [OrdersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(OrdersService);
  });

  function mockProduct(overrides: Record<string, unknown> = {}) {
    return {
      id: 'prod-1',
      name: 'Widget',
      slug: 'widget',
      price: new Prisma.Decimal(20),
      stock: 10,
      isActive: true,
      categoryId: 'cat-1',
      imageUrl: null,
      thumbnailUrl: null,
      description: null,
      attributes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  describe('create', () => {
    const userId = 'user-1';

    beforeEach(() => {
      (prisma.$transaction as jest.Mock).mockImplementation((cb: any) => cb(prisma));
    });

    it('creates an order and decrements stock atomically', async () => {
      const product = mockProduct();
      prisma.product.findMany.mockResolvedValue([product] as any);
      prisma.product.updateMany.mockResolvedValue({ count: 1 });
      prisma.order.create.mockResolvedValue({
        id: 'order-1',
        userId,
        status: OrderStatus.PENDING,
        totalAmount: new Prisma.Decimal(40),
        items: [],
      } as any);

      const result = await service.create(userId, {
        items: [{ productId: product.id, quantity: 2 }],
      });

      expect(prisma.product.updateMany).toHaveBeenCalledWith({
        where: { id: product.id, stock: { gte: 2 } },
        data: { stock: { decrement: 2 } },
      });
      expect(result.id).toBe('order-1');
    });

    it('throws NotFoundException when a product does not exist', async () => {
      prisma.product.findMany.mockResolvedValue([]);

      await expect(
        service.create(userId, { items: [{ productId: 'missing', quantity: 1 }] }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException for an inactive product', async () => {
      const product = mockProduct({ isActive: false });
      prisma.product.findMany.mockResolvedValue([product] as any);

      await expect(
        service.create(userId, { items: [{ productId: product.id, quantity: 1 }] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws ConflictException when stock is insufficient', async () => {
      const product = mockProduct({ stock: 1 });
      prisma.product.findMany.mockResolvedValue([product] as any);
      prisma.product.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.create(userId, { items: [{ productId: product.id, quantity: 5 }] }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('filters by userId for a CLIENT', async () => {
      prisma.order.findMany.mockResolvedValue([]);

      await service.findAll('user-1', Role.CLIENT);

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } }),
      );
    });

    it('returns all orders for an ADMIN (no filter)', async () => {
      prisma.order.findMany.mockResolvedValue([]);

      await service.findAll('admin-1', Role.ADMIN);

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when the order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing', 'user-1', Role.CLIENT)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("throws ForbiddenException when a CLIENT requests another user's order", async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        userId: 'someone-else',
      } as any);

      await expect(service.findOne('order-1', 'user-1', Role.CLIENT)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('lets an ADMIN access any order regardless of ownership', async () => {
      const order = { id: 'order-1', userId: 'someone-else' };
      prisma.order.findUnique.mockResolvedValue(order as any);

      const result = await service.findOne('order-1', 'admin-1', Role.ADMIN);

      expect(result).toBe(order);
    });
  });

  describe('updateStatus', () => {
    beforeEach(() => {
      (prisma.$transaction as jest.Mock).mockImplementation((cb: any) => cb(prisma));
    });

    it('throws NotFoundException when the order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('missing', { status: OrderStatus.PAID }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException on an invalid transition', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.PENDING,
      } as any);

      await expect(
        service.updateStatus('order-1', { status: OrderStatus.DELIVERED }),
      ).rejects.toThrow(BadRequestException);
    });

    it('restores product stock for every item when cancelling an order', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.PENDING,
      } as any);
      prisma.orderItem.findMany.mockResolvedValue([
        {
          id: 'item-1',
          orderId: 'order-1',
          productId: 'prod-1',
          quantity: 3,
          unitPrice: new Prisma.Decimal(20),
        },
      ] as any);
      prisma.order.update.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.CANCELLED,
      } as any);

      await service.updateStatus('order-1', { status: OrderStatus.CANCELLED });

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: { stock: { increment: 3 } },
      });
    });

    it('updates the status on a valid transition', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.PENDING,
      } as any);
      prisma.order.update.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.PAID,
      } as any);

      const result = await service.updateStatus('order-1', { status: OrderStatus.PAID });

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { status: OrderStatus.PAID },
        include: { items: true },
      });
      expect(result.status).toBe(OrderStatus.PAID);
    });
  });
});