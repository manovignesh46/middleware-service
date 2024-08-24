import { ApiProperty } from '@nestjs/swagger';

export class OTPTriggerGeneralPresenter {
  @ApiProperty()
  otpPrefix: string;

  @ApiProperty()
  msisdnCountryCode: string;

  @ApiProperty()
  msisdn: string;

  @ApiProperty()
  customerId: string;

  constructor(
    otpPrefix: string,
    msisdnCountryCode: string,
    msisdn: string,
    customerId: string,
  ) {
    this.otpPrefix = otpPrefix;
    this.msisdnCountryCode = msisdnCountryCode;
    this.msisdn = msisdn;
    this.customerId = customerId;
  }
}
