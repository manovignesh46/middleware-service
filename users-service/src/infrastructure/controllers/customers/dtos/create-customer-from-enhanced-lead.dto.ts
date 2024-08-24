import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerFromEnhancedLeadDto {
  @ApiProperty()
  msisdnCountryCode: string;

  @ApiProperty()
  msisdn: string;
}
