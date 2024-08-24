import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TicketType } from '../../domain/enum/ticketType.enum';
import { ICustTicketDetails } from '../../domain/model/custTicketDetails.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class CustTicketDetails
  extends BaseEntity
  implements ICustTicketDetails
{
  @PrimaryGeneratedColumn('uuid')
  submittedId: string;

  @Column()
  custId: string;

  @Column()
  custCountryCode: string;

  @Column()
  custMsisdn: string;

  @Column()
  tktType: TicketType;

  @Column({ type: 'text' })
  tktSubject: string;

  @Column({ type: 'text' })
  tktDescription: string;

  @Column({ type: 'text' })
  tktCategory: string;

  @Column({ type: 'text' })
  tktSubCategory: string;

  @Column()
  hasAttachments: boolean;

  @Column()
  attachmentsCount: number;

  @Column()
  attachmentsFilenames: string;

  @Column()
  isSentToFs: boolean;

  @Column()
  sentToFsAt: Date;

  @Column()
  respHttpStatusCode: number;

  @Column({ type: 'text' })
  respErrorBody: string;

  @Column({ type: 'bigint' })
  tktRequesterId: number;

  @Column({ type: 'bigint' })
  tktRequestedForId: number;

  @Column()
  ticketId: number;

  @Column()
  tktAttachmentsDetails: string;

  @Column()
  tktStatus: string;

  @Column()
  tktCreatedAt: Date;

  @Column()
  tktUpdatedAt: Date;
}
