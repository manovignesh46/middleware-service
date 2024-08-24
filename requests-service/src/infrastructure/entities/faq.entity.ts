import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IFAQ } from '../../domain/model/faq.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class FAQ extends BaseEntity implements IFAQ {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category: string;

  @Column()
  faq: string;

  @Column()
  faqAns: string;

  @Column()
  isActive: boolean;

  @Column()
  createdBy: string;

  @Column()
  updatedBy: string;
}
