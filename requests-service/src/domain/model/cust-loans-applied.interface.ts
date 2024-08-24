import { IBase } from './base.interface';

export interface ICustLoansApplied extends IBase {
  applicationId: string;
  custId: string;
  offerId: string;
  PCOId: string;
  losLoansBoundaries: string;
  loanStatus: string;
  loanTotalAmount: number;
  loanTenureInstallments: number;
  loanInterestAmount: string;
  loanFees: number;
  loanTotalAmountPayable: number;
  loanRepayFrequecy: string;
  loanRepayAmount: number;
  loanPreferedPaymentOn: string;
  loanLastPaymentDate: Date;
  isTerminated: boolean;
}
