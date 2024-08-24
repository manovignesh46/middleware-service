import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationStatus } from '../../domain/enum/application-status.enum';
import { IRequestToLOS } from '../../domain/model/request-to-los.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class RequestToLOS extends BaseEntity implements IRequestToLOS {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column({ nullable: true })
  secondaryUUID: string;

  @Column()
  applicationStatus: ApplicationStatus;

  @Column({ nullable: true })
  dataToCRM: string;

  @Column({ nullable: true })
  respFromCRM: string;
}
