import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class LoanCalculatorDTO {
  @IsNumber()
  @ApiProperty()
  requiredLoanAmount: number;

  @IsString()
  @ApiProperty()
  offerId: string;

  @IsNumber()
  @ApiProperty()
  tenureMonths: number;

  @IsString()
  @ApiProperty()
  repaymentFrequency: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  preferredDay: string;
}
