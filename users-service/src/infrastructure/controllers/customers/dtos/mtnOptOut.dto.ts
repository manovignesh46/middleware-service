import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MTNOptOutDTO {
  @ApiProperty()
  @IsString()
  countryCode: string;

  @ApiProperty()
  @IsString()
  msisdn: string;

  @ApiProperty()
  @IsString()
  optOutReason: string;

  @ApiProperty()
  @IsString()
  optOutFeedback: string;
}
