import { LoansDetail, LoanStatementPresenter } from './loanStatement.presenter';
import moment from 'moment';

export const generateMockLoansStatementPresenter = (optId: string) => {
  const presenter: LoanStatementPresenter = new LoanStatementPresenter();

  const openLoans: LoansDetail = new LoansDetail();
  const closedLoans: LoansDetail = new LoansDetail();

  if (optId === '1') {
    openLoans.loanId = '30';
    openLoans.loanAmount = 5295;
    openLoans.loanDueDate = moment('2023-08-22')
      .format('YYYY-MM-DD')
      .toString();
    openLoans.emiAmount = 415.96;
    openLoans.roi = '0.12';
    openLoans.dueDay = '2nd';
    openLoans.studentPCOId = '646c68641e92591123803456';
    openLoans.loanDueAmount = 4812.37;
    openLoans.offerId = '1684482484387';
    openLoans.productName = 'School Fee Loan';

    presenter.activeLoans = [openLoans];
  } else if (optId === '2') {
    closedLoans.loanId = '75';
    closedLoans.loanAmount = 525000;
    closedLoans.loanDueAmount = -0.02;
    closedLoans.offerId = '1685014421007';
    closedLoans.productName = 'School Fee Loan';

    presenter.closedLoans = [closedLoans];
  }

  return presenter;
};

it('should have all the property', async () => {
  const dto: LoanStatementPresenter = generateMockLoansStatementPresenter('1');
  expect(dto).toHaveProperty('activeLoans');
});
