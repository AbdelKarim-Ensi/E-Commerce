import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import Stripe from 'stripe';
import { randomUUID } from 'crypto';
import { Role, OrderStatus } from '@prisma/client';

// On mocke nodemailer pour éviter toute vraie tentative SMTP en arrière-plan
// (le webhook enfile un job d'email de façon asynchrone après avoir répondu ;
// sans ce mock, BullMQ tenterait 3 vrais essais SMTP avec des identifiants
// factices en arrière-plan pendant/après le test).
const sendMailMock = jest.fn().mockResolvedValue({});
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: sendMailMock })),
}));

import { createTestApp } from './utils/test-app.setup';
import { createTestUser, cleanupTestData } from './utils/seed.helper';
import { PrismaService } from '../src/prisma/prisma.service';

describe('POST /payments/webhooks (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let webhookSecret: string;

  let userId: string;
  const orderIdsToClean: string[] = [];
  const userIdsToClean: string[] = [];
  const eventIdsToClean: string[] = [];

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    const { user } = await createTestUser(prisma, Role.CLIENT);
    userId = user.id;
    userIdsToClean.push(user.id);
  });

  afterAll(async () => {
    await cleanupTestData(prisma, { userIds: userIdsToClean });
    if (orderIdsToClean.length > 0) {
      await prisma.order.deleteMany({ where: { id: { in: orderIdsToClean } } });
    }
    await prisma.processedWebhookEvent.deleteMany({
      where: { id: { in: eventIdsToClean } },
    });
    await app.close();
  });

  async function createPendingOrder(status: OrderStatus = OrderStatus.PENDING) {
    const order = await prisma.order.create({
      data: { userId, totalAmount: 49.99, status },
    });
    orderIdsToClean.push(order.id);
    return order;
  }

  function buildPaymentSucceededEvent(orderId: string) {
    const eventId = `evt_test_${randomUUID()}`;
    eventIdsToClean.push(eventId);

    const payload = JSON.stringify({
      id: eventId,
      object: 'event',
      api_version: '2026-06-24.dahlia',
      created: Math.floor(Date.now() / 1000),
      type: 'payment_intent.succeeded',
      livemode: false,
      pending_webhooks: 0,
      request: { id: null, idempotency_key: null },
      data: {
        object: {
          id: `pi_test_${randomUUID()}`,
          object: 'payment_intent',
          amount: 4999,
          currency: 'eur',
          status: 'succeeded',
          metadata: { orderId },
        },
      },
    });

    return { eventId, payload };
  }

  function sign(payload: string, secret: string) {
    return Stripe.webhooks.generateTestHeaderString({ payload, secret });
  }

  it('marks the order as PAID when a validly signed webhook is received', async () => {
    const order = await createPendingOrder();
    const { payload } = buildPaymentSucceededEvent(order.id);
    const signature = sign(payload, webhookSecret);

    const res = await request(app.getHttpServer())
      .post('/payments/webhooks')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', signature)
      .send(payload)
      .expect(200);

    expect(res.body.received).toBe(true);

    const updated = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    expect(updated.status).toBe(OrderStatus.PAID);
  });

  it('rejects a webhook with an invalid signature and leaves the order untouched', async () => {
    const order = await createPendingOrder();
    const { payload } = buildPaymentSucceededEvent(order.id);
    const badSignature = sign(payload, 'whsec_completely_wrong_secret');

    await request(app.getHttpServer())
      .post('/payments/webhooks')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', badSignature)
      .send(payload)
      .expect(400);

    const untouched = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    expect(untouched.status).toBe(OrderStatus.PENDING);
  });

  it('rejects a webhook with no signature header at all', async () => {
    const order = await createPendingOrder();
    const { payload } = buildPaymentSucceededEvent(order.id);

    await request(app.getHttpServer())
      .post('/payments/webhooks')
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect(400);
  });

  it('is idempotent — replaying the same event id does not reprocess it', async () => {
    const order = await createPendingOrder();
    const { payload } = buildPaymentSucceededEvent(order.id);
    const signature = sign(payload, webhookSecret);

    const first = await request(app.getHttpServer())
      .post('/payments/webhooks')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', signature)
      .send(payload)
      .expect(200);
    expect(first.body.duplicate).toBeUndefined();

    const second = await request(app.getHttpServer())
      .post('/payments/webhooks')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', signature)
      .send(payload)
      .expect(200);
    expect(second.body.duplicate).toBe(true);

    const updated = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    expect(updated.status).toBe(OrderStatus.PAID);
  });

  it('does not touch an order that is no longer PENDING (defensive guard)', async () => {
    const order = await createPendingOrder(OrderStatus.SHIPPED);
    const { payload } = buildPaymentSucceededEvent(order.id);
    const signature = sign(payload, webhookSecret);

    await request(app.getHttpServer())
      .post('/payments/webhooks')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', signature)
      .send(payload)
      .expect(200);

    const untouched = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    expect(untouched.status).toBe(OrderStatus.SHIPPED);
  });
});
