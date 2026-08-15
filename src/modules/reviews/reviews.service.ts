import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where: { productId } }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(userId: string, productId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    const existing = await this.prisma.review.findUnique({
      where: { productId_userId: { productId, userId } },
    });
    if (existing) {
      throw new ConflictException('Vous avez déjà laissé un avis pour ce produit');
    }

    // Achat vérifié : l'utilisateur a-t-il une commande PAID/SHIPPED/DELIVERED
    // contenant ce produit ?
    const purchase = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
        },
      },
    });

    const review = await this.prisma.review.create({
      data: {
        productId,
        userId,
        rating: dto.rating,
        comment: dto.comment,
        verified: !!purchase,
      },
    });

    await this.recomputeProductRating(productId);

    return review;
  }

  async remove(userId: string, userRole: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) {
      throw new NotFoundException('Avis introuvable');
    }

    if (review.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException("Vous ne pouvez pas supprimer l'avis d'un autre utilisateur");
    }

    await this.prisma.review.delete({ where: { id: reviewId } });
    await this.recomputeProductRating(review.productId);

    return { deleted: true };
  }

  /**
   * Liste paginée de TOUS les avis (toutes produits confondus), pour la
   * page de modération admin. Inclut les infos produit + utilisateur
   * nécessaires à l'affichage du tableau.
   */
  async findAllForAdmin(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          product: {
            select: { name: true, slug: true, thumbnailUrl: true, imageUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Produits les mieux notés (au moins 1 avis), triés par note décroissante.
   * Les produits sans avis (reviewsCount null/0) sont exclus — un rating
   * null ne peut pas être classé.
   */
  async getTopRatedProducts(limit = 5) {
    return this.prisma.product.findMany({
      where: { reviewsCount: { gt: 0 } },
      orderBy: { rating: 'desc' },
      take: limit,
    });
  }

  /**
   * Produits les moins bien notés (au moins 1 avis), triés par note
   * croissante — pour repérer les produits à surveiller.
   */
  async getLowRatedProducts(limit = 5) {
    return this.prisma.product.findMany({
      where: { reviewsCount: { gt: 0 } },
      orderBy: { rating: 'asc' },
      take: limit,
    });
  }

  private async recomputeProductRating(productId: string) {
    const aggregate = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: aggregate._avg.rating ?? null,
        reviewsCount: aggregate._count.rating,
      },
    });
  }
}