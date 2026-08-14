import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    return items.map((item) => item.product);
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    return this.prisma.wishlistItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId },
    });
  }

  async removeFromWishlist(userId: string, productId: string) {
    await this.prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });
    return { removed: true };
  }

  async toggleWishlist(userId: string, productId: string) {
    const existing = await this.prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      await this.prisma.wishlistItem.delete({ where: { id: existing.id } });
      return { inWishlist: false };
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    await this.prisma.wishlistItem.create({ data: { userId, productId } });
    return { inWishlist: true };
  }
}