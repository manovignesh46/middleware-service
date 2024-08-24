import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IBase } from '../../domain/models/base.interface';

export abstract class BaseEntity implements IBase {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
