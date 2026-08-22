import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller()
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  // Public — n'importe qui peut consulter les avis d'un produit
  @Get('products/:productId/reviews')
  findByProduct(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findByProduct(
      productId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  // Authentifié — laisser un avis sur un produit
  @UseGuards(JwtAuthGuard)
  @Post('products/:productId/reviews')
  create(
    @CurrentUser('userId') userId: string,
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(userId, productId, dto);
  }

  // Authentifié — supprimer son propre avis (ou n'importe lequel si ADMIN)
  @UseGuards(JwtAuthGuard)
  @Delete('reviews/:id')
  remove(
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: string,
    @Param('id') id: string,
  ) {
    return this.reviewsService.remove(userId, role, id);
  }

  // Admin — liste paginée de tous les avis, pour modération
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STOCK_MANAGER')
  @Get('admin/reviews')
  findAllForAdmin(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findAllForAdmin(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  // Admin — produits les mieux notés (dashboard)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STOCK_MANAGER')
  @Get('admin/products/top-rated')
  getTopRatedProducts(@Query('limit') limit?: string) {
    return this.reviewsService.getTopRatedProducts(
      limit ? parseInt(limit, 10) : 5,
    );
  }

  // Admin — produits les moins bien notés (dashboard)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STOCK_MANAGER')
  @Get('admin/products/low-rated')
  getLowRatedProducts(@Query('limit') limit?: string) {
    return this.reviewsService.getLowRatedProducts(
      limit ? parseInt(limit, 10) : 5,
    );
  }
}
