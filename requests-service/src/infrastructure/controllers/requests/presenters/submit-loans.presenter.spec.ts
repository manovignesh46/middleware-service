import { SubmitLoansPresenter } from './submit-loans.presenter';

export const generateMockSubmitLoansPresenter = () => {
  const presenter = new SubmitLoansPresenter();
  presenter.loanAmount = 3178310;
  presenter.schoolCode = '123';
  presenter.studentName = 'akelo';
  presenter.studentClass = 'HOPE';

  return presenter;
};

it('should have all the property', async () => {
  const dto: SubmitLoansPresenter = generateMockSubmitLoansPresenter();
  expect(dto).toHaveProperty('loanAmount');
  expect(dto).toHaveProperty('schoolCode');
  expect(dto).toHaveProperty('studentName');
});
