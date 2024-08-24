import { ApiProperty } from '@nestjs/swagger';

export class ProfilePersonalDataPresenter {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  givenName: string;

  @ApiProperty()
  nin: string;

  @ApiProperty()
  ninExpiryDate: Date;

  @ApiProperty()
  dob: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  emailId: string;

  @ApiProperty()
  msisdn: string;

  @ApiProperty()
  alternateNumbers: string[];
}
