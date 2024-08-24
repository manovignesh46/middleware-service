import { IBase } from '../../../../domain/model/base.interface';
import { ICognitoDetail } from './cognito-detail.interface';
import { DeviceStatus } from './deviceStatus.enum';

export interface IDevice extends IBase {
  id: string;
  deviceId: string;
  isActive: boolean;
  lastActiveSession: Date;
  deviceName: string;
  deviceStatus: DeviceStatus;
  deviceStatusDate: Date;
  cognitoDetail: ICognitoDetail; //Many to One
}
