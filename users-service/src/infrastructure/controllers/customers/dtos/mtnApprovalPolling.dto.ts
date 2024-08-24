import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MTNApprovalPollingDTO {
  @ApiProperty()
  @IsString()
  countryCode: string;

  @ApiProperty()
  @IsString()
  msisdn: string;

  @ApiProperty()
  @IsString()
  approvalId: string;

  @ApiProperty()
  @IsString()
  deviceId: string;

  @ApiProperty()
  @IsString()
  deviceOs: string;

  @ApiProperty()
  @IsString()
  deviceToken: string;
}
