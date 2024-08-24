import { SelfieCheckPresenter } from './selfieCheck.presenter';
import { SelfieMatchStatus } from '../../../../domain/enum/selfieMatchStatus.enum';

export const generateMockSelfieCheckPresenter = () => {
  const presenter: SelfieCheckPresenter = {
    faceMatchStatus: SelfieMatchStatus.GOOD,
    livenessMatchStatus: SelfieMatchStatus.GOOD,
    faceMatchComparisonResult: 90,
    livenessComparisonResult: 90,
    selfieImagePreSignedS3URL: '',
    livenessVideoPreSignedS3URL: '',
  };

  return presenter;
};

it('should pass is it has all the property', async () => {
  const presenter: SelfieCheckPresenter = generateMockSelfieCheckPresenter();
  expect(presenter).toHaveProperty('faceMatchStatus');
  expect(presenter).toHaveProperty('livenessMatchStatus');
  expect(presenter).toHaveProperty('faceMatchComparisonResult');
  expect(presenter).toHaveProperty('livenessComparisonResult');
  expect(presenter).toHaveProperty('selfieImagePreSignedS3URL');
  expect(presenter).toHaveProperty('livenessVideoPreSignedS3URL');
});
