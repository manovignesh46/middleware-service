import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @ApiProperty()
  msisdnCountryCode: string;

  @IsString()
  @ApiProperty()
  msisdn: string;

  @IsString()
  @ApiProperty()
  otp: string;
}
