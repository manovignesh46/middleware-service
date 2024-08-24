import { IBase } from './base.interface';

export interface ISMSLog extends IBase {
  id: string;
  contentName: string;
  phoneNumber: string;
  smsContent: string;
  smsType: string;
}
