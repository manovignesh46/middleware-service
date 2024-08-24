import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ISMSLog } from '../../domain/model/smsLog.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class SMSLog extends BaseEntity implements ISMSLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contentName: string;

  @Column()
  phoneNumber: string;

  @Column()
  smsContent: string;

  @Column()
  smsType: string;

  constructor(
    contentName: string,
    phoneNumber: string,
    smsContent: string,
    smsType: string,
  ) {
    super();
    this.contentName = contentName;
    this.phoneNumber = phoneNumber;
    this.smsContent = smsContent;
    this.smsType = smsType;
  }
}
