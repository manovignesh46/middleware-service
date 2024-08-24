import { ApiProperty } from '@nestjs/swagger';
import { AddressType } from '../../../../domain/enum/address-type.enum';
import { CountryCodes } from '../../../../domain/enum/country-code.enum';

export class GetAddressResponseDto {
  @ApiProperty()
  addressLine1: string;

  @ApiProperty()
  addressLine2: string;

  @ApiProperty()
  addressLine3: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  countryOfResidence: CountryCodes;

  @ApiProperty()
  addressType: AddressType;
}

export const mockGetAddressResponseDto: GetAddressResponseDto = {
  addressLine1: 'NANSANA WEST',
  addressLine2: 'NANSANA',
  addressLine3: 'NANSANA DIVISION',
  city: 'KYADONDO',
  district: 'WAKISO',
  countryOfResidence: CountryCodes.Uganda,
  addressType: AddressType.RESIDENTIAL,
};
