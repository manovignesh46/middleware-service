import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OtpAction } from '../../domain/enum/otp-action.enum';
import { IGeneralOtp } from '../../domain/model/general-otp.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class GeneralOtp extends BaseEntity implements IGeneralOtp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column({ nullable: true })
  otpValue: string;

  @Column({ enum: OtpAction })
  otpAction: OtpAction;

  @Column()
  fullMsisdn: string;

  @Column({ type: 'int' })
  failedAttempts: number;

  @Column({ type: 'timestamptz', nullable: true })
  expiredAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  sentAt: Date;

  @Column({ type: 'int', default: 0 })
  otpSentCount: number;

  @Column({ type: 'timestamptz', nullable: true })
  otpSentLockedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  otpVerifiedKey: string; // this is passed to futher endpoints

  @Column({ type: 'timestamptz', nullable: true })
  otpVerifiedKeyExpiredAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lockedAt: Date;
}
