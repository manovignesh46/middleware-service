import { ApiProperty } from '@nestjs/swagger';

export class SubmitLoansPresenter {
  @ApiProperty()
  studentName: string;

  @ApiProperty()
  schoolCode: string;

  @ApiProperty()
  loanAmount: number;

  @ApiProperty()
  studentClass: string;
}
