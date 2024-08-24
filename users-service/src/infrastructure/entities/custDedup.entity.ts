import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DedupStatus } from '../../domain/enum/dedupStatus.enum';
import { ICustDedup } from '../../domain/model/custDedup.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class CustDedup extends BaseEntity implements ICustDedup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  leadId: string;

  @Column()
  dedupRefNumber: string;

  @Column()
  dedupStatus: DedupStatus;

  @Column({ nullable: true })
  msisdnCountryCode: string;

  @Column({ nullable: true })
  msisdn: string;

  @Column({ nullable: true })
  nationalIdNumber: string;

  @Column({ nullable: true })
  email: string;

  constructor(
    leadId: string,
    dedupRefNumber: string,
    dedupStatus: DedupStatus,
    msisdnCountryCode: string,
    msisdn: string,
    nationalIdNumber: string,
    email: string,
  ) {
    super();
    this.leadId = leadId;
    this.dedupRefNumber = dedupRefNumber;
    this.dedupStatus = dedupStatus;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.msisdnCountryCode = msisdnCountryCode;
    this.msisdn = msisdn;
    this.nationalIdNumber = nationalIdNumber;
    this.email = email;
  }
}
