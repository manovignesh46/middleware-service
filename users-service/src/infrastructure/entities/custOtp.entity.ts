import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LeadStatus } from '../../domain/enum/leadStatus.enum';
import { OtpType } from '../../domain/enum/otpType.enum';
import { ICustOtp } from '../../domain/model/custOtp.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class CustOtp extends BaseEntity implements ICustOtp {
  @PrimaryGeneratedColumn('uuid')
  leadId: string;

  @Column()
  msisdn: string;

  @Column()
  msisdnCountryCode: string;

  @Column()
  preferredName: string;

  @Column()
  nationalIdNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ type: 'timestamptz', nullable: true })
  otpCreatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  otpSentAt: Date;

  @Column({ type: 'enum', enum: OtpType, nullable: true })
  otpType: OtpType;

  @Column({ type: Boolean, nullable: true })
  phoneStatus: boolean;

  @Column({ type: Boolean, nullable: true })
  emailStatus: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  otpExpiry: Date;

  @Column({ type: Number, default: 0 })
  failedAttempts: number; //Tracks number of OTP verify failed since last lead 'login'

  @Column({ type: 'timestamptz', nullable: true })
  lockedAt: Date;

  @Column({ type: Number, default: 0 })
  otpSentCount: number; //Tracks number of OTP triggered since last lead 'login'

  @Column({ type: 'timestamptz', nullable: true })
  otpSentLockedAt: Date;

  @Column({ type: 'enum', enum: LeadStatus })
  leadCurrentStatus: LeadStatus;

  @Column({ nullable: true })
  targetApiUUID: string;

  @Column({ nullable: true })
  outcomeApiUUID: string;

  @Column({ default: false })
  isTerminated: boolean;

  @Column({ nullable: true })
  terminationReason: string;

  @Column({ nullable: true })
  whitelisted: string;

  @Column({ nullable: true })
  whitelistedJSON: string;

  @Column({ nullable: true })
  telcoOp: string;

  @Column({ nullable: true })
  telcoUssdCode: string;

  @Column({ nullable: true })
  telcoWallet: string;

  @Column({ nullable: true })
  smsNextHours: number;

  @Column({ nullable: true })
  mtnOptInReqId: string;

  @Column({ nullable: true })
  mtnApprovalId: string;

  @Column({ nullable: true })
  mtnValidationStatus: string;

  @Column({ nullable: true, length: 50 })
  whitelistCriteria: string;
}
