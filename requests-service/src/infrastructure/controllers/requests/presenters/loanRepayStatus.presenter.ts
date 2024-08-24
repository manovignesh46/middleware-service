import { ApiProperty } from '@nestjs/swagger';
import { RepayLoanPresenter } from './repay-loan.presenter';

export class LoanRepayStatusPresenter {
  status: number;
}

export class LoanRepayStatusSuccess extends LoanRepayStatusPresenter {
  @ApiProperty()
  amountPaid: number;

  @ApiProperty()
  paidDate: string;

  @ApiProperty()
  outstandingBalance: number;

  @ApiProperty()
  outstandingPrincipal: number;

  @ApiProperty()
  outstandingInterest: number;

  @ApiProperty()
  outstandingFee: number;

  @ApiProperty()
  loanDueDate: Date;
}

export class LoanRepayStatusNotSuccess extends LoanRepayStatusPresenter {
  @ApiProperty()
  requestId?: string;

  @ApiProperty()
  transactionId?: string;

  @ApiProperty()
  externalTransactionId?: string;

  @ApiProperty()
  referenceId?: string;

  @ApiProperty()
  offerId?: string;

  @ApiProperty()
  statusReason?: string;
}
