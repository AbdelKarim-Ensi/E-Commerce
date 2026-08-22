import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from './prisma.service';

export type MockPrismaService = DeepMockProxy<PrismaService>;

/**
 * Crée un mock profond de PrismaService : chaque méthode (product.findMany,
 * order.create, $transaction, etc.) devient un jest.fn() contrôlable,
 * sans jamais toucher à une vraie base de données.
 */
export function createMockPrismaService(): MockPrismaService {
  return mockDeep<PrismaService>();
}
