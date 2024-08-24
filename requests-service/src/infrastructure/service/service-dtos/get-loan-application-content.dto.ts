export class GetLoanApplicationContentInputDto {
  variantMinLoanAmount: string;
  variantMaxLoanAmount: string;
  latePaymentPercent: string;
  missedRepaymentPercent: string;
  responseTimeSla: string;
}

export class GetLoanApplicationContentOutputDto {
  aimAndBenefitsLine1: string;
  aimAndBenefitsLine2: string;
  note1: string;
  note2: string;
  declaration1_1: string;
  declaration1_2: string;
  declaration1_3: string;
  declaration1_4: string;
  declaration1_5: string;
  declaration1_6: string;
  declaration1_7: string;
  declaration2: string;
}
