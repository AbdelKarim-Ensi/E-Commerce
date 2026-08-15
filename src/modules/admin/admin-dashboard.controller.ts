import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AdminDashboardService } from './admin-dashboard.service';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STOCK_MANAGER)
export class AdminDashboardController {
  constructor(private adminDashboardService: AdminDashboardService) {}

  @Get()
  getAnalytics() {
    return this.adminDashboardService.getAnalytics();
  }
}