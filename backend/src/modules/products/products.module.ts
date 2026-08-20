import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports:[UploadsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
