import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update.address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  findAllForUser(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async findOneForUser(userId: string, id: string) {
    const address = await this.prisma.address.findUnique({ where: { id } });
    // 404 (pas 403) si l'adresse n'appartient pas à l'utilisateur, pour
    // ne pas laisser deviner l'existence d'IDs appartenant à d'autres.
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Adresse introuvable');
    }
    return address;
  }

  async create(userId: string, dto: CreateAddressDto) {
    const existingCount = await this.prisma.address.count({
      where: { userId },
    });
    // La toute première adresse d'un utilisateur devient automatiquement
    // celle par défaut, même si le front n'a pas coché la case.
    const shouldBeDefault = dto.isDefault === true || existingCount === 0;

    if (shouldBeDefault) {
      await this.unsetCurrentDefault(userId);
    }

    return this.prisma.address.create({
      data: { ...dto, userId, isDefault: shouldBeDefault },
    });
  }

  async update(userId: string, id: string, dto: UpdateAddressDto) {
    await this.findOneForUser(userId, id);

    if (dto.isDefault === true) {
      await this.unsetCurrentDefault(userId);
    }

    return this.prisma.address.update({ where: { id }, data: dto });
  }

  async setDefault(userId: string, id: string) {
    await this.findOneForUser(userId, id);
    await this.unsetCurrentDefault(userId);
    return this.prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });
  }

  async remove(userId: string, id: string) {
    const address = await this.findOneForUser(userId, id);
    await this.prisma.address.delete({ where: { id } });

    // Si l'adresse supprimée était celle par défaut, promeut la plus
    // ancienne restante pour qu'il y en ait toujours une par défaut
    // (tant qu'il en reste au moins une).
    if (address.isDefault) {
      const remaining = await this.prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });
      if (remaining) {
        await this.prisma.address.update({
          where: { id: remaining.id },
          data: { isDefault: true },
        });
      }
    }

    return { deleted: true };
  }

  private async unsetCurrentDefault(userId: string) {
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
}
