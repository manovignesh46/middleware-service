import { LoanDueStatus } from '../../enum/loan-due-status.enum';
import { LoanRepaymentMode } from '../../enum/loan-repayment-mode.enum';
import { LoanRepaymentStatus } from '../../enum/loan-repayment-status.enum';
import { LoanRepaymentType } from '../../enum/loan-repayment-type.enum';
import { ICustLoanRepaymentRecord } from '../cust-loan-repayment-record.model';

export const mockCustLoanRepaymentRecord: ICustLoanRepaymentRecord = {
  id: 'id123',
  customerId: 'cust123',
  offerId: 'offer123',
  loanAccountNumber: 'acc123',
  loanTotalAmount: 100,
  loanDueAmount: 100,
  loanDueDate: new Date(),
  loanDueStatus: LoanDueStatus.IN_DATE,
  loanRepaymentType: LoanRepaymentType.FULL_PAYMENT,
  loanRepaymentAmount: 100,
  loanRepaymentMode: LoanRepaymentMode.AIRTEL_WALLET,
  loanRepaymentStatus: LoanRepaymentStatus.SUCCESS,
  loanRepaymentResponse: '[]',
  transactionId: 'trans123',
  externalTransactionId: 'extTrans123',
  statusReason: 'success',
  message: 'success',
  status: 'success',
  code: 2000,
  referenceId: '',
  amountPaid: 0,
  paidDate: '',
  outstandingBalance: 0,
  outstandingPrincipal: 0,
  outstandingInterest: 0,
  outstandingFee: 0,
  createdAt: undefined,
  updatedAt: undefined,
};
