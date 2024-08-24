export class LoansLMSDTO {
  id: string;
  student_details: string;
  interest_rate: string;
  emi_amount: number;
  next_financial_milestone_at: Date;
  loan_amount: number;
  loan_date: Date;
  loan_due_date: string;
  is_loan_overdue: boolean;
  overdue_message: string;
  due_day: string;
  emi_due_count: number;
  emi_paid_count: number;
  total_emi_amount_due: number;
  total_outstanding: number;
  amount_paid: number;
  total_payable: number;
  loan_against_id: string;
  variant_id: string;
  product_name: string;
}
