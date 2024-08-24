import { DeviceStatus } from '../../enum/deviceStatus.enum';
import { IDevice } from '../device.interface';
import { mockCognitoDetail } from './cognito-details.mock';

export const mockDevice: IDevice = {
  id: '3259bf4b-cecf-4a02-ba6b-615562f0136f',
  deviceId: 'deviceId123',
  isActive: true,
  cognitoDetail: mockCognitoDetail,
  createdAt: new Date('2000-01-01'),
  updatedAt: new Date('2000-01-02'),
  lastActiveSession: new Date('2023-01-01'),
  currentActiveSession: new Date('2023-02-01'),
  deviceName: 'iPhone 20',
  deviceStatus: DeviceStatus.ACTIVE,
  deviceStatusDate: new Date('2023-01-01'),
};
