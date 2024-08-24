import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IRequestOperation } from '../../domain/model/requestOperation.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class RequestOperation extends BaseEntity implements IRequestOperation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  custId: string;

  @Column()
  opName: string;

  @Column()
  opState: string;

  @Column()
  opDate: Date;

  @Column()
  remark: string;
}
