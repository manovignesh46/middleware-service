import { LoanCalculatorPresenter } from './loanCalculator.presenter';

export const generateMockLoanCalculatorPresneter = () => {
  const presenter = new LoanCalculatorPresenter();
  presenter.interestRate = 4;
  presenter.emiAmount = 454.46;
  presenter.taxAmount = 25;
  presenter.applicationFee = 250;
  presenter.totalApplicationFee = 275;
  presenter.loanAmount = 5275;
  presenter.loanDueDate = new Date(Date.parse('2023-11-08T16:26:26.007Z'));
  presenter.totalPayable = 5908;
  presenter.interestAmount = 633;
  presenter.offerId = '1688625221544';
  presenter.productName = 'School Financing';
  presenter.installments = [
    {
      emiAmount: 454.46,
      emiNumber: 1,
      closingPrincipalBalance: 4869.23,
      emiPrincipal: 405.77,
      emiInterest: 48.69,
      emiStartDate: new Date(Date.parse('2023-07-10T05:25:40.684Z')),
      emiEndDate: new Date(Date.parse('2023-07-19T00:00:00.000Z')),
      emiDueDate: new Date(Date.parse('2023-07-19T00:00:00.000Z')),
    },
  ];

  return presenter;
};

it('should have all the property', async () => {
  const dto: LoanCalculatorPresenter = generateMockLoanCalculatorPresneter();
  expect(dto).toHaveProperty('interestRate');
  expect(dto).toHaveProperty('emiAmount');
  expect(dto).toHaveProperty('taxAmount');
  expect(dto).toHaveProperty('applicationFee');
  expect(dto).toHaveProperty('totalApplicationFee');
  expect(dto).toHaveProperty('loanAmount');
  expect(dto).toHaveProperty('loanDueDate');
  expect(dto).toHaveProperty('totalPayable');
  expect(dto).toHaveProperty('interestAmount');
  expect(dto).toHaveProperty('offerId');
  expect(dto).toHaveProperty('productName');
  expect(dto).toHaveProperty('installments');
});
