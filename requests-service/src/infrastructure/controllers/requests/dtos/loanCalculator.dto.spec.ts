import { LoanCalculatorDTO } from './loanCalculator.dto';

export const generateMockLoanCalculatorDTO = () => {
  const dto = new LoanCalculatorDTO();
  dto.requiredLoanAmount = 5000;
  dto.offerId = '1688625221544';
  dto.tenureMonths = 3;
  dto.repaymentFrequency = 'weekly';
  dto.preferredDay = 'friday';

  return dto;
};

it('should have all the property', async () => {
  const dto: LoanCalculatorDTO = generateMockLoanCalculatorDTO();
  expect(dto).toHaveProperty('requiredLoanAmount');
  expect(dto).toHaveProperty('offerId');
  expect(dto).toHaveProperty('tenureMonths');
  expect(dto).toHaveProperty('repaymentFrequency');
  expect(dto).toHaveProperty('preferredDay');
});
