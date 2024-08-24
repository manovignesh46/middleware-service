import { ApiProperty } from '@nestjs/swagger';

export class GetCustomerFromFullMsisdnPresenter {
  @ApiProperty()
  msisdnCountryCode: string;

  @ApiProperty()
  msisdn: string;

  @ApiProperty()
  preferredName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  leadId: string;

  @ApiProperty()
  cognitoId: string;

  @ApiProperty()
  clientStatus: string;
}
