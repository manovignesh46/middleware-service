import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceDetailsDTO {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  deviceToken: string;

  @IsString()
  @IsNotEmpty()
  deviceOs: string;
}
