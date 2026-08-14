import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Role } from '@prisma/client';

interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
}

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: { userId: string }) {
    return this.usersService.findMe(user.userId);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: { userId: string }, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(user.userId, dto);
  }

  @Patch('me/password')
  changePassword(@CurrentUser() user: { userId: string }, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.userId, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.usersService.findAll(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  updateRole(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(id, currentUser.userId, dto);
  }
}