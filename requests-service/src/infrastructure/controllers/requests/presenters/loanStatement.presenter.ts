import { ApiProperty } from '@nestjs/swagger';
import { LoansLMSDTO } from '../dtos/openLoans.dto';

export class LoansDetail {
  @ApiProperty()
  loanId: string;

  @ApiProperty()
  loanAmount: number;

  @ApiProperty()
  loanDueDate: string;

  @ApiProperty()
  emiAmount: number;

  @ApiProperty()
  roi: string;

  @ApiProperty()
  dueDay: string;

  @ApiProperty()
  studentPCOId: string;

  @ApiProperty()
  loanDueAmount: number;

  @ApiProperty()
  offerId: string;

  @ApiProperty()
  productName: string;
}
export class LoanStatementPresenter {
  @ApiProperty({ isArray: true, type: LoansDetail })
  activeLoans: LoansDetail[];

  @ApiProperty({ isArray: true, type: LoansDetail })
  closedLoans: LoansDetail[];
}

export async function getLoansDetails(
  loanLMSDTO: LoansLMSDTO[],
  isActiveLoan: boolean,
): Promise<LoansDetail[]> {
  const loanDetails: LoansDetail[] = [];
  for await (const loanLMS of loanLMSDTO) {
    const dto: LoansDetail = new LoansDetail();
    dto.loanId = loanLMS.id.toString();
    dto.loanAmount = loanLMS.loan_amount;

    if (isActiveLoan) {
      dto.loanDueDate = loanLMS.loan_due_date;
      dto.emiAmount = loanLMS.emi_amount;
      dto.roi = loanLMS.interest_rate.toString();
      dto.dueDay = loanLMS.due_day;
      dto.studentPCOId = loanLMS.loan_against_id;
    }
    dto.loanDueAmount = loanLMS.total_outstanding;
    dto.offerId = loanLMS.variant_id.toString();
    dto.productName = loanLMS.product_name;
    loanDetails.push(dto);
  }
  return loanDetails;
}
