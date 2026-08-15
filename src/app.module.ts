import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  envValidationSchema,
  appConfig,
  databaseConfig,
  redisConfig,
  authConfig,
  corsConfig,
} from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { RateLimitModule } from './config/rate-limit.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AdminModule } from './modules/admin/admin.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { UsersModule } from './modules/users/users.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AddressesModule } from './modules/addresses/Addresses.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Loads the file matching NODE_ENV first (e.g. .env.production), falls back
      // to .env. This lets Dev/Staging/Prod ship different values without code changes.
      envFilePath: [
        `.env.${process.env.NODE_ENV ?? 'development'}.local`,
        `.env.${process.env.NODE_ENV ?? 'development'}`,
        '.env.local',
        '.env',
      ],
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false, // report every invalid/missing var at once, not just the first
      },
      load: [appConfig, databaseConfig, redisConfig, authConfig, corsConfig],
    }),
    PrismaModule,
     RateLimitModule,
    RedisModule,
    AuthModule,
    CategoriesModule,
    OrdersModule,
    ProductsModule,
    PaymentModule,
    UploadsModule,
    UsersModule,
    WishlistModule,
    CouponsModule,
    NewsletterModule,
    ReviewsModule,
    AddressesModule,
    AdminModule,
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}