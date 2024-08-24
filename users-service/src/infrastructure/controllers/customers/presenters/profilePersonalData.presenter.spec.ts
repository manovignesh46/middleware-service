import { Gender } from '../../../../domain/enum/gender.enum';
import { ProfilePersonalDataPresenter } from './profilePersonalData.presenter';

export const generateMockProfilePersonalDataPresenter = () => {
  const presenter: ProfilePersonalDataPresenter =
    new ProfilePersonalDataPresenter();

  presenter.dob = '01.08.1997';
  presenter.emailId = 'rudra@gmail.com';
  presenter.firstName = 'Darshan';
  presenter.gender = Gender.FEMALE;
  presenter.givenName = 'Vadyar';
  presenter.msisdn = '1234567890';
  presenter.nin = 'AB1234567890XY';
  presenter.ninExpiryDate = new Date('9999-12-30');

  return presenter;
};

it('should pass is it has all the property', async () => {
  const presenter: ProfilePersonalDataPresenter =
    generateMockProfilePersonalDataPresenter();
  expect(presenter).toHaveProperty('firstName');
  expect(presenter).toHaveProperty('givenName');
  expect(presenter).toHaveProperty('nin');
  expect(presenter).toHaveProperty('ninExpiryDate');
  expect(presenter).toHaveProperty('dob');
  expect(presenter).toHaveProperty('gender');
  expect(presenter).toHaveProperty('emailId');
  expect(presenter).toHaveProperty('msisdn');
});
