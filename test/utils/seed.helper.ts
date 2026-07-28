import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Role } from '@prisma/client';

const TEST_PASSWORD = 'Password123!';

interface TestDataIds {
  userIds?: string[];
  categoryIds?: string[];
  productIds?: string[];
  orderIds?: string[];
  paymentIds?: string[];
}

export async function createTestUser(prisma: PrismaService, role: Role) {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12);
  const email = `e2e-${role.toLowerCase()}-${randomUUID()}@test.local`;

  const user = await prisma.user.create({
    data: { email, passwordHash, role },
  });

  return { user, email, password: TEST_PASSWORD };
}

export async function createTestCategory(prisma: PrismaService) {
  const suffix = randomUUID().slice(0, 8);
  return prisma.category.create({
    data: { name: `E2E Category ${suffix}`, slug: `e2e-category-${suffix}` },
  });
}

export async function createTestProduct(prisma: PrismaService, categoryId: string) {
  const suffix = randomUUID().slice(0, 8);
  return prisma.product.create({
    data: {
      name: `E2E Product ${suffix}`,
      slug: `e2e-product-${suffix}`,
      price: 19.99,
      stock: 10,
      categoryId,
    },
  });
}

export async function cleanupTestData(prisma: PrismaService, ids: TestDataIds) {
  const userIds = ids.userIds || [];
  const orderIds = ids.orderIds || [];
  const productIds = ids.productIds || [];
  const categoryIds = ids.categoryIds || [];
  const paymentIds = ids.paymentIds || [];

  const prismaAny = prisma as any;

  // 1. Supprimer les paiements si la table existe
  if (prismaAny.payment) {
    const paymentConditions = [
      ...(paymentIds.length ? [{ id: { in: paymentIds } }] : []),
      ...(orderIds.length ? [{ orderId: { in: orderIds } }] : []),
      ...(userIds.length ? [{ order: { userId: { in: userIds } } }] : []),
    ];
    if (paymentConditions.length) {
      await prismaAny.payment.deleteMany({ where: { OR: paymentConditions } });
    }
  }

  // 2. Supprimer les événements Webhook si la table existe
  if (prismaAny.processedWebhookEvent) {
    await prismaAny.processedWebhookEvent.deleteMany({});
  }

  // 3. Supprimer les articles de commande (OrderItem) si la table existe
  if (prismaAny.orderItem) {
    const orderItemConditions = [
      ...(orderIds.length ? [{ orderId: { in: orderIds } }] : []),
      ...(userIds.length ? [{ order: { userId: { in: userIds } } }] : []),
    ];
    if (orderItemConditions.length) {
      await prismaAny.orderItem.deleteMany({ where: { OR: orderItemConditions } });
    }
  }

  // 4. Supprimer TOUTES les commandes rattachées aux utilisateurs ou aux IDs
  if (prismaAny.order) {
    const orderConditions = [
      ...(orderIds.length ? [{ id: { in: orderIds } }] : []),
      ...(userIds.length ? [{ userId: { in: userIds } }] : []),
    ];
    if (orderConditions.length) {
      await prismaAny.order.deleteMany({ where: { OR: orderConditions } });
    }
  }

  // 5. Supprimer les produits
  if (productIds.length && prismaAny.product) {
    await prismaAny.product.deleteMany({ where: { id: { in: productIds } } });
  }

  // 6. Supprimer les catégories
  if (categoryIds.length && prismaAny.category) {
    await prismaAny.category.deleteMany({ where: { id: { in: categoryIds } } });
  }

  // 7. Supprimer les utilisateurs EN DERNIER (libérés de toute dépendance)
  if (userIds.length && prismaAny.user) {
    await prismaAny.user.deleteMany({ where: { id: { in: userIds } } });
  }
}

