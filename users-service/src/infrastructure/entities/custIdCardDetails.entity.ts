import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from '../../domain/enum/gender.enum';
import { ICustIdCardDetails } from '../../domain/model/custIdCardDetails.interface';
import { BaseEntity } from './base.entity';
import { ThresholdConfigStatus } from '../../domain/enum/thresholdConfigStatus.enum';
import { MatchStatus } from '../../domain/enum/matchStatus.enum';
import { AddressType } from '../../domain/enum/address-type.enum';
import { CountryCodes } from '../../domain/enum/country-code.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CustIdCardDetails
  extends BaseEntity
  implements ICustIdCardDetails
{
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  custId: string;

  @Column({ nullable: true })
  @ApiProperty()
  ocrGivenName: string;

  @Column({ nullable: true })
  @ApiProperty()
  ocrSurname: string;

  @Column({ nullable: true })
  @ApiProperty()
  ocrNIN: string;

  @Column({ nullable: true })
  @ApiProperty()
  ocrNINExpiryDate: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  parsedOcrNINExpiryDate: Date;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  parsedOcrDOB: Date;

  @Column({ nullable: true })
  @ApiProperty()
  ocrDOB: string;

  @Column({ nullable: true })
  @ApiProperty()
  ocrGender: Gender;

  @Column({ nullable: true })
  @ApiProperty()
  ocrNationality: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  ocrDateOfExpiry: Date;

  @Column({ nullable: true })
  @ApiProperty()
  ocrCardNo: string;

  @Column({ nullable: true })
  @ApiProperty()
  ocrSignature: string;

  @Column({ nullable: true })
  @ApiProperty()
  ocrFace: string;

  @Column({ nullable: true })
  @ApiProperty()
  ocrIdFront: string;

  @Column({ nullable: true })
  @ApiProperty()
  ocrIdBack: string;

  @Column({ nullable: true })
  @ApiProperty()
  mrzGivenName: string;

  @Column({ nullable: true })
  @ApiProperty()
  mrzSurname: string;

  @Column({ nullable: true })
  @ApiProperty()
  mrzNIN: string;

  @Column({ nullable: true })
  @ApiProperty()
  mrzNINExpiryDate: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  parsedMrzNINExpiryDate: Date;

  @Column({ nullable: true })
  @ApiProperty()
  rawMrzDOB: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  mrzDOB: Date;

  @Column({ nullable: true })
  @ApiProperty()
  mrzGender: Gender;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  mrzExpirationDate: Date;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  mrzIssuedDate: Date;

  @Column({ nullable: true })
  @ApiProperty()
  mrzCountry: string;

  @Column({ nullable: true })
  @ApiProperty()
  mrzNationality: string;

  @Column({ nullable: true })
  @ApiProperty()
  mrzString: string;

  @Column({ nullable: true })
  @ApiProperty()
  requestLoadJSON: string;

  @Column({ nullable: true })
  @ApiProperty()
  scannedCardImageFront: string;

  @Column({ nullable: true })
  @ApiProperty()
  scannedCardImageBack: string;

  @Column({ nullable: true })
  @ApiProperty()
  faceImage: string;

  @Column({ nullable: true })
  @ApiProperty()
  nonPresignedImageFront: string;

  @Column({ nullable: true })
  @ApiProperty()
  nonPresignedImageBack: string;

  @Column({ nullable: true })
  @ApiProperty()
  nonPresignedFaceImage: string;

  @Column({ nullable: true })
  @ApiProperty()
  editedGivenName: string;

  @Column({ nullable: true })
  @ApiProperty()
  editedSurname: string;

  @Column({ nullable: true })
  @ApiProperty()
  editedNIN: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  editedDOB: Date;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  editedNINExpiryDate: Date;

  @Column({ nullable: true })
  @ApiProperty()
  telcoNINMrzStatus: MatchStatus;

  @Column({ nullable: true })
  @ApiProperty()
  telcoNameMrzStatus: ThresholdConfigStatus;

  @Column({ type: 'float', nullable: true })
  @ApiProperty()
  telcoNameMrzPercent: number;

  @Column({ nullable: true })
  @ApiProperty()
  addressLine1: string;

  @Column({ nullable: true })
  @ApiProperty()
  addressLine2: string;

  @Column({ nullable: true })
  @ApiProperty()
  addressLine3: string;

  @Column({ nullable: true })
  @ApiProperty()
  city: string;

  @Column({ nullable: true })
  @ApiProperty()
  district: string;

  @Column({ enum: CountryCodes, default: CountryCodes.Uganda })
  @ApiProperty()
  countryOfResidence: CountryCodes;

  @Column({ enum: AddressType, default: AddressType.RESIDENTIAL })
  @ApiProperty()
  addressType: AddressType;

  @Column({ nullable: true })
  @ApiProperty()
  givenNameMatchStatus: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  surNameMatchStatus: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  dobMatchStatus: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  ninMatchStatus: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  ninExpiryMatchStatus: boolean;
}
