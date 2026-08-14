import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CouponsService } from './coupons.service';

@Module({
  imports: [PrismaModule],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}