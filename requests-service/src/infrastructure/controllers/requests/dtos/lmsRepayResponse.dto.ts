import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class RepayLoanData {
  @ApiProperty()
  @IsString()
  request_id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status_reason: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  transaction_id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  external_transaction_id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  amount_paid: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  paid_date: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  outstanding_balance: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  outstanding_principal: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  outstanding_interest: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  outstanding_fee: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  reference_id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  yabx_txn_id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  loan_due_date: string; //seems like this only comes during repay loan API call
}

export class LMSRepayResponse {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  code: number; //possible values: 2000 (Repayment in MTN Successful) and 6411

  @ApiProperty({ type: RepayLoanData })
  @IsObject()
  @ValidateNested()
  data: RepayLoanData;
}
