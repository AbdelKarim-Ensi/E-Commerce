import { Test } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: { [K in keyof OrdersService]: jest.Mock };

  const user = { userId: 'user-1', email: 'a@test.local', role: Role.CLIENT };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateStatus: jest.fn(),
    } as any;

    const moduleRef = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: service }],
    }).compile();

    controller = moduleRef.get(OrdersController);
  });

  it('delegates create to the service with the current user id and dto', async () => {
    const dto = { items: [{ productId: 'p1', quantity: 2 }] };
    service.create.mockResolvedValue({ id: 'order-1' });

    const result = await controller.create(user as any, dto as any);

    expect(service.create).toHaveBeenCalledWith('user-1', dto);
    expect(result).toEqual({ id: 'order-1' });
  });

  it('delegates findAll with the current user id and role', async () => {
    service.findAll.mockResolvedValue([]);

    await controller.findAll(user as any);

    expect(service.findAll).toHaveBeenCalledWith('user-1', Role.CLIENT);
  });

  it('delegates findOne with id, user id and role', async () => {
    service.findOne.mockResolvedValue({ id: 'order-1' });

    await controller.findOne('order-1', user as any);

    expect(service.findOne).toHaveBeenCalledWith('order-1', 'user-1', Role.CLIENT);
  });

  it('delegates updateStatus with id and dto', async () => {
    const dto = { status: 'PAID' };
    service.updateStatus.mockResolvedValue({ id: 'order-1', status: 'PAID' });

    const result = await controller.updateStatus('order-1', dto as any);

    expect(service.updateStatus).toHaveBeenCalledWith('order-1', dto);
    expect(result).toEqual({ id: 'order-1', status: 'PAID' });
  });
});