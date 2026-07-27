// import { Test, TestingModule } from '@nestjs/testing';
// import { ConfigService } from '@nestjs/config';
// import { PaymentService } from './payment.service';
// import { PrismaService } from '../../prisma/prisma.service';
// import { BadRequestException } from '@nestjs/common';
// import { Role, OrderStatus } from '@prisma/client';

// describe('PaymentService (integration)', () => {
//   let service: PaymentService;
//   let prisma: PrismaService;

//   let ownerId: string;
//   let strangerId: string;
//   let categoryId: string;
//   let productId: string;

//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [PaymentService, PrismaService, ConfigService],
//     }).compile();

//     service = module.get<PaymentService>(PaymentService);
//     prisma = module.get<PrismaService>(PrismaService);

//     const owner = await prisma.user.create({
//       data: {
//         email: `payment-owner-${Date.now()}@test.local`,
//         passwordHash: 'irrelevant',
//         role: Role.CLIENT,
//       },
//     });
//     ownerId = owner.id;

//     const stranger = await prisma.user.create({
//       data: {
//         email: `payment-stranger-${Date.now()}@test.local`,
//         passwordHash: 'irrelevant',
//         role: Role.CLIENT,
//       },
//     });
//     strangerId = stranger.id;

//     const category = await prisma.category.create({
//       data: {
//         name: `PaymentTestCat-${Date.now()}`,
//         slug: `payment-test-cat-${Date.now()}`,
//       },
//     });
//     categoryId = category.id;

//     const product = await prisma.product.create({
//       data: {
//         name: 'Payment Test Product',
//         slug: `payment-test-product-${Date.now()}`,
//         price: 50,
//         stock: 100,
//         categoryId,
//       },
//     });
//     productId = product.id;
//   });

//   afterAll(async () => {
//     await prisma.orderItem.deleteMany({ where: { productId } });
//     await prisma.order.deleteMany({ where: { userId: { in: [ownerId, strangerId] } } });
//     await prisma.product.deleteMany({ where: { id: productId } });
//     await prisma.category.deleteMany({ where: { id: categoryId } });
//     await prisma.user.deleteMany({ where: { id: { in: [ownerId, strangerId] } } });
//     await prisma.$disconnect();
//   });

//   async function createPendingOrder(userId: string) {
//     return prisma.order.create({
//       data: {
//         userId,
//         status: OrderStatus.PENDING,
//         totalAmount: 50,
//         items: {
//           create: [{ productId, quantity: 1, unitPrice: 50 }],
//         },
//       },
//     });
//   }

//   it("refuse de créer un PaymentIntent si la commande n'appartient pas à l'utilisateur", async () => {
//     const order = await createPendingOrder(ownerId);

//     await expect(
//       service.createPaymentIntent(order.id, strangerId),
//     ).rejects.toThrow("Cette commande ne vous appartient pas");
//   });

//   it('refuse de créer un PaymentIntent si la commande n\'est pas PENDING', async () => {
//     const order = await createPendingOrder(ownerId);

//     await prisma.order.update({
//       where: { id: order.id },
//       data: { status: OrderStatus.PAID },
//     });

//     await expect(
//       service.createPaymentIntent(order.id, ownerId),
//     ).rejects.toThrow(BadRequestException);
//   });

//   it('traite payment_intent.payment_failed sans planter et sans changer le statut', async () => {
//     const order = await createPendingOrder(ownerId);

//     // On accède à la méthode privée via cast pour tester isolément la logique métier,
//     // sans dépendre de la vérification de signature Stripe dans ce test unitaire.
//     const fakePaymentIntent = {
//       id: 'pi_fake_failed_test',
//       metadata: { orderId: order.id },
//     } as any;

//     await (service as any).handlePaymentFailed(fakePaymentIntent);

//     const refreshed = await prisma.order.findUnique({ where: { id: order.id } });
//     expect(refreshed?.status).toBe(OrderStatus.PENDING); // reste inchangé, pas de crash
//   });
// });