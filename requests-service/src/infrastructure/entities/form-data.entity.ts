import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FormType } from '../../domain/enum/form-type.enum';
import { IFormData } from '../../domain/model/form-data.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class FormData extends BaseEntity implements IFormData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  customerId: string;

  @Column({ nullable: true })
  fullMsisdn: string;

  @Column({ nullable: true })
  loanId: string;

  @Column({ nullable: true })
  typeId: string;

  @Column({ nullable: true })
  formData: string;

  @Column({ enum: FormType })
  formType: FormType;

  @Column({ nullable: true })
  formStatus: string;

  @Column({ nullable: true })
  s3Bucket: string;

  @Column({ nullable: true })
  s3DocPath: string;

  @Column({ nullable: true })
  s3PresignedUrl: string;

  @Column({ type: 'timestamptz' })
  s3UrlUpdatedAt: Date;

  @Column({ type: 'int4', default: 1 })
  requestCount: number;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;
}
