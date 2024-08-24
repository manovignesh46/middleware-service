import { ApiProperty } from '@nestjs/swagger';

export class RepayLoanUpdatePresenter {
  @ApiProperty()
  requestId: string;

  @ApiProperty()
  status: string;
}
