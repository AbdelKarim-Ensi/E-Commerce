import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  getWishlist(@CurrentUser('userId') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @Post(':productId')
  addToWishlist(
    @CurrentUser('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.addToWishlist(userId, productId);
  }

  @Post(':productId/toggle')
  toggleWishlist(
    @CurrentUser('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.toggleWishlist(userId, productId);
  }

  @Delete(':productId')
  removeFromWishlist(
    @CurrentUser('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeFromWishlist(userId, productId);
  }
}