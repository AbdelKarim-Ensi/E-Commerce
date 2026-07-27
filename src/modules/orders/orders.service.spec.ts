// import { Test, TestingModule } from '@nestjs/testing';
// import { OrdersService } from './orders.service';
// import { PrismaService } from '../../prisma/prisma.service';
// import { ConflictException } from '@nestjs/common';
// import { Role } from '@prisma/client';

// describe('OrdersService — Race Condition & Transactions (integration)', () => {
//   let service: OrdersService;
//   let prisma: PrismaService;

//   let userId: string;
//   let categoryId: string;
//   let productId: string;

//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [OrdersService, PrismaService],
//     }).compile();

//     service = module.get<OrdersService>(OrdersService);
//     prisma = module.get<PrismaService>(PrismaService);

//     // Données isolées, préfixées pour identification/nettoyage facile
//     const user = await prisma.user.create({
//       data: {
//         email: `race-test-${Date.now()}@test.local`,
//         passwordHash: 'irrelevant-for-this-test',
//         role: Role.CLIENT,
//       },
//     });
//     userId = user.id;

//     const category = await prisma.category.create({
//       data: { name: `RaceTestCat-${Date.now()}`, slug: `race-test-cat-${Date.now()}` },
//     });
//     categoryId = category.id;

//     const product = await prisma.product.create({
//       data: {
//         name: 'Race Test Product',
//         slug: `race-test-product-${Date.now()}`,
//         price: 100,
//         stock: 1, // <-- un seul exemplaire en stock, le coeur du test
//         categoryId,
//       },
//     });
//     productId = product.id;
//   });

//   afterAll(async () => {
//     // Nettoyage dans l'ordre inverse des FK
//     await prisma.orderItem.deleteMany({ where: { productId } });
//     await prisma.order.deleteMany({ where: { userId } });
//     await prisma.product.deleteMany({ where: { id: productId } });
//     await prisma.category.deleteMany({ where: { id: categoryId } });
//     await prisma.user.deleteMany({ where: { id: userId } });
//     await prisma.$disconnect();
//   });

//   it('empêche deux commandes concurrentes de vendre le même dernier stock', async () => {
//     const dto = { items: [{ productId, quantity: 1 }] };

//     // Deux requêtes tirées EXACTEMENT en même temps
//     const results = await Promise.allSettled([
//       service.create(userId, dto),
//       service.create(userId, dto),
//     ]);

//     const fulfilled = results.filter((r) => r.status === 'fulfilled');
//     const rejected = results.filter((r) => r.status === 'rejected');

//     // Une seule doit réussir
//     expect(fulfilled).toHaveLength(1);
//     expect(rejected).toHaveLength(1);

//     // L'autre doit échouer précisément avec ConflictException (stock insuffisant)
//     const rejection = rejected[0] as PromiseRejectedResult;
//     expect(rejection.reason).toBeInstanceOf(ConflictException);

//     // Le stock final en DB doit être exactement 0, jamais négatif
//     const finalProduct = await prisma.product.findUnique({ where: { id: productId } });
//     expect(finalProduct?.stock).toBe(0);
//   });

//   it('restitue le stock quand une commande PENDING est annulée', async () => {
//     // Remettre du stock pour ce test
//     await prisma.product.update({ where: { id: productId }, data: { stock: 5 } });

//     const order = await service.create(userId, {
//       items: [{ productId, quantity: 3 }],
//     });

//     let product = await prisma.product.findUnique({ where: { id: productId } });
//     expect(product?.stock).toBe(2); // 5 - 3

//     await service.updateStatus(order.id, { status: 'CANCELLED' as any });

//     product = await prisma.product.findUnique({ where: { id: productId } });
//     expect(product?.stock).toBe(5); // stock restitué intégralement
//   });

//   it('rejette une transition invalide (ex: DELIVERED → PENDING)', async () => {
//     await prisma.product.update({ where: { id: productId }, data: { stock: 5 } });

//     const order = await service.create(userId, {
//       items: [{ productId, quantity: 1 }],
//     });

//     // On force artificiellement en DELIVERED pour tester le refus de retour en arrière
//     await prisma.order.update({
//       where: { id: order.id },
//       data: { status: 'DELIVERED' },
//     });

//     await expect(
//       service.updateStatus(order.id, { status: 'PENDING' as any }),
//     ).rejects.toThrow('Transition invalide');
//   });
// });





