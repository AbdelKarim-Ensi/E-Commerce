import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
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
}