import { Gender } from '../enum/gender.enum';
import { MatchStatus } from '../enum/matchStatus.enum';
import { IBase } from './base.interface';
import { IdType } from './user-device.interface';

export interface ICustTelco extends IBase {
  id: string;
  idType: IdType;
  idValue: string;
  telcoId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  givenName: string;
  middleName: string;
  isBarred: boolean;
  registrationType: string;
  msisdnCountryCode: string;
  msisdn: string;
  nationalIdNumber: string;
  dob: string;
  registrationDate: string;
  nationality: string;
  ninComparison: MatchStatus;
  isDataSentToLOS: boolean;
  idExpiry: Date;
}
