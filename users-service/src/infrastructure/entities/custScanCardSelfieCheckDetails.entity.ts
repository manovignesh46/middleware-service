import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SelfieMatchStatus } from '../../domain/enum/selfieMatchStatus.enum';
import { ICustScanCardSelfieCheckDetails } from '../../domain/model/custScanCardSelfieCheckDetails.interface';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CustScanCardSelfieCheckDetails
  extends BaseEntity
  implements ICustScanCardSelfieCheckDetails
{
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  custId: string;

  @Column({ type: 'float' })
  @ApiProperty()
  faceMatchScore: number;

  @Column({ type: 'float' })
  @ApiProperty()
  livenessScore: number;

  @Column()
  @ApiProperty()
  faceMatchStatus: SelfieMatchStatus;

  @Column()
  @ApiProperty()
  livenessMatchStatus: SelfieMatchStatus;

  @Column({ type: 'float' })
  @ApiProperty()
  faceMatchComparisonResult: number;

  @Column({ type: 'float' })
  @ApiProperty()
  livenessComparisonResult: number;

  @Column()
  @ApiProperty()
  selfieImagePreSignedS3URL: string;

  @Column()
  @ApiProperty()
  livenessVideoPreSignedS3URL: string;

  @Column({ nullable: true })
  @ApiProperty()
  retryCount: string;
}
