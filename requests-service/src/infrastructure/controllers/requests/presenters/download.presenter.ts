import { ApiProperty } from '@nestjs/swagger';

export class DownloadPresenter {
  @ApiProperty()
  loanId: string;

  @ApiProperty()
  statementLink: string;

  @ApiProperty()
  statusMsg: string;
}
