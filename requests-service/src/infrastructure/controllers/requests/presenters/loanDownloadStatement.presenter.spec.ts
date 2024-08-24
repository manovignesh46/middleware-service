import { DownloadPresenter } from './download.presenter';

export const generateMockLoanDownloadStatementPresenter = () => {
  const presenter = new DownloadPresenter();
  presenter.loanId = '200';
  presenter.statementLink = '';
  presenter.statusMsg = '';

  return presenter;
};

it('should have all the property', async () => {
  const dto: DownloadPresenter = generateMockLoanDownloadStatementPresenter();
  expect(dto).toHaveProperty('loanId');
  expect(dto).toHaveProperty('statementLink');
  expect(dto).toHaveProperty('statusMsg');
});
