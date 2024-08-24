import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MatchStatus } from '../../domain/enum/matchStatus.enum';
import { ICustRefinitiv } from '../../domain/model/custRefinitiv.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class CustRefinitiv extends BaseEntity implements ICustRefinitiv {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  idType: string;

  @Column()
  idValue: string;

  @Column({ nullable: true })
  caseId: string;

  @Column({ nullable: true })
  caseSystemId: string;

  @Column({ nullable: true })
  lastScreenedDatesByProviderType: string;

  @Column({ nullable: true })
  resultsCount: number;

  @Column({ nullable: true })
  resultIdReferenceId: string;

  @Column({ nullable: true })
  recieveedResponse: string;

  @Column({ nullable: true })
  matchedResultElement: string;

  @Column({ nullable: true })
  isDataSentToLOS: boolean;

  @Column({ nullable: true })
  isActive: boolean;

  @Column()
  sanctionStatus: MatchStatus;

  @Column({ nullable: true })
  resolutionDone: string;

  @Column({ nullable: true })
  resolutionSentDate: Date;

  @Column({ nullable: true })
  resolutionStatus: string;
}
