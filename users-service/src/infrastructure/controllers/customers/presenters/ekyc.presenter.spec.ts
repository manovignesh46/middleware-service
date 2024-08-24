import { EKycPresenter } from './ekyc.presenter';

export const generateMockEKYCPresenter = () => {
  const presenter = new EKycPresenter();
  presenter.telcoIdMatch = true;
  presenter.sanctionCheck = false;
  presenter.scanIdCheck = 'MATCHED';
  presenter.scanNameCheck = 'MATCHED';
  presenter.idExpiry = 'expired';
  presenter.photoMatch = 0;

  return presenter;
};

it('should it has all the property', async () => {
  const presenter: EKycPresenter = await generateMockEKYCPresenter();
  expect(presenter).toHaveProperty('telcoIdMatch');
  expect(presenter).toHaveProperty('sanctionCheck');
  expect(presenter).toHaveProperty('scanIdCheck');
  expect(presenter).toHaveProperty('scanNameCheck');
  expect(presenter).toHaveProperty('idExpiry');
  expect(presenter).toHaveProperty('photoMatch');
});
