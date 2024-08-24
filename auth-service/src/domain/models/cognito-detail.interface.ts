import { IBase } from './base.interface';
import { IDevice } from './device.interface';

export interface ICognitoDetail extends IBase {
  customerId: string;
  cognitoId: string;
  msisdnCountryCode: string;
  msisdn: string;
  otpSentCount: number;
  failedLoginAttempts: number;
  loginLockedAt: Date;
  loginUnLockedAt: Date;
  devices: IDevice[]; //oneToMany
}
