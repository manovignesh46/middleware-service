import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { OtpAction } from '../../../../domain/enum/otp-action.enum';

export class GeneralResetPinDto {
  @IsEnum(OtpAction)
  @ApiProperty({ enum: OtpAction })
  otpAction: OtpAction;
}

export class ForgotPinResetDto extends GeneralResetPinDto {
  @IsString()
  @ApiProperty()
  customerId: string;

  @IsString()
  @ApiProperty()
  otpVerifiedKey: string;

  @IsString()
  @ApiProperty()
  newPin: string;

  @IsString()
  @ApiProperty()
  confirmNewPin: string;
}
