import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, Prisma } from '@prisma/client';

// PaymentService instancie `new Stripe(...)` lui-même en interne (pas injecté
// via DI), donc on mocke le module 'stripe' entier plutôt que d'essayer de
// substituer une instance. `mockImplementation` qui retourne un objet fait que
// `new Stripe(...)` renvoie cet objet (comportement standard de `new` en JS
// quand le constructeur retourne explicitement un objet).
const mockConstructEvent = jest.fn();
const mockPaymentIntentsCreate = jest.fn();
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: { constructEvent: mockConstructEvent },
    paymentIntents: { create: mockPaymentIntentsCreate },
  }));
});

import { PaymentService } from './payment.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsQueue } from '../notifications/queues/notifications.queue';
import { createMockPrismaService, MockPrismaService } from '../../prisma/prisma.mock';

describe('PaymentService', () => {
  let service: PaymentService;
  let prisma: MockPrismaService;
  let notificationsQueue: { enqueueOrderConfirmation: jest.Mock };

  beforeEach(async () => {
    jest.clearAllMocks();
    prisma = createMockPrismaService();
    notificationsQueue = { enqueueOrderConfirmation: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PrismaService, useValue: prisma },
        { provide: NotificationsQueue, useValue: notificationsQueue },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const values: Record<string, string> = {
                STRIPE_SECRET_KEY: 'sk_test_fake',
                STRIPE_WEBHOOK_SECRET: 'whsec_fake',
              };
              return values[key];
            }),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(PaymentService);
  });

  describe('createPaymentIntent', () => {
    it('throws NotFoundException when the order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(service.createPaymentIntent('order-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it("throws BadRequestException when the order belongs to another user", async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        userId: 'someone-else',
        status: OrderStatus.PENDING,
        totalAmount: new Prisma.Decimal(50),
      } as any);

      await expect(service.createPaymentIntent('order-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when the order is not PENDING', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        userId: 'user-1',
        status: OrderStatus.PAID,
        totalAmount: new Prisma.Decimal(50),
      } as any);

      await expect(service.createPaymentIntent('order-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('creates a Stripe PaymentIntent and stores its id on the order', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        userId: 'user-1',
        status: OrderStatus.PENDING,
        totalAmount: new Prisma.Decimal(49.99),
      } as any);
      mockPaymentIntentsCreate.mockResolvedValue({
        id: 'pi_123',
        client_secret: 'secret_abc',
      });
      prisma.order.update.mockResolvedValue({} as any);

      const result = await service.createPaymentIntent('order-1', 'user-1');

      expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 4999, currency: 'eur' }),
      );
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { stripePaymentIntentId: 'pi_123' },
      });
      expect(result).toEqual({ clientSecret: 'secret_abc', paymentIntentId: 'pi_123' });
    });
  });

  describe('handleWebhookEvent', () => {
    const rawBody = Buffer.from('{}');

    it('throws BadRequestException when the signature is invalid', async () => {
      mockConstructEvent.mockImplementation(() => {
        throw new Error('invalid signature');
      });

      await expect(service.handleWebhookEvent(rawBody, 'bad-sig')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('skips processing when the event was already handled (idempotence)', async () => {
      mockConstructEvent.mockReturnValue({
        id: 'evt_1',
        type: 'payment_intent.succeeded',
        data: { object: { metadata: { orderId: 'order-1' } } },
      });
      prisma.processedWebhookEvent.findUnique.mockResolvedValue({
        id: 'evt_1',
        eventType: 'payment_intent.succeeded',
      } as any);

      const result = await service.handleWebhookEvent(rawBody, 'sig');

      expect(result).toEqual({ received: true, duplicate: true });
      expect(prisma.order.update).not.toHaveBeenCalled();
    });

    it('marks a PENDING order as PAID and enqueues the confirmation notification', async () => {
      mockConstructEvent.mockReturnValue({
        id: 'evt_1',
        type: 'payment_intent.succeeded',
        data: { object: { metadata: { orderId: 'order-1' } } },
      });
      prisma.processedWebhookEvent.findUnique.mockResolvedValue(null);
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.PENDING,
      } as any);
      prisma.order.update.mockResolvedValue({} as any);
      prisma.processedWebhookEvent.create.mockResolvedValue({} as any);

      const result = await service.handleWebhookEvent(rawBody, 'sig');

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { status: OrderStatus.PAID },
      });
      expect(notificationsQueue.enqueueOrderConfirmation).toHaveBeenCalledWith('order-1');
      expect(prisma.processedWebhookEvent.create).toHaveBeenCalledWith({
        data: { id: 'evt_1', eventType: 'payment_intent.succeeded' },
      });
      expect(result).toEqual({ received: true });
    });

    it('does not touch an order that is no longer PENDING', async () => {
      mockConstructEvent.mockReturnValue({
        id: 'evt_1',
        type: 'payment_intent.succeeded',
        data: { object: { metadata: { orderId: 'order-1' } } },
      });
      prisma.processedWebhookEvent.findUnique.mockResolvedValue(null);
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.SHIPPED,
      } as any);

      await service.handleWebhookEvent(rawBody, 'sig');

      expect(prisma.order.update).not.toHaveBeenCalled();
      expect(notificationsQueue.enqueueOrderConfirmation).not.toHaveBeenCalled();
    });

    it('does nothing harmful on payment_intent.payment_failed', async () => {
      mockConstructEvent.mockReturnValue({
        id: 'evt_1',
        type: 'payment_intent.payment_failed',
        data: { object: { metadata: { orderId: 'order-1' } } },
      });
      prisma.processedWebhookEvent.findUnique.mockResolvedValue(null);

      const result = await service.handleWebhookEvent(rawBody, 'sig');

      expect(prisma.order.update).not.toHaveBeenCalled();
      expect(result).toEqual({ received: true });
    });
  });
});