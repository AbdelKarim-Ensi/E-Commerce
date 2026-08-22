// import { Test } from '@nestjs/testing';
// import { ConflictException, NotFoundException } from '@nestjs/common';
// import { CategoriesService } from './categories.service';
// import { PrismaService } from '../../prisma/prisma.service';
// import { createMockPrismaService, MockPrismaService } from '../../prisma/prisma.mock';

// describe('CategoriesService', () => {
//   let service: CategoriesService;
//   let prisma: MockPrismaService;

//   beforeEach(async () => {
//     prisma = createMockPrismaService();
//     const moduleRef = await Test.createTestingModule({
//       providers: [CategoriesService, { provide: PrismaService, useValue: prisma }],
//     }).compile();
//     service = moduleRef.get(CategoriesService);
//   });

//   describe('create', () => {
//     it('creates a category when name and slug are both free', async () => {
//       prisma.category.findFirst.mockResolvedValue(null);
//       prisma.category.create.mockResolvedValue({
//         id: 'cat-1',
//         name: 'Electronics',
//         slug: 'electronics',
//       } as any);

//       const result = await service.create({ name: 'Electronics', slug: 'electronics' });

//       expect(prisma.category.findFirst).toHaveBeenCalledWith({
//         where: { OR: [{ name: 'Electronics' }, { slug: 'electronics' }] },
//       });
//       expect(result.id).toBe('cat-1');
//     });

//     it('throws ConflictException when the name or slug is already used', async () => {
//       prisma.category.findFirst.mockResolvedValue({ id: 'existing' } as any);

//       await expect(
//         service.create({ name: 'Electronics', slug: 'electronics' }),
//       ).rejects.toThrow(ConflictException);
//       expect(prisma.category.create).not.toHaveBeenCalled();
//     });
//   });

//   describe('findAll', () => {
//     it('returns categories ordered by name', async () => {
//       prisma.category.findMany.mockResolvedValue([]);

//       await service.findAll();

//       expect(prisma.category.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } });
//     });
//   });

//   describe('findOne', () => {
//     it('throws NotFoundException when the category does not exist', async () => {
//       prisma.category.findUnique.mockResolvedValue(null);

//       await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
//     });

//     it('returns the category with its products included', async () => {
//       const category = { id: 'cat-1', name: 'Electronics', products: [] };
//       prisma.category.findUnique.mockResolvedValue(category as any);

//       const result = await service.findOne('cat-1');

//       expect(prisma.category.findUnique).toHaveBeenCalledWith({
//         where: { id: 'cat-1' },
//         include: { products: true },
//       });
//       expect(result).toBe(category);
//     });
//   });

//   describe('update', () => {
//     it('checks existence before updating', async () => {
//       prisma.category.findUnique.mockResolvedValue({ id: 'cat-1', products: [] } as any);
//       prisma.category.update.mockResolvedValue({ id: 'cat-1', name: 'New name' } as any);

//       const result = await service.update('cat-1', { name: 'New name' });

//       expect(prisma.category.update).toHaveBeenCalledWith({
//         where: { id: 'cat-1' },
//         data: { name: 'New name' },
//       });
//       expect(result.name).toBe('New name');
//     });

//     it('throws NotFoundException when updating a non-existent category', async () => {
//       prisma.category.findUnique.mockResolvedValue(null);

//       await expect(service.update('missing', { name: 'X' })).rejects.toThrow(
//         NotFoundException,
//       );
//       expect(prisma.category.update).not.toHaveBeenCalled();
//     });
//   });

//   describe('remove', () => {
//     it('checks existence before deleting', async () => {
//       prisma.category.findUnique.mockResolvedValue({ id: 'cat-1', products: [] } as any);
//       prisma.category.delete.mockResolvedValue({ id: 'cat-1' } as any);

//       await service.remove('cat-1');

//       expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 'cat-1' } });
//     });

//     it('throws NotFoundException when deleting a non-existent category', async () => {
//       prisma.category.findUnique.mockResolvedValue(null);

//       await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
//       expect(prisma.category.delete).not.toHaveBeenCalled();
//     });
//   });
// });
