import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf, isString } from 'class-validator';

export class TriggerOtpDto {
  @IsString()
  @ApiProperty()
  msisdn: string;

  @IsString()
  @ApiProperty()
  msisdnCountryCode: string;

  @IsString()
  @ApiProperty()
  nationalIdNumber: string;

  @IsString()
  @ApiProperty()
  preferredName: string;

  @ValidateIf((dto) => dto.email !== '')
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  email?: string;

  @IsString()
  @ApiProperty()
  deviceId: string;

  @IsString()
  @ApiProperty()
  deviceOs: string;

  @IsString()
  @ApiProperty()
  schoolName: string;

  @IsString()
  @ApiProperty()
  deviceToken: string; //Firebase Token
}
