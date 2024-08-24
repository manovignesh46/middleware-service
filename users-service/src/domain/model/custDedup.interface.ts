import { DedupStatus } from '../enum/dedupStatus.enum';
import { IBase } from './base.interface';

export interface ICustDedup extends IBase {
  id: string;
  leadId: string;
  dedupRefNumber: string;
  dedupStatus: DedupStatus;
  msisdn: string;
  nationalIdNumber: string;
  email: string;
}
