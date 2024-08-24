import { IDevice } from '../../../services/auth-service-client/dtos/device.interface';

export class DevicePresenter {
  constructor(device: IDevice) {
    this.deviceName = device.deviceName;
    this.deviceId = device.deviceId;
    this.lastActiveSession = device.lastActiveSession;
    this.isActive = device.isActive;
  }
  deviceName: string;
  deviceId: string;
  lastActiveSession: Date;
  isActive: boolean;
}
