import { IBase } from './base.interface';

export interface ICustFsRegistration extends IBase {
  custId: string;
  custCountryCode: string;
  custMsisdn: string;
  primaryEmail: string;
  fsRequesterId: number;
  fsIsActive: boolean;
}
