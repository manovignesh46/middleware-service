import { LoanDueStatus } from '../enum/loan-due-status.enum';
import { LoanRepaymentType } from '../enum/loan-repayment-type.enum';
import { LoanRepaymentMode } from '../enum/loan-repayment-mode.enum';
import { IBase } from './base.interface';
import { LoanRepaymentStatus } from '../enum/loan-repayment-status.enum';

export interface ICustLoanRepaymentRecord extends IBase {
  id: string;
  customerId: string;
  offerId: string;
  loanAccountNumber: string;
  loanTotalAmount: number;
  loanDueAmount: number;
  loanDueDate: Date;
  loanDueStatus: LoanDueStatus;
  loanRepaymentType: LoanRepaymentType;
  loanRepaymentAmount: number;
  loanRepaymentMode: LoanRepaymentMode;
  loanRepaymentStatus: LoanRepaymentStatus;
  loanRepaymentResponse: string;
  transactionId: string;
  externalTransactionId: string;
  statusReason: string;
  message: string;
  status: string;
  code: number;
  referenceId: string;
  amountPaid: number;
  paidDate: string;
  outstandingBalance: number;
  outstandingPrincipal: number;
  outstandingInterest: number;
  outstandingFee: number;
}
