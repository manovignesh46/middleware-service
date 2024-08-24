import { LoansLMSDTO } from './openLoans.dto';

export const generateMockLOSOpenLoansDTO = () => {
  const dto: LoansLMSDTO = new LoansLMSDTO();
  dto.id = '0';
  dto.student_details = '';
  dto.interest_rate = '';
  dto.emi_amount = 0;
  dto.next_financial_milestone_at = undefined;
  dto.loan_amount = 0;
  dto.loan_date = undefined;
  dto.loan_due_date = undefined;
  dto.is_loan_overdue = false;
  dto.due_day = '';
  dto.emi_due_count = 0;
  dto.emi_paid_count = 0;
  dto.total_emi_amount_due = 0;
  dto.total_outstanding = 0;
  dto.amount_paid = undefined;
  dto.total_payable = 0;
  return dto;
};

it('should have property', async () => {
  const dto: LoansLMSDTO = generateMockLOSOpenLoansDTO();
  expect(dto).toHaveProperty('id');
  expect(dto).toHaveProperty('student_details');
  expect(dto).toHaveProperty('interest_rate');
  expect(dto).toHaveProperty('emi_amount');
  expect(dto).toHaveProperty('next_financial_milestone_at');
  expect(dto).toHaveProperty('loan_amount');
  expect(dto).toHaveProperty('loan_date');
  expect(dto).toHaveProperty('loan_due_date');
  expect(dto).toHaveProperty('is_loan_overdue');
  expect(dto).toHaveProperty('due_day');
  expect(dto).toHaveProperty('emi_due_count');
  expect(dto).toHaveProperty('emi_paid_count');
  expect(dto).toHaveProperty('total_emi_amount_due');
  expect(dto).toHaveProperty('total_outstanding');
  expect(dto).toHaveProperty('amount_paid');
  expect(dto).toHaveProperty('total_payable');
});
