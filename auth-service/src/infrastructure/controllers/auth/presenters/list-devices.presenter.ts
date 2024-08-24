import { ApiProperty } from '@nestjs/swagger';
import { IDevice } from '../../../../domain/models/device.interface';
import { Device } from '../../../entities/device.entity';

export class ListDevicesPresenter {
  @ApiProperty({ type: Device })
  deviceList: IDevice[];
}
