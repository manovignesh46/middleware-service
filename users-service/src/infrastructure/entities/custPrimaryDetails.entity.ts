import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ClientStatus } from '../../domain/enum/clientStatus.enum';
import { ClientType } from '../../domain/enum/clientType.enum';
import { Gender } from '../../domain/enum/gender.enum';
import { IdCardStatus } from '../../domain/enum/id-card-status.enum';
import { ICustPrimaryDetails } from '../../domain/model/custPrimaryDetails.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class CustPrimaryDetails
  extends BaseEntity
  implements ICustPrimaryDetails
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  leadId: string;

  @Column({ nullable: true })
  cognitoId: string;

  @Column({ nullable: true })
  clientType: ClientType;

  @Column()
  clientStatus: ClientStatus;

  @Column()
  msisdnCountryCode: string;

  @Column()
  msisdn: string;

  @Column()
  nationalIdNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ nullable: true })
  givenName: string;

  @Column({ nullable: true })
  preferredName: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  NINOCR: string;

  @Column({ nullable: true })
  cardNumber: string;

  @Column({ nullable: true })
  dateOfExpiry: Date;

  @Column({ nullable: true })
  scannedImageFront: string;

  @Column({ nullable: true })
  scannedImageBack: string;

  @Column({ nullable: true })
  selfieImage: string;

  @Column({ nullable: true })
  faceMatchPercentage: number;

  @Column({ nullable: true })
  faceMatchStatus: string;

  @Column({ nullable: true })
  liveliessCheckPercenatge: number;

  @Column({ nullable: true })
  livelinessCheckStatus: string;

  @Column({ nullable: true })
  totalLoans: number;

  @Column({ nullable: true })
  creditExpiryTime: string;

  @Column({ type: 'int', nullable: true })
  idExpiryDays: number;

  @Column({ enum: IdCardStatus, nullable: true })
  idStatus: IdCardStatus;

  @Column({ nullable: true })
  smsNextHours: number;

  @Column({ nullable: true })
  optOutReason: string;

  @Column({ nullable: true })
  optOutFeedback: string;

  @Column({ nullable: true })
  optOutDate: Date;

  @Column({ nullable: true })
  availableCreditLimit: number;
}
