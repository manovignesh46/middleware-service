import { TicketType } from '../enum/ticketType.enum';
import { IBase } from './base.interface';

export interface ICustTicketDetails extends IBase {
  submittedId: string;
  custId: string;
  custCountryCode: string;
  custMsisdn: string;
  tktType: TicketType;
  tktSubject: string;
  tktDescription: string;
  tktCategory: string;
  tktSubCategory: string;
  hasAttachments: boolean;
  attachmentsCount: number;
  attachmentsFilenames: string;
  isSentToFs: boolean;
  sentToFsAt: Date;
  respHttpStatusCode: number;
  respErrorBody: string;
  tktRequesterId: number;
  tktRequestedForId: number;
  ticketId: number;
  tktAttachmentsDetails: string;
  tktStatus: string;
  tktCreatedAt: Date;
  tktUpdatedAt: Date;
}
