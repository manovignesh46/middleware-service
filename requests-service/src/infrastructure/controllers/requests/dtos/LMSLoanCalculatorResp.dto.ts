export class LMSLoanCalculatorRespDTO {
  installments: Installment[];
  interest_rate: number;
  emi_amount: number;
  tax_amount: number;
  application_fee: number;
  total_application_fee: number;
  loan_amount: number;
  loan_due_date: Date;
  total_payable: number;
  interest_amount: number;
  variant_id: string;
  product_name: string;
}

export class Installment {
  emi_amount: number;
  emi_number: number;
  closing_principal_balance: number;
  emi_principal: number;
  emi_interest: number;
  emi_start_date: Date;
  emi_end_date: Date;
  emi_due_date: Date;
}
