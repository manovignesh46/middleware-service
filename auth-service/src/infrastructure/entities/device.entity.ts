import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeviceStatus } from '../../domain/enum/deviceStatus.enum';
import { ICognitoDetail } from '../../domain/models/cognito-detail.interface';
import { IDevice } from '../../domain/models/device.interface';
import { BaseEntity } from './base.entity';
import { CognitoDetail } from './cognito-detail.entity';

@Entity()
export class Device extends BaseEntity implements IDevice {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  deviceId: string;

  @Column({ default: false })
  @ApiProperty()
  isActive: boolean;

  @Column({ default: DeviceStatus.ACTIVE, enum: DeviceStatus })
  @ApiProperty()
  deviceStatus: DeviceStatus;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty()
  deviceStatusDate: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  @ApiProperty()
  lastActiveSession: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  @ApiProperty()
  currentActiveSession: Date;

  @Column({ nullable: true })
  @ApiProperty()
  deviceName: string;

  @ManyToOne(() => CognitoDetail, (cognitoDetail) => cognitoDetail.devices, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn() //To search for device using cognitoDetail.customerId
  @ApiProperty({ type: CognitoDetail })
  cognitoDetail: ICognitoDetail;
}
