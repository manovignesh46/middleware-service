import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IContent } from '../../domain/model/content.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class Content extends BaseEntity implements IContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contentName: string;

  @Column()
  contentType: string;

  @Column({ nullable: true })
  messageHeader: string;

  @Column()
  message: string;

  @Column()
  messageType: string;
}
