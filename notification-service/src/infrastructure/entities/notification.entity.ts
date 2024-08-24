import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SourceMicroservice } from '../../domain/model/enum/source-microservice.enum';
import { TargetType } from '../../domain/model/enum/target-type.enum';
import { INotification } from '../../domain/model/notification.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class Notification extends BaseEntity implements INotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  customerId: string;

  @Column({ nullable: true })
  leadId: string;

  @Column()
  target: string;

  @Column({ enum: TargetType })
  targetType: TargetType;

  @Column({ nullable: true })
  messageHeader: string;

  @Column()
  message: string;

  @Column({ type: 'bigint', default: 9 })
  priority: number;

  @Column({ enum: SourceMicroservice })
  sourceMicroservice: SourceMicroservice;

  @Column({ nullable: true })
  response: string;

  @Column({ nullable: true })
  snsMessageId: string;

  @Column({ type: 'timestamptz', nullable: true })
  sentAt: Date;

  //Properties below only applicable for Notifications triggered from LOS/LMS

  @Column({ nullable: true })
  fullMsisdn: string;

  @Column({ nullable: true })
  channel: string;

  @Column({ nullable: true })
  eventName: string;

  @Column({ nullable: true })
  eventDate: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  pushDeliveryStatus: string;

  @Column({ nullable: true })
  pushDeliveredAt: Date;

  @Column({ nullable: true })
  pushViewedStatus: string;

  @Column({ nullable: true })
  pushViewedAt: Date;
}
