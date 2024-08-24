import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IBase } from '../../domain/model/base.interface';

export abstract class BaseEntity implements IBase {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
