import { Injectable, Logger } from '@nestjs/common';
import { DeviceStatus } from '../../domain/enum/deviceStatus.enum';
import { ICognitoDetail } from '../../domain/models/cognito-detail.interface';
import { IDevice } from '../../domain/models/device.interface';
import { ICognitoDetailRepository } from '../../domain/repositories/cognito-detail-repository.interface';
import { IDeviceRepository } from '../../domain/repositories/device-repository.interface';
import { ICustomerServiceClient } from '../../domain/services/customerClient.interface';
import { GetCustomerFromFullMsisdnPresenter } from '../controllers/auth/customer/get-customer-from-full-msisdn.presenter';
import { ErrorMessage } from '../controllers/common/errors/enums/errorMessage.enum';

@Injectable()
export class DeviceService {
  constructor(
    private deviceRepository: IDeviceRepository,
    private cognitoDetailRepository: ICognitoDetailRepository,
    private customerServiceClient: ICustomerServiceClient,
  ) {}
  logger = new Logger(DeviceService.name);
  async checkDeviceAlreadyBound(deviceId: string) {
    const existingDevices =
      await this.deviceRepository.findByDeviceKeyAndIsActive(deviceId);
    this.logger.log(existingDevices);
    return existingDevices?.length > 0;
  }
  async checkDeviceMatches(
    msisdnCountryCode: string,
    msisdn: string,
    deviceId: string,
  ) {
    const existingDevices = await this.deviceRepository.findByMsisdnAndIsActive(
      msisdnCountryCode,
      msisdn,
    );

    //Internal Error - There is more than one Active Device Tagged To Customer
    if (existingDevices.length > 1) {
      this.logger.error(
        `There is more than one active device for ${
          msisdnCountryCode + msisdn
        }`,
      );
    }

    //Device exists and deviceId Mismatch
    if (existingDevices && existingDevices[0]) {
      const isDeviceIdMatch = existingDevices[0].deviceId === deviceId;
      this.logger.debug(`Current Device Id: ${existingDevices[0].deviceId}`);
      this.logger.debug(`Incoming Device Id: ${deviceId}`);
      this.logger.debug(`isDeviceIdMatch ${isDeviceIdMatch}`);
      return isDeviceIdMatch;
    }

    //No Device Bound
    if (!existingDevices || existingDevices?.length === 0) {
      this.logger.debug(`No Existing Devices Found for User`);
      const existingCongitoDetail =
        await this.cognitoDetailRepository.findByMsisdn(
          msisdnCountryCode,
          msisdn,
        );

      //No cognitoDetail or Device
      if (!existingCongitoDetail) {
        this.logger.debug(`No Existing Cognito Details Found`);
        const newDevice: IDevice = {
          deviceId: deviceId,
          isActive: true,
        } as IDevice;

        const fullMsisdn = msisdnCountryCode + msisdn;

        const customer: GetCustomerFromFullMsisdnPresenter =
          await this.customerServiceClient.getCustomerFromFullMsisdn(
            fullMsisdn,
          );

        const newCognitoDetail: ICognitoDetail = {
          customerId: customer?.customerId,
          cognitoId: customer?.cognitoId,
          msisdnCountryCode: msisdnCountryCode,
          msisdn: msisdn,
          devices: [newDevice],
        } as ICognitoDetail;

        //Create New cognitoDetail and Device
        await this.cognitoDetailRepository.create(newCognitoDetail);
      } else {
        await this.deregisterAndRegisterDevice(
          existingCongitoDetail.customerId,
          null,
          deviceId,
          'My Device',
        );
      }
    }

    //Code reaching here means the device / cognitoDetails were newly added
    return true;
  }

  async updateLastDeviceSession(customerId: string, deviceId?: string) {
    const devices: IDevice[] =
      await this.deviceRepository.findDevicesByCustomerIdAndIsActive(
        customerId,
      );

    if (!devices) {
      this.logger.error('There are no active devices for that customer');
      throw new Error('There are no active devices for that customer');
    }
    if (devices.length === 0) {
      this.logger.error('There are no active devices for that customer');
      throw new Error('There are no active devices for that customer');
    } else if (devices.length === 1) {
      if (deviceId && deviceId !== devices[0].deviceId) {
        throw new Error('Device ID does not match the device to be updated');
      }
      devices[0].lastActiveSession = devices[0].currentActiveSession;
      devices[0].currentActiveSession = new Date();
      await this.deviceRepository.update(devices[0]);
      return true;
    } else if (devices.length > 1) {
      // more than 1 active device linked to customer
      this.logger.debug(devices.length);
      this.logger.debug(devices);
      if (!deviceId) {
        this.logger.error(
          'No Device ID for customer with more than one active device',
        );
        throw new Error(
          'No Device ID for customer with more than one active device',
        );
      }
      let updatedOneDevice = false;
      for (const device of devices) {
        if (device.deviceId === deviceId) {
          updatedOneDevice = true;
          device.lastActiveSession = device.currentActiveSession;
          device.currentActiveSession = new Date();
          await this.deviceRepository.update(device);
        }

        //If no devices in the DB were updated
        if (!updatedOneDevice) {
          this.logger.error('No devices were updated');
          throw new Error('No devices were updated');
        }
      }
      return true;
    }
  }

