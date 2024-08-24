import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ExperianRequestType } from '../../domain/enum/experian-request-type.enum';
import { IdType } from '../../domain/enum/id-type.enum';
import { IExperianData } from '../../domain/model/experian-data.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class ExperianData extends BaseEntity implements IExperianData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: IdType })
  idType: IdType;

  @Column()
  idValue: string;

  @Column()
  requestBody: string;

  @Column()
  clientReferenceNumber: string;

  @Column({ enum: ExperianRequestType })
  requestType: ExperianRequestType;

  @Column({ nullable: true })
  responseStatusCode: string;

  @Column({ nullable: true })
  experianData: string;

  @Column({ default: false })
  isDataSentToLOS: boolean;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'bigint', nullable: true })
  latency: number;
}
