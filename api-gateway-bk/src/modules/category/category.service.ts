import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPO')
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(data: Partial<Category>) {
    const entity = this.categoryRepo.create(data as any);
    return this.categoryRepo.save(entity);
  }

  async findAll() {
    return this.categoryRepo.find();
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } as any });
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  async update(id: string, data: Partial<Category>) {
    const category = await this.findOne(id);
    Object.assign(category, data);
    return this.categoryRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
    return { deleted: true };
  }
}