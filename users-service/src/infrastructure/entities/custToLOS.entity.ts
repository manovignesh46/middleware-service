import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LeadStatus } from '../../domain/enum/leadStatus.enum';
import { ICustToLOS } from '../../domain/model/custToLOS.interface';
import { BaseEntity } from './base.entity';
import { ApplicationStatus } from '../../domain/enum/applicationStatus.enum';

@Entity()
export class CustToLOS extends BaseEntity implements ICustToLOS {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  leadId: string;

  @Column({ nullable: true })
  leadCurrentStatus: LeadStatus;

  @Column()
  dataToCRM: string;

  @Column({ nullable: true })
  respFromCRM: string;

  @Column({ nullable: true })
  applicationStatus: ApplicationStatus;

  @Column({ nullable: true })
  secondaryUUID: string;

  constructor(
    leadId: string,
    leadCurrentStatus: LeadStatus,
    applicationStatus: ApplicationStatus,
    secondaryUUID: string,
    dataToCrm: string,
  ) {
    super();
    this.leadId = leadId;
    this.leadCurrentStatus = leadCurrentStatus;
    this.applicationStatus = applicationStatus;
    this.secondaryUUID = secondaryUUID;
    this.dataToCRM = dataToCrm;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
