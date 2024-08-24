import { CreditScorePresenter } from './creditScore.presenter';

export const generateMockCreditScorePresenter = () => {
  const presenter = new CreditScorePresenter(null, false);

  return presenter;
};

it('should have all the property', async () => {
  const presenter: CreditScorePresenter = generateMockCreditScorePresenter();

  expect(presenter).toHaveProperty('sanctionStatus');
  expect(presenter).toHaveProperty('telcoKyc');
});
