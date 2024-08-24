import { IBase } from '../../../../domain/model/base.interface';
import { IDevice } from './device.interface';

export interface ICognitoDetail extends IBase {
  customerId: string;
  cognitoId: string;
  msisdnCountryCode: string;
  msisdn: string;
  devices: IDevice[]; //oneToMany
}
