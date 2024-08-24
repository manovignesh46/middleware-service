import { ApiProperty } from '@nestjs/swagger';
import { LMSLoanCalculatorRespDTO } from '../dtos/LMSLoanCalculatorResp.dto';

export class Installment {
  @ApiProperty()
  emiAmount: number;

  @ApiProperty()
  emiNumber: number;

  @ApiProperty()
  closingPrincipalBalance: number;

  @ApiProperty()
  emiPrincipal: number;

  @ApiProperty()
  emiInterest: number;

  @ApiProperty()
  emiStartDate: Date;

  @ApiProperty()
  emiEndDate: Date;

  @ApiProperty()
  emiDueDate: Date;
}
export class LoanCalculatorPresenter {
  @ApiProperty({ isArray: true, type: Installment })
  installments: Installment[];

  @ApiProperty()
  interestRate: number;

  @ApiProperty()
  emiAmount: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  applicationFee: number;

  @ApiProperty()
  totalApplicationFee: number;

  @ApiProperty()
  loanAmount: number;

  @ApiProperty()
  loanDueDate: Date;

  @ApiProperty()
  totalPayable: number;

  @ApiProperty()
  interestAmount: number;

  @ApiProperty()
  offerId: string;

  @ApiProperty()
  productName: string;
}

export async function transformLoanCalculator(
  losResp: LMSLoanCalculatorRespDTO,
): Promise<LoanCalculatorPresenter> {
  const presenter: LoanCalculatorPresenter = new LoanCalculatorPresenter();
  presenter.interestRate = losResp.interest_rate;
  presenter.emiAmount = losResp.emi_amount;
  presenter.taxAmount = losResp.tax_amount;
  presenter.applicationFee = losResp.application_fee;
  presenter.totalApplicationFee = losResp.total_application_fee;
  presenter.loanAmount = losResp.loan_amount;
  presenter.loanDueDate = losResp.loan_due_date;
  presenter.totalPayable = losResp.total_payable;
  presenter.interestAmount = losResp.interest_amount;
  presenter.offerId = losResp.variant_id;
  presenter.productName = losResp.product_name;

  const installments: Installment[] = [];
  for await (const installment of losResp.installments) {
    const instmnt: Installment = new Installment();
    instmnt.emiAmount = installment.emi_amount;
    instmnt.emiNumber = installment.emi_number;
    instmnt.closingPrincipalBalance = installment.closing_principal_balance;
    instmnt.emiPrincipal = installment.emi_principal;
    instmnt.emiInterest = installment.emi_interest;
    instmnt.emiStartDate = installment.emi_start_date;
    instmnt.emiEndDate = installment.emi_end_date;
    instmnt.emiDueDate = installment.emi_due_date;

    installments.push(instmnt);
  }
  presenter.installments = installments;

  return presenter;
}
