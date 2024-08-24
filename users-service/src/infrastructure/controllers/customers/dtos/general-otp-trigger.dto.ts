import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { OtpAction } from '../../../../domain/enum/otp-action.enum';

export class GeneralOtpTriggerDto {
  @IsEnum(OtpAction)
  @ApiProperty({ enum: OtpAction })
  otpAction: OtpAction;
}

export class ForgotPinOtpTriggerDto extends GeneralOtpTriggerDto {
  @IsString()
  @ApiProperty()
  nationalIdNumber: string;

  @IsString()
  @ApiProperty()
  dateOfBirth: string;

  @IsString()
  @ApiProperty()
  msisdnCountryCode: string;

  @IsString()
  @ApiProperty()
  msisdn: string;
}

export class RegisterNewDeviceOtpTriggerDto extends ForgotPinOtpTriggerDto {}
