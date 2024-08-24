import { ApiProperty } from '@nestjs/swagger';
import { LoanAgainstDetail } from './losLoans.dto';

export class SubmittedLoansLOS {
  @ApiProperty()
  loanId: string;

  @ApiProperty()
  loanAmount: number;

  @ApiProperty()
  creationDate: Date;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  rejectionCode: number;

  @ApiProperty()
  loan_against_id: string;

  @ApiProperty()
  variant_id: number;

  @ApiProperty()
  rejectionReason: string;

  @ApiProperty()
  loan_against_details: LoanAgainstDetail;

  @ApiProperty()
  ProductVariantName: string;

  @ApiProperty()
  studentName: string;

  @ApiProperty()
  studentClass: string;

  @ApiProperty()
  studentRegnNumber: string;

  @ApiProperty()
  schoolName: string;

  @ApiProperty()
  schoolCode: string;
}
