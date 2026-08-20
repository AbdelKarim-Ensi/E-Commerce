import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import sharp from 'sharp';
import { Role, Category, Product } from '@prisma/client';
import { afterAll, afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { buildSupabaseMock } from './utils/supabase.mock';

const supabaseMock = buildSupabaseMock();
jest.mock('@supabase/supabase-js', () => ({
  createClient: supabaseMock.createClient,
}));

import { createTestApp } from './utils/test-app.setup';
import {
  createTestUser,
  createTestCategory,
  createTestProduct,
  cleanupTestData,
} from './utils/seed.helper';
import { PrismaService } from '../src/prisma/prisma.service';

describe('POST /products/:id/image (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let category: Category;
  let product: Product;

  let adminEmail: string;
  let adminPassword: string;
  let clientEmail: string;
  let clientPassword: string;

  const userIdsToClean: string[] = [];

  const validImageBuffer = async () =>
    sharp({
      create: { width: 20, height: 20, channels: 3, background: { r: 200, g: 30, b: 30 } },
    })
      .jpeg()
      .toBuffer();

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);

    category = await createTestCategory(prisma);
    product = await createTestProduct(prisma, category.id);

    const admin = await createTestUser(prisma, Role.ADMIN);
    adminEmail = admin.email;
    adminPassword = admin.password;
    userIdsToClean.push(admin.user.id);

    const client = await createTestUser(prisma, Role.CLIENT);
    clientEmail = client.email;
    clientPassword = client.password;
    userIdsToClean.push(client.user.id);
  });

  afterAll(async () => {
    await cleanupTestData(prisma, {
      productIds: [product.id],
      categoryIds: [category.id],
      userIds: userIdsToClean,
    });
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  async function loginAs(email: string, password: string) {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    const rawCookies = res.headers['set-cookie'];
    const cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
    const accessCookie = cookies.find((c) => c.startsWith('access_token='))!;
    return accessCookie.split(';')[0];
  }

  it('uploads a valid image and persists imageUrl + thumbnailUrl', async () => {
    const cookie = await loginAs(adminEmail, adminPassword);
    const image = await validImageBuffer();

    const res = await request(app.getHttpServer())
      .post(`/products/${product.id}/image`)
      .set('Cookie', cookie)
      .attach('file', image, 'test-product.jpg')
      .expect(201);

    expect(res.body.id).toBe(product.id);
    expect(res.body.imageUrl).toContain('product-images/');
    expect(res.body.imageUrl).toContain('.webp');
    expect(res.body.thumbnailUrl).toContain('-thumb.webp');

    expect(supabaseMock.mocks.listMock).toHaveBeenCalledWith(product.id);
    expect(supabaseMock.mocks.uploadMock).toHaveBeenCalledTimes(2);

    const updated = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(updated.imageUrl).toBe(res.body.imageUrl);
    expect(updated.thumbnailUrl).toBe(res.body.thumbnailUrl);
  });

  it('rejects the request when no auth cookie is provided', async () => {
    const image = await validImageBuffer();

    await request(app.getHttpServer())
      .post(`/products/${product.id}/image`)
      .attach('file', image, 'test-product.jpg')
      .expect(401);

    expect(supabaseMock.mocks.uploadMock).not.toHaveBeenCalled();
  });

  it('rejects the request when the user role is not ADMIN/STOCK_MANAGER', async () => {
    const cookie = await loginAs(clientEmail, clientPassword);
    const image = await validImageBuffer();

    await request(app.getHttpServer())
      .post(`/products/${product.id}/image`)
      .set('Cookie', cookie)
      .attach('file', image, 'test-product.jpg')
      .expect(403);

    expect(supabaseMock.mocks.uploadMock).not.toHaveBeenCalled();
  });

  it('rejects a file larger than 5MB', async () => {
    const cookie = await loginAs(adminEmail, adminPassword);
    const oversized = Buffer.alloc(5 * 1024 * 1024 + 1, 1);

    await request(app.getHttpServer())
      .post(`/products/${product.id}/image`)
      .set('Cookie', cookie)
      .attach('file', oversized, 'too-big.jpg')
      .expect(422);

    expect(supabaseMock.mocks.uploadMock).not.toHaveBeenCalled();
  });

  it('rejects a file whose real content is not an image (magic bytes check)', async () => {
    const cookie = await loginAs(adminEmail, adminPassword);
    const fakeImage = Buffer.from('this is definitely not a real image file');

    const res = await request(app.getHttpServer())
      .post(`/products/${product.id}/image`)
      .set('Cookie', cookie)
      .attach('file', fakeImage, 'fake.jpg')
      .expect(400);

    expect(res.body.message).toMatch(/type réel du fichier|non autorisé/i);
    expect(supabaseMock.mocks.uploadMock).not.toHaveBeenCalled();
  });

  it('returns 404 when the product does not exist', async () => {
    const cookie = await loginAs(adminEmail, adminPassword);
    const image = await validImageBuffer();

    await request(app.getHttpServer())
      .post('/products/00000000-0000-0000-0000-000000000000/image')
      .set('Cookie', cookie)
      .attach('file', image, 'test-product.jpg')
      .expect(404);

    expect(supabaseMock.mocks.uploadMock).not.toHaveBeenCalled();
  });
});