import { DeviceStatus } from '../enum/deviceStatus.enum';
import { IBase } from './base.interface';
import { ICognitoDetail } from './cognito-detail.interface';

export interface IDevice extends IBase {
  id: string;
  deviceId: string;
  isActive: boolean;
  lastActiveSession: Date;
  currentActiveSession: Date;
  deviceName: string;
  deviceStatus: DeviceStatus;
  deviceStatusDate: Date;
  cognitoDetail: ICognitoDetail; //Many to One
}
