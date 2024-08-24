import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ICognitoDetail } from '../../domain/models/cognito-detail.interface';
import { IDevice } from '../../domain/models/device.interface';
import { BaseEntity } from './base.entity';
import { Device } from './device.entity';

@Entity()
export class CognitoDetail extends BaseEntity implements ICognitoDetail {
  @PrimaryColumn()
  @ApiProperty()
  customerId: string;

  @Column({ nullable: true })
  @ApiProperty()
  cognitoId: string;

  @Column({ nullable: true })
  @ApiProperty()
  msisdnCountryCode: string;

  @Column({ nullable: true })
  @ApiProperty()
  msisdn: string;

  @Column({ type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'int', default: 0 })
  otpSentCount: number;

  @Column({ type: 'timestamptz', nullable: true })
  loginLockedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  loginUnLockedAt: Date;

  @OneToMany(() => Device, (device) => device.cognitoDetail, {
    cascade: true,
    eager: true,
  })
  @ApiProperty({ type: () => Device })
  devices: IDevice[];
}
