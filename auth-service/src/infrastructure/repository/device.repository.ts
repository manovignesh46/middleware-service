import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDevice } from '../../domain/models/device.interface';
import { IDeviceRepository } from '../../domain/repositories/device-repository.interface';
import { Device } from '../entities/device.entity';

@Injectable()
export class DeviceRepository implements IDeviceRepository {
  constructor(
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
  ) {}
  bulkUpdateOrCreate(devices: IDevice[]) {
    return this.deviceRepository.save(devices);
  }
  findDevicesByCustomerIdAndIsActive(customerId: string): Promise<IDevice[]> {
    return this.deviceRepository.findBy({
      isActive: true,
      cognitoDetail: { customerId },
    });
  }
  findDevicesByCustomerId(customerId: string): Promise<IDevice[]> {
    return this.deviceRepository.findBy({ cognitoDetail: { customerId } });
  }
  findByCustomerIdDeviceKeyAndIsActive(customerId: string, deviceKey: string) {
    return this.deviceRepository.findOneByOrFail({
      cognitoDetail: { customerId },
      deviceId: deviceKey,
      isActive: true,
    });
  }
  findByMsisdnAndIsActive(msisdnCountryCode: string, msisdn: string) {
    return this.deviceRepository.findBy({
      cognitoDetail: { msisdnCountryCode, msisdn },
      isActive: true,
    });
  }
  findByDeviceKeyAndIsActive(deviceKey: string) {
    return this.deviceRepository.findBy({
      deviceId: deviceKey,
      isActive: true,
    });
  }
  create(device: IDevice) {
    return this.deviceRepository.save(device);
  }
  async update(device: IDevice) {
    const existingDevice = await this.deviceRepository.findOneByOrFail({
      id: device.id,
    });
    return this.deviceRepository.save({ ...existingDevice, ...device });
  }
}
