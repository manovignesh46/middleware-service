import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { OtpAction } from '../../../../domain/enum/otp-action.enum';

export class VerifyOtpVerifiedKeyDto {
  @IsString()
  @ApiProperty()
  customerId: string;

  @IsString()
  @ApiProperty()
  otpVerifiedKey: string;

  @IsEnum(OtpAction)
  @ApiProperty({ enum: OtpAction })
  otpAction: OtpAction;
}
