import { Module } from '@nestjs/common';
// import { CategoryResolver } from './resolvers/category.resolver';
// import { ProductResolver } from './resolvers/product.resolver';

// ✅ import your existing modules/services
import { CategoryModule } from '../modules/category/category.module';
import { ProductModule } from '../modules/product/product.module';
import { CategoryCodeFirstResolver } from './resolvers/category.codefirst.resolver';
import { ProductCodeFirstResolver } from './resolvers/product.codefirst.resolver';

@Module({
  imports: [
    CategoryModule,
    ProductModule,
  ],
  providers: [
    // CategoryResolver, 
    // ProductResolver, 
    CategoryCodeFirstResolver, 
    ProductCodeFirstResolver],
})
export class AppGraphqlModule {}