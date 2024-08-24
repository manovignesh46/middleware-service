import { ApiProperty } from '@nestjs/swagger';
import { IsString, isString } from 'class-validator';

export class MTNConsentStatusDTO {
  @ApiProperty()
  @IsString()
  msisdn: string;

  @ApiProperty()
  @IsString()
  externalRequestId: string;

  @ApiProperty()
  @IsString()
  approvalId: string;

  @ApiProperty()
  @IsString()
  validationResult: string;
}
