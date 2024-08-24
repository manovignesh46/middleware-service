import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DeviceStatus } from '../../domain/enum/deviceStatus.enum';
import { mockCognitoDetail } from '../../domain/models/mocks/cognito-details.mock';
import { mockDevice } from '../../domain/models/mocks/device.mock';
import { ICognitoDetailRepository } from '../../domain/repositories/cognito-detail-repository.interface';
import { IDeviceRepository } from '../../domain/repositories/device-repository.interface';
import { mockCognitoDetailRepository } from '../../domain/repositories/mocks/cognito-detail-repository.mock';
import { mockDeviceRepository } from '../../domain/repositories/mocks/device-repository.mock';
import { ICustomerServiceClient } from '../../domain/services/customerClient.interface';
import { GetCustomerFromFullMsisdnPresenter } from '../controllers/auth/customer/get-customer-from-full-msisdn.presenter';
import { Device } from '../entities/device.entity';
import { CustomerServiceClient } from './customerClient.service';
import { DeviceService } from './device.service';
describe('DeviceService', () => {
  let service: DeviceService;
  const msisdnCountryCode = '+65';
  const msisdn = '99999999';
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: ICognitoDetailRepository,
          useValue: mockCognitoDetailRepository,
        },
        {
          provide: IDeviceRepository,
          useValue: mockDeviceRepository,
        },
        {
          provide: ICustomerServiceClient,
          useValue: createMock<CustomerServiceClient>(),
        },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
  });

  describe('checkDeviceMatches', () => {
    it('check all objects', () => {
      new Device();
      new GetCustomerFromFullMsisdnPresenter(); //ToDo migrate to customerClient spec file
    });
    it('should return true if deviceId matches', async () => {
      const correctDeviceId = mockDevice.deviceId;
      const result = await service.checkDeviceMatches(
        msisdnCountryCode,
        msisdn,
        correctDeviceId,
      );
      expect(result).toEqual(true);
    });
    it('should return false if deviceId does not match', async () => {
      const correctDeviceId = 'wrongDeviceId123';
      const result = await service.checkDeviceMatches(
        msisdnCountryCode,
        msisdn,
        correctDeviceId,
      );
      expect(result).toEqual(false);
    });
    it('should return true and store deviceId if no deviceId present but cognitoDetail is present', async () => {
      const correctDeviceId = 'newDeviceId123';
      jest
        .spyOn(mockDeviceRepository, 'findByMsisdnAndIsActive')
        .mockResolvedValueOnce([]);
      const spy = jest.spyOn(mockDeviceRepository, 'create');
      const result = await service.checkDeviceMatches(
        msisdnCountryCode,
        msisdn,
        correctDeviceId,
      );
      expect(result).toEqual(true);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should return true and store deviceId if no deviceId present but cognitoDetail is present and deviceId is previously stored', async () => {
      const correctDeviceId = 'newDeviceId123';
      jest
        .spyOn(mockDeviceRepository, 'findByMsisdnAndIsActive')
        .mockResolvedValueOnce([]);
      jest
        .spyOn(mockCognitoDetailRepository, 'findByCustomerId')
        .mockResolvedValueOnce({
          ...mockCognitoDetail,
          devices: [
            { ...mockDevice, deviceId: correctDeviceId, isActive: false }, //Existing deregistered device w same deviceId
          ],
        });
      const spy = jest.spyOn(mockDeviceRepository, 'update');
      const result = await service.checkDeviceMatches(
        msisdnCountryCode,
        msisdn,
        correctDeviceId,
      );
      expect(result).toEqual(true);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          deviceId: correctDeviceId,
          deviceStatus: 'ACTIVE',
          isActive: true,
        }),
      );
    });
    //topdo
    it('should return true and store deviceId and cognitoDetails if no deviceId or cognitoDetail is present', async () => {
      const correctDeviceId = 'newDeviceId123';
      //No Device
      jest
        .spyOn(mockDeviceRepository, 'findByMsisdnAndIsActive')
        .mockResolvedValueOnce([]);

      //No cognitoDetail
      jest
        .spyOn(mockCognitoDetailRepository, 'findByMsisdn')
        .mockResolvedValueOnce(null);

      const cognitoDetailSpy = jest.spyOn(
        mockCognitoDetailRepository,
        'create',
      );
      const result = await service.checkDeviceMatches(
        msisdnCountryCode,
        msisdn,
        correctDeviceId,
      );
      expect(result).toEqual(true);
      expect(cognitoDetailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateLastDeviceSession', () => {
    const customerId = 'customer123';
    it('should throw error if no devices found', async () => {
      jest
        .spyOn(mockDeviceRepository, 'findDevicesByCustomerIdAndIsActive')
        .mockResolvedValueOnce(null);
      const response = service.updateLastDeviceSession(customerId);
      await expect(response).rejects.toThrowError();
    });
    it('should throw error if no devices found (empty array)', async () => {
      jest
        .spyOn(mockDeviceRepository, 'findDevicesByCustomerIdAndIsActive')
        .mockResolvedValueOnce([]);
      const response = service.updateLastDeviceSession(customerId);
      await expect(response).rejects.toThrowError();
    });
    it('should update lastActiveSession (1 active device)', async () => {
      const spy = jest.spyOn(mockDeviceRepository, 'update');

      const response = await service.updateLastDeviceSession(customerId);
      expect(response).toEqual(true);
      expect(spy).toBeCalledWith(
        expect.objectContaining({ lastActiveSession: expect.any(Date) }),
      );
    });
    it('should update lastActiveSession (1 active device) and deviceId provided', async () => {
      const deviceId = mockDevice.deviceId; //Matches the mockDevice.deviceId
      const spy = jest.spyOn(mockDeviceRepository, 'update');
      const response = await service.updateLastDeviceSession(
        customerId,
        deviceId,
      );
      expect(response).toEqual(true);
      expect(spy).toBeCalledWith(
        expect.objectContaining({ lastActiveSession: expect.any(Date) }),
      );
    });
    it('should update lastActiveSession (2 active device) and deviceId provided', async () => {
      const deviceId = mockDevice.deviceId; //Matches the mockDevice.deviceId
      jest
        .spyOn(mockDeviceRepository, 'findDevicesByCustomerIdAndIsActive')
        .mockResolvedValueOnce([
          mockDevice,
          { ...mockDevice, deviceId: 'deviceIdNumber2' },
        ]);
      const spy = jest.spyOn(mockDeviceRepository, 'update');
      const response = await service.updateLastDeviceSession(
        customerId,
        deviceId,
      );
      expect(response).toEqual(true);
      expect(spy).toBeCalledWith(
        expect.objectContaining({ lastActiveSession: expect.any(Date) }),
      );
    });
    it('should throw error if deviceId does not match DB (1 active device)', async () => {
      const deviceId = 'someDifferentDeviceId123'; // Does not match the mockDevice.deviceId
      const response = service.updateLastDeviceSession(customerId, deviceId);
      await expect(response).rejects.toThrowError();
    });
    it('should throw error if no deviceId provided (2 active device)', async () => {
      jest
        .spyOn(mockDeviceRepository, 'findDevicesByCustomerIdAndIsActive')
        .mockResolvedValueOnce([
          mockDevice,
          { ...mockDevice, deviceId: 'deviceIdNumber2' },
        ]);
      const response = service.updateLastDeviceSession(customerId);
      await expect(response).rejects.toThrowError();
    });
    it('should throw deviceId provided does not match any in DB (2 active device)', async () => {
      const deviceId = 'doesNotMatchAnyInDB';
      jest
        .spyOn(mockDeviceRepository, 'findDevicesByCustomerIdAndIsActive')
        .mockResolvedValueOnce([
          mockDevice,
          { ...mockDevice, deviceId: 'deviceIdNumber2' },
        ]);
      const response = service.updateLastDeviceSession(customerId, deviceId);
      await expect(response).rejects.toThrowError();
    });
  });

  describe('deregisterAndRegisterDevice', () => {
    const customerId = 'customer123';
    const oldDeviceId = 'oldDevice123';
    const newDeviceId = 'newDevice123';
    const newDeviceName = 'newName123';
    it('should throw error if old device not found', async () => {
      jest
        .spyOn(mockDeviceRepository, 'findByCustomerIdDeviceKeyAndIsActive')
        .mockResolvedValueOnce(null);
      const response = service.deregisterAndRegisterDevice(
        customerId,
        oldDeviceId,
        newDeviceId,
        newDeviceName,
      );
      await expect(response).rejects.toThrowError();
    });
    it('should throw error if cognitoDetail not found', async () => {
      jest
        .spyOn(mockCognitoDetailRepository, 'findByCustomerId')
        .mockResolvedValueOnce(null);
      const response = service.deregisterAndRegisterDevice(
        customerId,
        oldDeviceId,
        newDeviceId,
        newDeviceName,
      );
      await expect(response).rejects.toThrowError();
    });
    it('should deactivate old device', async () => {
      jest
        .spyOn(mockDeviceRepository, 'findByCustomerIdDeviceKeyAndIsActive') //search for oldDeviceId linked to customer
        .mockResolvedValueOnce({
          ...mockDevice,
          deviceId: oldDeviceId,
        });

      const spy = jest.spyOn(mockDeviceRepository, 'update');
      await service.deregisterAndRegisterDevice(
        customerId,
        oldDeviceId,
        newDeviceId,
        newDeviceName,
      );
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          isActive: false,
          deviceStatus: DeviceStatus.DEREGISTERED,
          deviceStatusDate: expect.any(Date),
        }),
      );
    });
    it('should reactivate deregistered device if newDevice ID is present in the cognitoDetail devices array', async () => {
      jest
        .spyOn(mockCognitoDetailRepository, 'findByCustomerId')
        .mockResolvedValueOnce({
          ...mockCognitoDetail,
          customerId,
          devices: [{ ...mockDevice, deviceId: newDeviceId, isActive: false }],
        });

      const spy = jest.spyOn(mockDeviceRepository, 'update');
      await service.deregisterAndRegisterDevice(
        customerId,
        oldDeviceId,
        newDeviceId,
        newDeviceName,
      );
      expect(spy).toBeCalledTimes(2); //1st time deregistering oldDevice, 2nd time re-registering new Device
      expect(spy).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          isActive: true,
          deviceStatus: DeviceStatus.ACTIVE,
          deviceStatusDate: expect.any(Date),
        }),
      );
    });
    it('should register new device if device was never previously tagged to customer', async () => {
      const spy = jest.spyOn(mockDeviceRepository, 'create');
      await service.deregisterAndRegisterDevice(
        customerId,
        oldDeviceId,
        newDeviceId,
        newDeviceName,
      );
      expect(spy).toBeCalledTimes(1); //1st time deregistering oldDevice, 2nd time re-registering new Device
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          isActive: true,
          deviceStatus: DeviceStatus.ACTIVE,
          deviceStatusDate: expect.any(Date),
        }),
      );
    });
    it('should deactivate old and new devices tagged to others', async () => {
      jest
        .spyOn(mockDeviceRepository, 'findByDeviceKeyAndIsActive') //search for oldDeviceId linked to customer
        .mockResolvedValueOnce([
          {
            ...mockDevice,
            deviceId: oldDeviceId,
          },
        ])
        .mockResolvedValueOnce([
          {
            ...mockDevice,
            deviceId: newDeviceId,
          },
        ]);

      const spy = jest.spyOn(mockDeviceRepository, 'bulkUpdateOrCreate');
      await service.deregisterAndRegisterDevice(
        customerId,
        oldDeviceId,
        newDeviceId,
        newDeviceName,
      );
      expect(spy).toBeCalledTimes(2);

      //Deregistering old devices
      expect(spy).toHaveBeenNthCalledWith(1, [
        expect.objectContaining({
          deviceId: oldDeviceId,
          isActive: false,
          deviceStatus: DeviceStatus.DEREGISTERED,
          deviceStatusDate: expect.any(Date),
        }),
      ]);

      //Deregistering new devices
      expect(spy).toHaveBeenNthCalledWith(2, [
        expect.objectContaining({
          deviceId: newDeviceId,
          isActive: false,
          deviceStatus: DeviceStatus.DEREGISTERED,
          deviceStatusDate: expect.any(Date),
        }),
      ]);
    });
  });

  describe('listDevices', () => {
    const customerId = 'customer123';
    it('should list devices', async () => {
      const response = await service.listDevices(customerId);
      const expectedResponse =
        await mockDeviceRepository.findDevicesByCustomerId(customerId);
      expect(response).toEqual(expectedResponse);
    });
  });
});
