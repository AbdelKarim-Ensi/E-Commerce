import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Role } from '@prisma/client';

const SALT_ROUNDS = 12;

const USER_LIST_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  createdAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        role: true,
      },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (!user.passwordHash) {
      // Compte créé via Google, jamais de mot de passe défini — rien à
      // "changer" ici, même logique que le garde-fou dans AuthService.login().
      throw new BadRequestException(
        'This account uses Google sign-in and has no password to change.',
      );
    }

    const passwordMatches = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!passwordMatches) {
      throw new BadRequestException('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return { success: true };
  }

  /**
   * Liste paginée des utilisateurs, réservée aux ADMIN (vérifié au niveau
   * du controller via @Roles). Ne retourne jamais passwordHash.
   */
  async findAll(page = 1, limit = 20) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        select: USER_LIST_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  /**
   * Change le rôle d'un utilisateur. Un ADMIN ne peut pas modifier son
   * propre rôle par cette route — évite qu'un admin se rétrograde par
   * erreur et se retrouve bloqué hors de l'admin sans personne d'autre
   * pour l'y remettre.
   */
  async updateRole(targetUserId: string, currentUserId: string, dto: UpdateUserRoleDto) {
    if (targetUserId === currentUserId) {
      throw new ForbiddenException('Vous ne pouvez pas modifier votre propre rôle');
    }

    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: dto.role },
      select: USER_LIST_SELECT,
    });
  }
}