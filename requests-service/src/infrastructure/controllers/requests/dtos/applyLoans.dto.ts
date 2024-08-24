import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
export class ApplyLoansDTO {
  @IsString()
  @ApiProperty()
  aggregatorId: string;

  @IsString()
  @ApiProperty()
  offerId: string;

  @IsString()
  @ApiProperty()
  studentPCOId: string;

  @IsNumber()
  @ApiProperty()
  currentOutStandingFees: number;
}
