import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPO')
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(data: CreateProductDto) {
    const p = this.productRepo.create(data as Partial<Product>);
    return this.productRepo.save(p);
  }

  async findAll() {
    return this.productRepo.find({ relations: ['category'] });
  }

  async findOne(id: string) {
    const p = await this.productRepo.findOne({ where: { id }, relations: ['category'] });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async update(id: string, data: Partial<Product>) {
    const product = await this.findOne(id);
    Object.assign(product, data);
    return this.productRepo.save(product);
  }

  async remove(id: string) {
    const res = await this.productRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Product not found');
    return { deleted: true };
  }
}