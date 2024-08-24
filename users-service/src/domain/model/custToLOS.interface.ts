import { Application } from 'aws-sdk/clients/emr';
import { LeadStatus } from '../enum/leadStatus.enum';
import { IBase } from './base.interface';
import { ApplicationStatus } from '../enum/applicationStatus.enum';

export interface ICustToLOS extends IBase {
  id: string;
  leadId: string;
  leadCurrentStatus: LeadStatus;
  secondaryUUID: string;
  applicationStatus: ApplicationStatus;
  dataToCRM: string;
  respFromCRM: string;
}
