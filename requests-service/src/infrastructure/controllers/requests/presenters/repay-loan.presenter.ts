import { ApiProperty } from '@nestjs/swagger';
import { NumericAxisOptions } from 'aws-sdk/clients/quicksight';

export class RepayLoanPresenter {
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

  losStatusCode: number; //No @ApiProperty() decorator because not being sent to FE

  constructor(
    requestId: string,
    transactionId: string,
    externalTransactionId: string,
    referenceId: string,
    offerId: string,
    losStatusCode: number,
  ) {
    this.requestId = requestId;
    this.transactionId = transactionId;
    this.externalTransactionId = externalTransactionId;
    this.referenceId = referenceId;
    this.offerId = offerId;
    this.losStatusCode = losStatusCode;
  }
}
