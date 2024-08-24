import { LMSLoanCalculatorDTO } from './LMSLoanCalculator.dto';

export const generateMockLMSLoanCalculatorDTO = () => {
  const dto = new LMSLoanCalculatorDTO();
  dto.msisdn = '7834234324';
  dto.product_type = 'Installment';
  dto.requested_amount = 5000.0;
  dto.variant_id = '1686896173812';
  dto.loan_tenure = 3;
  dto.repayment_frequency = 'weekly';
  dto.preferred_payment_day = 'wednesday';

  return dto;
};

it('should have all the property', async () => {
  const dto: LMSLoanCalculatorDTO = generateMockLMSLoanCalculatorDTO();
  expect(dto).toHaveProperty('msisdn');
  expect(dto).toHaveProperty('product_type');
  expect(dto).toHaveProperty('requested_amount');
  expect(dto).toHaveProperty('variant_id');
  expect(dto).toHaveProperty('loan_tenure');
  expect(dto).toHaveProperty('repayment_frequency');
  expect(dto).toHaveProperty('preferred_payment_day');
});
