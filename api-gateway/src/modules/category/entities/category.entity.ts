import { Product } from 'src/modules/product/entities/product.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// TODO: import Product entity later

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // TODO: add OneToMany relation to Product
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}