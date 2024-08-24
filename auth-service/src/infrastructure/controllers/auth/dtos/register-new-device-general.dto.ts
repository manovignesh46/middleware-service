import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class RegisterNewDeviceGeneralDto {
  @IsString()
  @ApiProperty()
  customerId: string;

  @IsString()
  @ApiProperty()
  otpVerifiedKey: string;

  @IsString()
  @IsOptional()
  @ValidateIf((dto) => dto.oldDeviceId !== '')
  @ApiProperty({ required: false })
  oldDeviceId: string;

  @IsString()
  @ApiProperty()
  newDeviceId: string;

  @IsString()
  @ApiProperty()
  newDeviceName: string;
}
