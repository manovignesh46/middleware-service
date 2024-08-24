import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpVerifiedPresenter {
  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  msisdnCountryCode: string;

  @ApiProperty()
  msisdn: string;

  @ApiProperty()
  cognitoId: string;

  constructor(
    isVerified: boolean,
    msisdnCountryCode: string,
    msisdn: string,
    cognitoId: string,
  ) {
    this.isVerified = isVerified;
    this.msisdnCountryCode = msisdnCountryCode;
    this.msisdn = msisdn;
    this.cognitoId = cognitoId;
  }
}
