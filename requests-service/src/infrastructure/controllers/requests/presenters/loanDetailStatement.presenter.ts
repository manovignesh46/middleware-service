import { ApiProperty } from '@nestjs/swagger';

export class StudentInfo {
  @ApiProperty()
  studentName: string;

  @ApiProperty()
  schoolName: string;

  @ApiProperty()
  schoolCode: string;

  @ApiProperty()
  studentRegnNumber: string;

  @ApiProperty()
  studentClass: string;

  @ApiProperty()
  studentGender: string;
}
export class LoanApplicationDetails {
  @ApiProperty()
  loanId: string;

  @ApiProperty()
  loanStatus: string;

  @ApiProperty()
  statementDate: Date;

  @ApiProperty()
  statementStartDate: Date;

  @ApiProperty()
  statementEndDate: Date;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  msisdn: string;

  @ApiProperty()
  variantId: string;

  @ApiProperty()
  variantName: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty({ type: StudentInfo })
  studentInfo: StudentInfo;
}

export class LoanSummary {
  @ApiProperty()
  disbursementDate: Date;

  @ApiProperty()
  requestedLoanAmount: number;

  @ApiProperty()
  approvedLoanAmount: number;

  @ApiProperty()
  loanAmount: number;

  @ApiProperty()
  outstandingBalance: number;

  @ApiProperty()
  applicationFee: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  interestAmount: number;
}

export class LoanTransactionsDetails {
  @ApiProperty()
  transactionNumber: string;

  @ApiProperty()
  transactionDateTime: Date;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  transactionType: string;

  @ApiProperty()
  balance: number;
}
export class LoanDetailsStatementPresenter {
  @ApiProperty({ type: LoanApplicationDetails })
  loanApplicationDetails: LoanApplicationDetails;

  @ApiProperty({ type: LoanSummary })
  loanSummary: LoanSummary;

  @ApiProperty({ isArray: true, type: LoanTransactionsDetails })
  loanTransactionsDetails: LoanTransactionsDetails[];
}

export function typeConversion(
  loanDetailsStatementPresenter: LoanDetailsStatementPresenter,
): LoanDetailsStatementPresenter {
  loanDetailsStatementPresenter.loanSummary.requestedLoanAmount = Number(
    loanDetailsStatementPresenter.loanSummary.requestedLoanAmount,
  );
  loanDetailsStatementPresenter.loanSummary.approvedLoanAmount = Number(
    loanDetailsStatementPresenter.loanSummary.approvedLoanAmount,
  );
  loanDetailsStatementPresenter.loanSummary.loanAmount = Number(
    loanDetailsStatementPresenter.loanSummary.loanAmount,
  );
  loanDetailsStatementPresenter.loanSummary.outstandingBalance = Number(
    loanDetailsStatementPresenter.loanSummary.outstandingBalance,
  );
  loanDetailsStatementPresenter.loanSummary.applicationFee = Number(
    loanDetailsStatementPresenter.loanSummary.applicationFee,
  );
  loanDetailsStatementPresenter.loanSummary.taxAmount = Number(
    loanDetailsStatementPresenter.loanSummary.taxAmount,
  );
  loanDetailsStatementPresenter.loanSummary.interestAmount = Number(
    loanDetailsStatementPresenter.loanSummary.interestAmount,
  );
  loanDetailsStatementPresenter.loanApplicationDetails.variantId = String(
    loanDetailsStatementPresenter.loanApplicationDetails.variantId,
  );
  for (const transaction of loanDetailsStatementPresenter.loanTransactionsDetails) {
    transaction.balance = Number(transaction.balance);
    transaction.amount = Number(transaction.amount);
  }

  return loanDetailsStatementPresenter;
}
