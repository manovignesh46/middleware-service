import { AgreedLoanBoundaries, SubmitLoansDTO } from './submitLoans.dto';

export const generateMockSubmitLoansDTO = () => {
  const agreedLoanBoundaries: AgreedLoanBoundaries = {
    requiredAmount: 3178310,
    totalInterestAmount: 431210,
    feeAmount: 123124,
    totalAmountPayable: 1222,
    repaymentFrequency: 'monthly',
    repaymentAmount: 242342,
    repaymentPreferredOn: 'bi monthly',
    lastRepayment: '2023-04-08T20:29:40.521Z',
    tenor: 5,
  };

  const dto: SubmitLoansDTO = {
    agreedLoanBoundaries: agreedLoanBoundaries,
    termsAndConditions: false,
    studentPCOId: 'PCO12345',
    currentOutStandingFees: 500000,
  };

  return dto;
};

it('should have all the property', async () => {
  const presenter: SubmitLoansDTO = generateMockSubmitLoansDTO();
  expect(presenter).toHaveProperty('studentPCOId');
  expect(presenter).toHaveProperty('currentOutStandingFees');
  expect(presenter).toHaveProperty('agreedLoanBoundaries');
  expect(presenter).toHaveProperty('termsAndConditions');
});
