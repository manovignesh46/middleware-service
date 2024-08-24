import { ApiProperty } from '@nestjs/swagger';
import { bool } from 'aws-sdk/clients/signer';
import { threadId } from 'worker_threads';

export class CreditScorePresenter {
  @ApiProperty()
  telcoKyc: boolean;
  @ApiProperty()
  sanctionStatus: boolean;

  constructor(telcoKyc: boolean, sanctionStatus: boolean) {
    this.telcoKyc = telcoKyc;
    this.sanctionStatus = sanctionStatus;
  }
}
