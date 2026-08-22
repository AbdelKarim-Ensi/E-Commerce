import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsPositive,
  IsArray,
  IsObject,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  slug!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price!: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  categoryId!: string;

  @IsObject()
  @IsOptional()
  specDetails?: Record<string, string>;

  @IsArray()
  @IsOptional()
  colors?: { name: string; hex: string }[];
}