  async deregisterAndRegisterDevice(
    customerId: string,
    oldDeviceId: string,
    newDeviceId: string,
    newDeviceName: string,
  ) {
    this.logger.log(this.deregisterAndRegisterDevice.name);
    // If user does not need to deregister an old device, this may be null / ''
    if (oldDeviceId && oldDeviceId !== '') {
      this.logger.log(`De-registering device: ${oldDeviceId}`);
      const customersOldDevice =
        await this.deviceRepository.findByCustomerIdDeviceKeyAndIsActive(
          customerId,
          oldDeviceId,
        );

      if (!customersOldDevice) {
        throw new Error(ErrorMessage.NO_OLD_DEVICE);
      }

      await this.deviceRepository.update({
        ...customersOldDevice,
        isActive: false,
        deviceStatus: DeviceStatus.DEREGISTERED,
        deviceStatusDate: new Date(),
        lastActiveSession: customersOldDevice.currentActiveSession,
        currentActiveSession: null,
      });

      // Just in case DB has other Device with oldDeviceId
      const oldDevices = await this.deviceRepository.findByDeviceKeyAndIsActive(
        oldDeviceId,
      );

      if (oldDevices?.length > 0) {
        //remove all existing devices with old deviceId
        const deactivatedOldDevices = oldDevices.map((oldDevice) => {
          return {
            ...oldDevice,
            isActive: false,
            deviceStatus: DeviceStatus.DEREGISTERED,
            deviceStatusDate: new Date(),
            lastActiveSession: customersOldDevice.currentActiveSession,
            currentActiveSession: null,
          };
        });
        await this.deviceRepository.bulkUpdateOrCreate(deactivatedOldDevices);
      }
    }

    // If newDeviceId and oldDeviceId passed were the same, then skip as deviceIds already de-registered
    if (newDeviceId !== oldDeviceId) {
      const newDevices = await this.deviceRepository.findByDeviceKeyAndIsActive(
        newDeviceId,
      );

      if (newDevices?.length > 0) {
        this.logger.log(`De-registering new device: ${newDeviceId}`);
        //remove all existing devices with new deviceId
        const deactivedNewDevices = newDevices.map((newDevice) => {
          return {
            ...newDevice,
            isActive: false,
            deviceStatus: DeviceStatus.DEREGISTERED,
            deviceStatusDate: new Date(),
            lastActiveSession: newDevice.currentActiveSession,
            currentActiveSession: null,
          };
        });
        await this.deviceRepository.bulkUpdateOrCreate(deactivedNewDevices);
      }
    }
    const existingCognitoDetail =
      await this.cognitoDetailRepository.findByCustomerId(customerId);
    if (!existingCognitoDetail) throw new Error(ErrorMessage.NO_COGNITO_DETAIL);

    //Check if newDeviceId was previously registered under this customer and de-registered
    const previouslyDeregisteredDevicesWithSameDeviceId =
      existingCognitoDetail.devices.filter(
        (device) =>
          device?.deviceId === newDeviceId && device?.isActive === false,
      );
    if (previouslyDeregisteredDevicesWithSameDeviceId?.length > 1) {
      this.logger.error(
        `Customer: ${customerId} has previously deregistered this device multiple times: ${newDeviceId}}`,
      );
    } else if (previouslyDeregisteredDevicesWithSameDeviceId?.length === 1) {
      const device = previouslyDeregisteredDevicesWithSameDeviceId[0];
      return this.deviceRepository.update({
        ...device,
        isActive: true,
        deviceStatus: DeviceStatus.ACTIVE,
        deviceStatusDate: new Date(),
      });
    }

    //Only if the new Device was never registered under this customer
    const newDevice: IDevice = {
      deviceId: newDeviceId,
      deviceName: newDeviceName,
      isActive: true,
      deviceStatus: DeviceStatus.ACTIVE,
      deviceStatusDate: new Date(),
      cognitoDetail: existingCognitoDetail,
    } as IDevice;

    return this.deviceRepository.create(newDevice);
  }

  listDevices(customerId: string): Promise<IDevice[]> {
    return this.deviceRepository.findDevicesByCustomerId(customerId);
  }
}
