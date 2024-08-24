import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IOfferConfig } from '../../domain/model/offerConfig.interface';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class OfferConfig extends BaseEntity implements IOfferConfig {
  @PrimaryColumn()
  @ApiProperty()
  offerId: string;

  @Column()
  @ApiProperty()
  offerName: string;

  @Column()
  @ApiProperty()
  offerDescription: string;

  @Column({ nullable: true })
  @ApiProperty()
  offerImage: string;

  @Column({ nullable: true })
  @ApiProperty()
  offerProvider: string;

  @Column()
  @ApiProperty()
  activeStatus: string;

  @Column()
  @ApiProperty()
  tenure: number;

  @Column()
  @ApiProperty()
  roi: string;

  @Column({ nullable: true })
  @ApiProperty()
  noOfInstallment: string;

  @Column()
  @ApiProperty()
  repaymentFrequency: string;

  @Column({ type: 'decimal', nullable: true })
  @ApiProperty()
  offerLimit: number;

  @Column()
  @ApiProperty()
  applicationFee: string;
}
