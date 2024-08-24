import { IDevice } from '../../models/device.interface';
import { mockCognitoDetail } from '../../models/mocks/cognito-details.mock';
import { mockDevice } from '../../models/mocks/device.mock';
import { IDeviceRepository } from '../device-repository.interface';

export const mockDeviceRepository: IDeviceRepository = {
  findByCustomerIdDeviceKeyAndIsActive: function (
    customerId: string,
    deviceId: string,
  ): Promise<IDevice> {
    return Promise.resolve({ ...mockDevice, deviceId, customerId });
  },
  findByMsisdnAndIsActive: function (
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<IDevice[]> {
    return Promise.resolve([{ ...mockDevice, msisdnCountryCode, msisdn }]);
  },
  findByDeviceKeyAndIsActive: function (deviceId: string): Promise<IDevice[]> {
    return Promise.resolve([{ ...mockDevice, deviceId, isActive: true }]);
  },
  create: function (device: IDevice): Promise<IDevice> {
    return Promise.resolve(device);
  },
  update: function (device: IDevice): Promise<IDevice> {
    return Promise.resolve({ ...mockDevice, ...device });
  },
  findDevicesByCustomerIdAndIsActive: function (
    customerId: string,
    deviceId?: string,
  ): Promise<IDevice[]> {
    if (deviceId) {
      return Promise.resolve([
        {
          ...mockDevice,
          deviceId,
          cognitoDetail: { ...mockCognitoDetail, customerId },
        },
      ]);
    }
    return Promise.resolve([
      { ...mockDevice, cognitoDetail: { ...mockCognitoDetail, customerId } },
    ]);
  },
  bulkUpdateOrCreate: function (devices: IDevice[]) {
    return Promise.resolve(devices);
  },
  findDevicesByCustomerId: function (customerId: string): Promise<IDevice[]> {
    return Promise.resolve([
      {
        ...mockDevice,
        cognitoDetail: { ...mockCognitoDetail, customerId },
      },
    ]);
  },
};
