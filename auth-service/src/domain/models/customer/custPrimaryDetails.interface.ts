import { IBase } from '../base.interface';
import { ClientStatus } from './enum/clientStatus.enum';
import { ClientType } from './enum/clientType.enum';
import { Gender } from './enum/gender.enum';

export interface ICustPrimaryDetails extends IBase {
  id: string;
  leadId: string;
  cognitoId: string;
  clientType: ClientType;
  clientStatus: ClientStatus;
  msisdnCountryCode: string;
  msisdn: string;
  nationalIdNumber: string;
  email: string;
  surname: string;
  givenName: string;
  nationality: string;
  gender: Gender;
  dateOfBirth: Date;
  NINOCR: string;
  cardNumber: string;
  dateOfExpiry: Date;
  scannedImageFront: string;
  scannedImageBack: string;
  selfieImage: string;
  faceMatchPercentage: number;
  faceMatchStatus: string;
  liveliessCheckPercenatge: number;
  livelinessCheckStatus: string;
  totalLoans: number;
  creditExpiryTime: string;
}
