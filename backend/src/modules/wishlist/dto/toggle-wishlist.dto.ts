import { IsUUID } from 'class-validator';

export class ToggleWishlistDto {
  @IsUUID()
  productId!: string;
}
