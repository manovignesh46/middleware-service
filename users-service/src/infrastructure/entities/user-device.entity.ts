import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import {
  IdType,
  IUserDevice,
  ITopicSubscription,
} from '../../domain/model/user-device.interface';
import { BaseEntity } from './base.entity';

@Entity()
@Unique(['deviceId'])
export class UserDevice extends BaseEntity implements IUserDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  customerOrLeadId: string;

  @Column({ nullable: true, enum: IdType })
  idType: IdType;

  @Column()
  deviceOs: string;

  @Column()
  deviceId: string;

  @Column({ nullable: true })
  firebaseDeviceToken: string;

  @Column({ nullable: true })
  platformApplicationEndpoint: string;

  @OneToMany(
    () => TopicSubscription,
    (topicSubscription) => topicSubscription.userDeviceUUID,
    { cascade: true, eager: true },
  )
  subscribedSnsTopics: ITopicSubscription[];

  @Column({ type: Boolean, default: true })
  isActive: boolean;
}

@Entity()
export class TopicSubscription
  extends BaseEntity
  implements ITopicSubscription
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserDevice, (userDevice) => userDevice.id, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  userDeviceUUID: string;

  @Column()
  topicArn: string;

  @Column()
  subscriptionArn: string;
}
