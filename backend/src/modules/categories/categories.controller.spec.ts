import { Test } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: { [K in keyof CategoriesService]: jest.Mock };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: service }],
    }).compile();

    controller = moduleRef.get(CategoriesController);
  });

  it('delegates findAll to the service', async () => {
    service.findAll.mockResolvedValue(['cat-1']);
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(['cat-1']);
  });

  it('delegates findOne to the service with the given id', async () => {
    service.findOne.mockResolvedValue({ id: 'cat-1' });
    const result = await controller.findOne('cat-1');
    expect(service.findOne).toHaveBeenCalledWith('cat-1');
    expect(result).toEqual({ id: 'cat-1' });
  });

  it('delegates create to the service with the dto', async () => {
    const dto = { name: 'Electronics', slug: 'electronics' };
    service.create.mockResolvedValue({ id: 'cat-1', ...dto });

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 'cat-1', ...dto });
  });

  it('delegates update to the service with id and dto', async () => {
    const dto = { name: 'New name' };
    service.update.mockResolvedValue({ id: 'cat-1', name: 'New name' });

    const result = await controller.update('cat-1', dto);

    expect(service.update).toHaveBeenCalledWith('cat-1', dto);
    expect(result.name).toBe('New name');
  });

  it('delegates remove to the service with the given id', async () => {
    service.remove.mockResolvedValue({ id: 'cat-1' });

    await controller.remove('cat-1');

    expect(service.remove).toHaveBeenCalledWith('cat-1');
  });
});
