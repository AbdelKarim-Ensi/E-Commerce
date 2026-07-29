import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { randomUUID } from 'crypto';
import { Role, OrderStatus } from '@prisma/client';
import { createTestApp } from './utils/test-app.setup';
import { createTestUser, createTestCategory, cleanupTestData } from './utils/seed.helper';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Orders lifecycle (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let clientCookie: string;
  let otherClientCookie: string;
  let adminCookie: string;

  const userIdsToClean: string[] = [];
  const categoryIdsToClean: string[] = [];
  const productIdsToClean: string[] = [];
  const orderIdsToClean: string[] = [];

  async function loginAs(email: string, password: string) {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    const rawCookies = res.headers['set-cookie'];
    const cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
    return cookies.find((c) => c.startsWith('access_token='))!.split(';')[0];
  }

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);

    const client = await createTestUser(prisma, Role.CLIENT);
    userIdsToClean.push(client.user.id);

    const otherClient = await createTestUser(prisma, Role.CLIENT);
    userIdsToClean.push(otherClient.user.id);

    const admin = await createTestUser(prisma, Role.ADMIN);
    userIdsToClean.push(admin.user.id);

    // Un seul login par rôle, réutilisé dans tous les tests, pour rester
    // largement sous la limite de throttling de /auth/login (5 req/min).
    clientCookie = await loginAs(client.email, client.password);
    otherClientCookie = await loginAs(otherClient.email, otherClient.password);
    adminCookie = await loginAs(admin.email, admin.password);
  });

  afterAll(async () => {
    if (orderIdsToClean.length > 0) {
      // Les OrderItem sont supprimés en cascade avec leur Order (schema.prisma).
      await prisma.order.deleteMany({ where: { id: { in: orderIdsToClean } } });
    }
    if (productIdsToClean.length > 0) {
      await prisma.product.deleteMany({ where: { id: { in: productIdsToClean } } });
    }
    await cleanupTestData(prisma, { userIds: userIdsToClean, categoryIds: categoryIdsToClean });
    await app.close();
  });

  async function makeProduct(opts: { stock: number; isActive?: boolean; price?: number }) {
    const category = await createTestCategory(prisma);
    categoryIdsToClean.push(category.id);

    const suffix = randomUUID().slice(0, 8);
    const product = await prisma.product.create({
      data: {
        name: `E2E Order Product ${suffix}`,
        slug: `e2e-order-product-${suffix}`,
        price: opts.price ?? 25,
        stock: opts.stock,
        isActive: opts.isActive ?? true,
        categoryId: category.id,
      },
    });
    productIdsToClean.push(product.id);
    return product;
  }

  it('creates an order and atomically decrements stock', async () => {
    const product = await makeProduct({ stock: 10, price: 20 });

    const res = await request(app.getHttpServer())
      .post('/orders')
      .set('Cookie', clientCookie)
      .send({ items: [{ productId: product.id, quantity: 3 }] })
      .expect(201);

    orderIdsToClean.push(res.body.id);
    expect(res.body.status).toBe(OrderStatus.PENDING);
    expect(Number(res.body.totalAmount)).toBe(60);

    const updatedProduct = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(updatedProduct.stock).toBe(7);
  });

  it('rejects order creation when stock is insufficient and leaves stock untouched', async () => {
    const product = await makeProduct({ stock: 1 });

    await request(app.getHttpServer())
      .post('/orders')
      .set('Cookie', clientCookie)
      .send({ items: [{ productId: product.id, quantity: 5 }] })
      .expect(409);

    // La transaction Prisma doit avoir tout annulé (rollback) : le stock
    // n'a pas dû être décrémenté malgré l'échec en cours de route.
    const untouched = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(untouched.stock).toBe(1);
  });

  it('rejects order creation for a non-existent product', async () => {

    await request(app.getHttpServer())
      .post('/orders')
      .set('Cookie', clientCookie)
      .send({ items: [{ productId: '00000000-0000-0000-0000-000000000000', quantity: 1 }] })
      .expect(404);
  });

  it('rejects order creation for an inactive product', async () => {
    const product = await makeProduct({ stock: 10, isActive: false });

    await request(app.getHttpServer())
      .post('/orders')
      .set('Cookie', clientCookie)
      .send({ items: [{ productId: product.id, quantity: 1 }] })
      .expect(400);
  });

  it('lets the owner view their order but forbids another client', async () => {
    const product = await makeProduct({ stock: 10 });

    const createRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Cookie', clientCookie)
      .send({ items: [{ productId: product.id, quantity: 1 }] })
      .expect(201);
    orderIdsToClean.push(createRes.body.id);

    await request(app.getHttpServer())
      .get(`/orders/${createRes.body.id}`)
      .set('Cookie', clientCookie)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/orders/${createRes.body.id}`)
      .set('Cookie', otherClientCookie)
      .expect(403);

    await request(app.getHttpServer())
      .get(`/orders/${createRes.body.id}`)
      .set('Cookie', adminCookie)
      .expect(200);
  });

  it('forbids a CLIENT from updating order status', async () => {
    const product = await makeProduct({ stock: 10 });

    const createRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Cookie', clientCookie)
      .send({ items: [{ productId: product.id, quantity: 1 }] })
      .expect(201);
    orderIdsToClean.push(createRes.body.id);

    await request(app.getHttpServer())
      .patch(`/orders/${createRes.body.id}/status`)
      .set('Cookie', clientCookie)
      .send({ status: OrderStatus.PAID })
      .expect(403);
  });

  it('allows a valid transition (PENDING -> PAID) by an admin', async () => {
    const product = await makeProduct({ stock: 10 });

    const createRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Cookie', clientCookie)
      .send({ items: [{ productId: product.id, quantity: 1 }] })
      .expect(201);
    orderIdsToClean.push(createRes.body.id);

    const res = await request(app.getHttpServer())
      .patch(`/orders/${createRes.body.id}/status`)
      .set('Cookie', adminCookie)
      .send({ status: OrderStatus.PAID })
      .expect(200);

    expect(res.body.status).toBe(OrderStatus.PAID);
  });

  it('restores stock when an order is cancelled', async () => {
    const product = await makeProduct({ stock: 10 });

    const createRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Cookie', clientCookie)
      .send({ items: [{ productId: product.id, quantity: 4 }] })
      .expect(201);
    orderIdsToClean.push(createRes.body.id);

    const afterCreate = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(afterCreate.stock).toBe(6);

    await request(app.getHttpServer())
      .patch(`/orders/${createRes.body.id}/status`)
      .set('Cookie', adminCookie)
      .send({ status: OrderStatus.CANCELLED })
      .expect(200);

    const afterCancel = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(afterCancel.stock).toBe(10);
  });

  it('returns 400 (not 500) on an invalid state transition', async () => {
    const product = await makeProduct({ stock: 10 });

    const createRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Cookie', clientCookie)
      .send({ items: [{ productId: product.id, quantity: 1 }] })
      .expect(201);
    orderIdsToClean.push(createRes.body.id);

    // PENDING -> DELIVERED n'existe pas dans ORDER_TRANSITIONS (il faut
    // passer par PAID puis SHIPPED d'abord).
    await request(app.getHttpServer())
      .patch(`/orders/${createRes.body.id}/status`)
      .set('Cookie', adminCookie)
      .send({ status: OrderStatus.DELIVERED })
      .expect(400);

    // La commande n'a pas dû être modifiée malgré l'erreur.
    const untouched = await prisma.order.findUniqueOrThrow({ where: { id: createRes.body.id } });
    expect(untouched.status).toBe(OrderStatus.PENDING);
  });
});