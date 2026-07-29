import { Test } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { StorageService } from '../uploads/storage.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: { [K in keyof ProductsService]: jest.Mock };
  let storageService: { [K in keyof StorageService]: jest.Mock };

  beforeEach(async () => {
    productsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      updateImages: jest.fn(),
    } as any;

    storageService = {
      deleteProductImages: jest.fn(),
      uploadProductImage: jest.fn(),
    } as any;

    const moduleRef = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: productsService },
        { provide: StorageService, useValue: storageService },
      ],
    }).compile();

    controller = moduleRef.get(ProductsController);
  });

  it('delegates create to the service with the dto', async () => {
    const dto = { name: 'Widget' };
    productsService.create.mockResolvedValue({ id: 'prod-1' });

    const result = await controller.create(dto as any);

    expect(productsService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 'prod-1' });
  });

  it('delegates findAll to the service', async () => {
    productsService.findAll.mockResolvedValue([]);
    await controller.findAll();
    expect(productsService.findAll).toHaveBeenCalled();
  });

  it('delegates findOne with the given id', async () => {
    productsService.findOne.mockResolvedValue({ id: 'prod-1' });
    await controller.findOne('prod-1');
    expect(productsService.findOne).toHaveBeenCalledWith('prod-1');
  });

  it('delegates update with id and dto', async () => {
    const dto = { name: 'New name' };
    productsService.update.mockResolvedValue({ id: 'prod-1', name: 'New name' });
    await controller.update('prod-1', dto as any);
    expect(productsService.update).toHaveBeenCalledWith('prod-1', dto);
  });

  it('delegates remove with the given id', async () => {
    productsService.remove.mockResolvedValue({ id: 'prod-1' });
    await controller.remove('prod-1');
    expect(productsService.remove).toHaveBeenCalledWith('prod-1');
  });

  describe('uploadImage', () => {
    it('orchestrates existence check, cleanup, upload and persistence in order', async () => {
      const file = { buffer: Buffer.from('fake'), mimetype: 'image/jpeg' } as Express.Multer.File;
      productsService.findOne.mockResolvedValue({ id: 'prod-1' });
      storageService.deleteProductImages.mockResolvedValue(undefined);
      storageService.uploadProductImage.mockResolvedValue({
        imageUrl: 'https://x/img.webp',
        thumbnailUrl: 'https://x/img-thumb.webp',
      });
      productsService.updateImages.mockResolvedValue({
        id: 'prod-1',
        imageUrl: 'https://x/img.webp',
        thumbnailUrl: 'https://x/img-thumb.webp',
      });

      const result = await controller.uploadImage('prod-1', file);

      expect(productsService.findOne).toHaveBeenCalledWith('prod-1');
      expect(storageService.deleteProductImages).toHaveBeenCalledWith('prod-1');
      expect(storageService.uploadProductImage).toHaveBeenCalledWith(file, 'prod-1');
      expect(productsService.updateImages).toHaveBeenCalledWith(
        'prod-1',
        'https://x/img.webp',
        'https://x/img-thumb.webp',
      );
      expect(result.imageUrl).toBe('https://x/img.webp');
    });

    it('propagates NotFoundException from findOne without calling storage', async () => {
      productsService.findOne.mockRejectedValue(new Error('not found'));
      const file = { buffer: Buffer.from('fake') } as Express.Multer.File;

      await expect(controller.uploadImage('missing', file)).rejects.toThrow('not found');
      expect(storageService.deleteProductImages).not.toHaveBeenCalled();
      expect(storageService.uploadProductImage).not.toHaveBeenCalled();
    });
  });
});