import { IsString, IsOptional, MinLength } from 'class-validator';

export class BroadcastNewsletterDto {
  @IsString()
  @MinLength(3)
  subject!: string;

  @IsString()
  @MinLength(10)
  message!: string;

  @IsOptional()
  @IsString()
  ctaLink?: string;

  @IsOptional()
  @IsString()
  ctaText?: string;
}