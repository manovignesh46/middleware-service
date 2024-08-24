import { ApiProperty } from '@nestjs/swagger';

export class CustomerMsisdnPresenter {
  @ApiProperty()
  msisdnCountryCode: string;

  @ApiProperty()
  msisdn: string;

  @ApiProperty()
  preferredName: string;

  @ApiProperty()
  platformApplicationEndpoint: string;

  @ApiProperty()
  availableCreditLimit: number;

  constructor(
    msisdnCountryCode: string,
    msisdn: string,
    preferredName: string,
    platformApplicationEndpoint: string,
    availableCreditLimit: number,
  ) {
    this.msisdnCountryCode = msisdnCountryCode;
    this.msisdn = msisdn;
    this.preferredName = preferredName;
    this.platformApplicationEndpoint = platformApplicationEndpoint;
    this.availableCreditLimit = availableCreditLimit;
  }
}
