import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findFirst({
      where: { OR: [{ name: dto.name }, { slug: dto.slug }] },
    });
    if (existing) {
      throw new ConflictException('Category with this name or slug already exists');
    }
    return this.prisma.category.create({ data: dto });
  }

  findAll() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    if (dto.name || dto.slug) {
      const conflict = await this.prisma.category.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(dto.name ? [{ name: dto.name }] : []),
            ...(dto.slug ? [{ slug: dto.slug }] : []),
          ],
        },
      });
      if (conflict) {
        throw new ConflictException('Category with this name or slug already exists');
      }
    }

    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    // Product.categoryId n'est pas nullable et il n'y a pas de cascade en
    // base : sans ce check, Prisma renverrait une erreur FK brute (500).
    if (category.products.length > 0) {
      throw new ConflictException(
        `Impossible de supprimer cette catégorie : ${category.products.length} produit(s) y sont encore rattachés.`,
      );
    }

    return this.prisma.category.delete({ where: { id } });
  }
}