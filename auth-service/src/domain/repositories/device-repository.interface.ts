import { IDevice } from '../models/device.interface';

export abstract class IDeviceRepository {
  abstract findByCustomerIdDeviceKeyAndIsActive(
    customerId: string,
    deviceId: string,
  ): Promise<IDevice>;
  abstract findByMsisdnAndIsActive(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<IDevice[]>;
  abstract findDevicesByCustomerIdAndIsActive(
    customerId: string,
  ): Promise<IDevice[]>;
  abstract findDevicesByCustomerId(customerId: string): Promise<IDevice[]>;
  abstract findByDeviceKeyAndIsActive(deviceId: string): Promise<IDevice[]>;
  abstract create(device: IDevice): Promise<IDevice>;
  abstract update(device: IDevice): Promise<IDevice>;
  abstract bulkUpdateOrCreate(devices: IDevice[]): Promise<IDevice[]>;
}
