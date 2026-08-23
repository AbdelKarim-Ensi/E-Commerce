import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  createMockPrismaService,
  MockPrismaService,
} from '../../prisma/prisma.mock';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(ProductsService);
  });

  describe('create', () => {
    it('creates a product from the dto', async () => {
      const dto = {
        name: 'Widget',
        slug: 'widget',
        price: 20,
        stock: 5,
        categoryId: 'cat-1',
      };
      prisma.product.create.mockResolvedValue({ id: 'prod-1', ...dto } as any);

      const result = await service.create(dto);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: { ...dto, discountPercent: null },
      });
      expect(result.id).toBe('prod-1');
    });
  });

  describe('findAll', () => {
    it('returns only active products with their category', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);

      await service.findAll();

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: { category: true },
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when the product does not exist', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns the product with its category included', async () => {
      const product = {
        id: 'prod-1',
        name: 'Widget',
        category: { id: 'cat-1' },
      };
      prisma.product.findUnique.mockResolvedValue(product as any);

      const result = await service.findOne('prod-1');

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        include: { category: true },
      });
      expect(result).toBe(product);
    });
  });

  describe('update', () => {
    it('checks existence before updating', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'prod-1' } as any);
      prisma.product.update.mockResolvedValue({
        id: 'prod-1',
        name: 'New name',
      } as any);

      const result = await service.update('prod-1', {
        name: 'New name',
      });

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: { name: 'New name', discountPercent: null },
      });
      expect(result.name).toBe('New name');
    });

    it('throws NotFoundException when updating a non-existent product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(
        service.update('missing', { name: 'X' } as any),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.product.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('checks existence before deleting', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'prod-1' } as any);
      prisma.product.delete.mockResolvedValue({ id: 'prod-1' } as any);

      await service.remove('prod-1');

      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
      });
    });

    it('throws NotFoundException when deleting a non-existent product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.product.delete).not.toHaveBeenCalled();
    });
  });

  describe('updateImages', () => {
    it('checks existence then persists imageUrl and thumbnailUrl', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'prod-1' } as any);
      prisma.product.update.mockResolvedValue({
        id: 'prod-1',
        imageUrl: 'https://x/img.webp',
        thumbnailUrl: 'https://x/img-thumb.webp',
      } as any);

      const result = await service.updateImages(
        'prod-1',
        'https://x/img.webp',
        'https://x/img-thumb.webp',
      );

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: {
          imageUrl: 'https://x/img.webp',
          thumbnailUrl: 'https://x/img-thumb.webp',
        },
      });
      expect(result.imageUrl).toBe('https://x/img.webp');
    });

    it('throws NotFoundException when the product does not exist', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(
        service.updateImages(
          'missing',
          'https://x/img.webp',
          'https://x/thumb.webp',
        ),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.product.update).not.toHaveBeenCalled();
    });
  });
});