import { IdType, IUserDevice } from '../model/user-device.interface';

export abstract class IUserDeviceRepository {
  abstract createUserDevice(userDevice: IUserDevice): Promise<IUserDevice>;
  abstract updateUserDevice(userDevice: IUserDevice): Promise<IUserDevice>;
  abstract findByDeviceIdAndIsActive(deviceId: string): Promise<IUserDevice>;
  abstract findByCustomerIdAndIsActive(
    customerId: string,
  ): Promise<IUserDevice>;
  abstract findByLeadIdAndIsActive(leadId: string): Promise<IUserDevice>;
  abstract findAllByIdTypeAndValue(
    idType: IdType,
    idValue: string,
  ): Promise<IUserDevice[]>;
  abstract findBySnsEndpoint(snsEndpoint: string): Promise<IUserDevice[]>;
  abstract findByUpdatedAtBeforeDate(date: Date): Promise<IUserDevice[]>;
  abstract deleteUserDevice(userDevice: IUserDevice): Promise<IUserDevice>;
  abstract findByDeviceId(deviceId: string): Promise<IUserDevice>;
}
