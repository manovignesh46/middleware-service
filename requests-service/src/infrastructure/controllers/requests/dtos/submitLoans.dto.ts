import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
} from 'class-validator';

export class AgreedLoanBoundaries {
  @IsNumber()
  @ApiProperty()
  requiredAmount: number;

  @IsNumber()
  @ApiProperty()
  tenor: number;

  @IsNumber()
  @ApiProperty()
  totalInterestAmount: number;

  @IsNumber()
  @ApiProperty()
  feeAmount: number;

  @IsNumber()
  @ApiProperty()
  totalAmountPayable: number;

  @IsString()
  @ApiProperty()
  repaymentFrequency: string;

  @IsPositive()
  @ApiProperty()
  repaymentAmount: number;

  @IsString()
  @ApiProperty()
  repaymentPreferredOn: string;

  @IsString()
  @ApiProperty()
  lastRepayment: string;
}

export class SubmitLoansDTO {
  @IsString()
  @ApiProperty()
  studentPCOId: string;

  @IsNumber()
  @ApiProperty()
  currentOutStandingFees: number;

  @IsObject()
  @ApiProperty({ type: AgreedLoanBoundaries })
  agreedLoanBoundaries: AgreedLoanBoundaries;

  @IsBoolean()
  @ApiProperty()
  termsAndConditions: boolean;
}
