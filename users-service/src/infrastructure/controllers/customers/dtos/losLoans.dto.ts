export class LOSLoan {
  id: string;
  interest_rate: string;
  emi_amount: number;
  next_financial_milestone_at: Date;
  next_emi_due_amount: number;
  next_emi_due_date: Date;
  loan_amount: number;
  loan_date: Date;
  loan_due_date: Date;
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
  loan_against_details: LoanAgainstDetail;
  creationDate: Date;
}

export class LoanAgainstDetail {
  student_name: string;
  payment_gateway: string;
  student_code: string;
  school_name: string;
  student_class: string;
  school_code: string;
  student_gender: string;
  student_dob: string;
  student_paymentcode: string;
  student_ova: string;
  telco_ova: string;
}
