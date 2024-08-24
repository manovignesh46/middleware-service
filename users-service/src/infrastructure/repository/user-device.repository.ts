import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { IdType, IUserDevice } from '../../domain/model/user-device.interface';
import { IUserDeviceRepository } from '../../domain/repository/user-device-repository.interface';
import { UserDevice } from '../entities/user-device.entity';
@Injectable()
export class UserDeviceRepository implements IUserDeviceRepository {
  private logger = new Logger(UserDeviceRepository.name);
  constructor(
    @InjectRepository(UserDevice)
    private readonly userDeviceRepository: Repository<IUserDevice>,
  ) {}

  findByDeviceId(deviceId: string): Promise<IUserDevice> {
    return this.userDeviceRepository.findOne({
      where: {
        deviceId,
      },
    });
  }

  findAllByIdTypeAndValue(
    idType: IdType,
    idValue: string,
  ): Promise<IUserDevice[]> {
    this.logger.log(this.findAllByIdTypeAndValue.name);
    return this.userDeviceRepository.findBy({
      idType,
      customerOrLeadId: idValue,
    });
  }
  createUserDevice(userDevice: IUserDevice): Promise<IUserDevice> {
    this.logger.log(this.createUserDevice.name);
    return this.userDeviceRepository.save(userDevice);
  }
  async updateUserDevice(userDevice: IUserDevice): Promise<IUserDevice> {
    this.logger.log(this.updateUserDevice.name);
    const currentUserDevice = await this.findByDeviceIdAndIsActive(
      userDevice.deviceId,
    );
    return this.userDeviceRepository.save({
      ...currentUserDevice,
      ...userDevice,
    });
  }
  findByDeviceIdAndIsActive(deviceId: string): Promise<IUserDevice> {
    this.logger.log(this.findByDeviceIdAndIsActive.name);
    return this.userDeviceRepository.findOneBy({
      deviceId,
      isActive: true,
    });
  }
  findByCustomerIdAndIsActive(customerId: string): Promise<IUserDevice> {
    this.logger.log(this.findByCustomerIdAndIsActive.name);
    return this.userDeviceRepository.findOneByOrFail({
      customerOrLeadId: customerId,
      idType: IdType.CUSTOMER,
      isActive: true,
    });
  }
  findByLeadIdAndIsActive(leadId: string): Promise<IUserDevice> {
    this.logger.log(this.findByLeadIdAndIsActive.name);
    return this.userDeviceRepository.findOneByOrFail({
      customerOrLeadId: leadId,
      idType: IdType.LEAD,
      isActive: true,
    });
  }
  findBySnsEndpoint(snsEndpoint: string): Promise<IUserDevice[]> {
    this.logger.log(this.findBySnsEndpoint.name);
    return this.userDeviceRepository.findBy({
      platformApplicationEndpoint: snsEndpoint,
    });
  }
  findByUpdatedAtBeforeDate(date: Date): Promise<IUserDevice[]> {
    this.logger.log(this.findByUpdatedAtBeforeDate.name);
    return this.userDeviceRepository.find({
      where: {
        updatedAt: LessThan(date),
      },
    });
  }

  deleteUserDevice(userDevice: IUserDevice): Promise<IUserDevice> {
    this.logger.log(this.deleteUserDevice.name);
    return this.userDeviceRepository.remove(userDevice);
  }
}
