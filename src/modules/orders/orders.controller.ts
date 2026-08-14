import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(user.userId, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ordersService.findAll(
      user.userId,
      user.role,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.findOne(id, user.userId, user.role);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.STOCK_MANAGER)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  
  @Post(':id/refund')
  refund(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.refundOrder(id, user);
  }
}