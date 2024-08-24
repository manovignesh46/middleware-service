import { ApiProperty } from '@nestjs/swagger';

export class OtpVerifyGeneralPresenter {
  @ApiProperty()
  customerId: string;

  @ApiProperty()
  otpVerifiedKey: string;
}
