import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';


@Module({
  imports: [DatabaseModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}