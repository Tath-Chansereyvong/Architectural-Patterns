import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ProductService } from '../../modules/product/product.service';
import { CategoryService } from '../../modules/category/category.service';

@Resolver('Product')
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Query('products')
  products() {
    return this.productService.findAll();
  }

  @Query('product')
  product(@Args('id') id: string) {
    // GraphQL ID comes as string; convert if needed
    return this.productService.findOne(id);
  }

  @Query('productsByCategory')
  productsByCategory(@Args('categoryId') categoryId: string) {
    return this.productService.findByCategory(categoryId);
  }
  
  @Mutation('createProduct')
  createProduct(
    @Args('name') name: string,
    @Args('price') price: number,
    @Args('categoryId') categoryId: string,
  ) {
    return this.productService.create({
        name,
        price,
        categoryId,
        sku: ''
    });
  }

  // ✅ relation: Product.category
  @ResolveField('category')
  category(@Parent() product: any) {
    return this.categoryService.findOne(product.categoryId);
  }
}