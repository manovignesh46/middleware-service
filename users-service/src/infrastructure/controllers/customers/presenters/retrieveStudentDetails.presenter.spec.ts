import { Gender } from '../../../../domain/enum/gender.enum';
import { RetrieveStudentDetailsPresenter } from './retrieveStudentDetails.presenter';

export const genertaeMockRetrieveStudentDetailsPresenter = () => {
  const presenter = new RetrieveStudentDetailsPresenter(
    '123456789',
    'John Desmond Doe',
    '123',
    'Furaha University',
    'abcd',
    '1 HOPE',
    Gender.MALE,
    90000,
    '123456789',
    'PEGPAY',
    '4567895',
    false,
  );

  return presenter;
};

export const genertaeMockRetrieveStudentDetailsPresenterForSchoolAggregator =
  () => {
    const presenter = new RetrieveStudentDetailsPresenter(
      null,
      'Okello',
      '123',
      'xyz School',
      'abcd',
      '1 HOPE',
      null,
      90000,
      '123456789',
      'PEGPAY',
      '4567895',
      false,
    );

    return presenter;
  };

it('should pass is it has all the property', async () => {
  const presenter: RetrieveStudentDetailsPresenter =
    genertaeMockRetrieveStudentDetailsPresenter();
  expect(presenter).toHaveProperty('studentId');
  expect(presenter).toHaveProperty('studentName');
  expect(presenter).toHaveProperty('schoolCode');
  expect(presenter).toHaveProperty('schoolName');
  expect(presenter).toHaveProperty('studentRegnNumber');
  expect(presenter).toHaveProperty('studentClass');
  expect(presenter).toHaveProperty('studentGender');
  expect(presenter).toHaveProperty('currentFees');
  expect(presenter).toHaveProperty('aggregatorId');
  expect(presenter).toHaveProperty('schoolNameComparisonFailed');
});
