import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive, IsString } from 'class-validator';
import { LoanRepaymentMode } from '../../../../domain/enum/loan-repayment-mode.enum';
import { LoanRepaymentType } from '../../../../domain/enum/loan-repayment-type.enum';

export class RepayLoanDto {
  @IsNumber()
  @ApiProperty()
  offerId: string;

  @IsString()
  @ApiProperty()
  studentPCOId: string;

  @IsNumber()
  @ApiProperty()
  loanAccountNumber: string;

  @IsPositive()
  @ApiProperty()
  currentOutstandingAmount: number;

  @IsEnum(LoanRepaymentMode)
  @ApiProperty({ enum: LoanRepaymentMode })
  paymentMethod: LoanRepaymentMode;

  @IsEnum(LoanRepaymentType)
  @ApiProperty({ enum: LoanRepaymentType })
  paymentType: LoanRepaymentType;

  @IsPositive()
  @ApiProperty()
  paymentAmount: number;
}

export class LOSRepayLoanDto {
  @IsString()
  request_id: string;

  @IsString()
  msisdn: string;

  @IsString()
  product_type: string; //snake-case because of LOS conventions

  @IsPositive()
  amount: number;

  @IsNumber()
  instrument_id: string;

  @IsString()
  external_receipt_id: string;

  @IsNumber()
  variant_id: string;
}
