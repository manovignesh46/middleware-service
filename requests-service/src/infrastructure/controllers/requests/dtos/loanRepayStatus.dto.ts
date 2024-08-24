import { ApiProperty } from '@nestjs/swagger';

export class LoanRepayStatusDTO {
  @ApiProperty()
  requestId: string;

  @ApiProperty()
  offerId: string;

  @ApiProperty()
  transactionId: string;

  @ApiProperty()
  externalTransactionId: string;

  @ApiProperty()
  referenceId: string;
}
