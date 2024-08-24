import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResumeActionDTO {
  @IsNumber()
  @ApiProperty()
  opId: number;

  @IsString()
  @ApiProperty()
  msisdnCountryCode: string;

  @IsString()
  @ApiProperty()
  msisdn: string;
}
