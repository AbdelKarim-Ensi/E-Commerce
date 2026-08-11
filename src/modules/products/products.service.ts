import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface FindAllProductsParams {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
  isFeatured?: boolean;
  /** Si true, inclut aussi les produits désactivés (usage admin uniquement). */
  includeInactive?: boolean;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calcule le pourcentage de réduction à partir du prix et du prix barré.
   * Retourne null si pas de réduction valide (pas de originalPrice, ou originalPrice <= price).
   */
  private computeDiscountPercent(
    price: number | Prisma.Decimal | null | undefined,
    originalPrice: number | Prisma.Decimal | null | undefined,
  ): number | null {
    if (price === null || price === undefined) return null;
    if (originalPrice === null || originalPrice === undefined) return null;

    const p = Number(price);
    const op = Number(originalPrice);

    if (!Number.isFinite(p) || !Number.isFinite(op) || op <= p) return null;

    return Math.round(((op - p) / op) * 100);
  }

  create(dto: CreateProductDto) {
    const discountPercent = this.computeDiscountPercent(dto.price, dto.originalPrice);
    return this.prisma.product.create({
      data: { ...dto, discountPercent },
    });
  }

  async findAll(params: FindAllProductsParams = {}) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;

    const where: Prisma.ProductWhereInput = {
      ...(params.includeInactive ? {} : { isActive: true }),
      ...(params.categoryId ? { categoryId: params.categoryId } : {}),
      ...(params.isFeatured !== undefined ? { isFeatured: params.isFeatured } : {}),
      ...(params.search
        ? {
            OR: [
              { name: { contains: params.search, mode: 'insensitive' } },
              { description: { contains: params.search, mode: 'insensitive' } },
              { brand: { contains: params.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.findOne(id);

    // On fusionne avec l'existant pour recalculer la remise même si seul
    // l'un des deux champs (price / originalPrice) est modifié dans ce patch.
    const nextPrice = dto.price !== undefined ? dto.price : Number(existing.price);
    const nextOriginalPrice =
      dto.originalPrice !== undefined
        ? dto.originalPrice
        : existing.originalPrice
          ? Number(existing.originalPrice)
          : null;

    const discountPercent = this.computeDiscountPercent(nextPrice, nextOriginalPrice);

    return this.prisma.product.update({
      where: { id },
      data: { ...dto, discountPercent },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async updateImages(id: string, imageUrl: string, thumbnailUrl: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { imageUrl, thumbnailUrl },
    });
  }
}