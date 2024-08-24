import { mockUserDevice } from '../../../domain/model/mocks/user-device.mock';
import {
  IdType,
  IUserDevice,
} from '../../../domain/model/user-device.interface';
import { IUserDeviceRepository } from '../../../domain/repository/user-device-repository.interface';

export const mockUserDeviceRepository: IUserDeviceRepository = {
  createUserDevice: function (userDevice: IUserDevice): Promise<IUserDevice> {
    return Promise.resolve({ ...mockUserDevice, ...userDevice });
  },
  updateUserDevice: function (userDevice: IUserDevice): Promise<IUserDevice> {
    return Promise.resolve({ ...mockUserDevice, ...userDevice });
  },
  findByDeviceIdAndIsActive: function (deviceId: string): Promise<IUserDevice> {
    return Promise.resolve({ ...mockUserDevice, deviceId });
  },
  findByCustomerIdAndIsActive: function (
    customerId: string,
  ): Promise<IUserDevice> {
    return Promise.resolve({ ...mockUserDevice, customerId });
  },
  findByLeadIdAndIsActive: function (leadId: string): Promise<IUserDevice> {
    return Promise.resolve({ ...mockUserDevice, leadId });
  },
  findBySnsEndpoint: function (snsEndpoint: string): Promise<IUserDevice[]> {
    return Promise.resolve([{ ...mockUserDevice, snsEndpoint }]);
  },
  findByUpdatedAtBeforeDate: function (date: Date): Promise<IUserDevice[]> {
    //change date to 1 month before
    date.setMonth(date.getMonth() - 1);
    return Promise.resolve([{ ...mockUserDevice, updatedAt: date }]);
  },
  deleteUserDevice: function (userDevice: IUserDevice): Promise<IUserDevice> {
    return Promise.resolve(userDevice);
  },
  findAllByIdTypeAndValue: function (
    idType: IdType,
    idValue: string,
  ): Promise<IUserDevice[]> {
    return Promise.resolve([
      {
        ...mockUserDevice,
        idType,
        customerOrLeadId: idValue,
      },
    ]);
  },
  findByDeviceId: function (deviceId: string): Promise<IUserDevice> {
    return Promise.resolve({ ...mockUserDevice, deviceId });
  },
};
