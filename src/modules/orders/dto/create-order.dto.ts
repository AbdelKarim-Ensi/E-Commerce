import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  IsString,
  IsOptional,
  MinLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsString()
  @MinLength(5)
  shippingAddress!: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}