import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { OtpAction } from '../../../../domain/enum/otp-action.enum';

export class GeneralOtpVerifyDto {
  @IsString()
  @ApiProperty()
  customerId: string;

  @IsString()
  @ApiProperty()
  msisdnCountryCode: string;

  @IsString()
  @ApiProperty()
  msisdn: string;

  @IsString()
  @ApiProperty()
  otp: string;

  @IsEnum(OtpAction)
  @ApiProperty({ enum: OtpAction })
  otpAction: OtpAction;
}
