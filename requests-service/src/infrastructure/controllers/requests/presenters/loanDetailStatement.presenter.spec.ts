import {
  LoanApplicationDetails,
  LoanDetailsStatementPresenter,
  LoanSummary,
  LoanTransactionsDetails,
} from './loanDetailStatement.presenter';

export const generateMockLoanDetailsStatmentPresenter = () => {
  const presenter = new LoanDetailsStatementPresenter();
  const loanAppDetails = new LoanApplicationDetails();
  loanAppDetails.loanId = '200';
  loanAppDetails.loanStatus = 'open';
  loanAppDetails.statementDate = new Date(Date.parse('2023-08-09'));
  loanAppDetails.statementStartDate = new Date(
    Date.parse('2023-07-24T14:05:04.903Z'),
  );
  loanAppDetails.statementEndDate = new Date(Date.parse('2023-08-09'));
  loanAppDetails.customerName = '2222200007';
  loanAppDetails.msisdn = '2222200007';
  loanAppDetails.variantId = '1688625221544';
  loanAppDetails.variantName = 'SFL 3M';
  loanAppDetails.productId = '2';
  loanAppDetails.studentInfo = {
    studentName: 'DARSHAN V S SON 12345',
    schoolName: 'OSCAR ANGELS PRESCHOOL',
    schoolCode: 'OSCAR-ANGELS-PRE',
    studentRegnNumber: '2222200007_132132132',
    studentClass: '3',
    studentGender: '',
  };
  const loanSummary = new LoanSummary();
  loanSummary.disbursementDate = new Date(
    Date.parse('2023-07-24T14:05:04.903Z'),
  );
  loanSummary.requestedLoanAmount = 50000;
  loanSummary.approvedLoanAmount = 52750;
  loanSummary.loanAmount = 59080;
  loanSummary.outstandingBalance = 58080;
  loanSummary.applicationFee = 2500;
  loanSummary.taxAmount = 250;
  loanSummary.interestAmount = 6330;

  const loanTranDetails = new LoanTransactionsDetails();
  loanTranDetails.transactionNumber = 'fd2e94b7c016e9f5';
  loanTranDetails.transactionDateTime = new Date(Date.parse('2023-07-24'));
  loanTranDetails.description = 'repayment';
  loanTranDetails.status = 'success';
  loanTranDetails.amount = 1000;
  loanTranDetails.transactionType = 'Credit';
  loanTranDetails.balance = 58080;
  presenter.loanApplicationDetails = loanAppDetails;
  presenter.loanSummary = loanSummary;
  presenter.loanTransactionsDetails = [loanTranDetails];

  return presenter;
};

it('should have all the property', async () => {
  const dto: LoanDetailsStatementPresenter =
    generateMockLoanDetailsStatmentPresenter();
  expect(dto).toHaveProperty('loanApplicationDetails');
  expect(dto).toHaveProperty('loanSummary');
  expect(dto).toHaveProperty('loanTransactionsDetails');
});
