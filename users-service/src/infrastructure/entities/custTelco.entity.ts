import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ICustTelco } from '../../domain/model/custTelco.interface';
import { BaseEntity } from './base.entity';
import { MatchStatus } from '../../domain/enum/matchStatus.enum';
import { IdType } from '../../domain/model/user-device.interface';
import { Gender } from '../../domain/enum/gender.enum';

@Entity()
export class CustTelco extends BaseEntity implements ICustTelco {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, default: IdType.LEAD })
  idType: IdType;

  @Column()
  idValue: string;

  @Column({ nullable: true })
  telcoId: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  givenName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  isBarred: boolean;

  @Column({ nullable: true })
  registrationType: string;

  @Column()
  msisdn: string;

  @Column({ nullable: true })
  msisdnCountryCode: string;

  @Column()
  nationalIdNumber: string;

  @Column({ nullable: true })
  ninComparison: MatchStatus;

  @Column({ nullable: true })
  dob: string;

  @Column({ nullable: true })
  registrationDate: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ default: false })
  isDataSentToLOS: boolean;

  @Column({ nullable: true })
  idExpiry: Date;
}
