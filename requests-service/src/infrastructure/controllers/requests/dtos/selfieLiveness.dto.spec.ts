import { SelfieLivenessDTO } from './selfieLiveness.dto';

export const generateMockSelfieLivenessDTO = () => {
  const dto = new SelfieLivenessDTO();

  dto.id = 'a403f5c6-accc-49e8-8722-83f0fb22c922';
  dto.custId = '34bb7999-816a-4dc0-9a84-5b233ca901c9';
  dto.faceMatchScore = 100;
  dto.livenessScore = 99;
  dto.faceMatchStatus = 'GOOD';
  dto.livenessMatchStatus = 'GOOD';
  dto.faceMatchComparisonResult = 99;
  dto.livenessComparisonResult = 99;
  dto.selfieImagePreSignedS3URL = 'sign';
  dto.livenessVideoPreSignedS3URL = 'video';
  return dto;
};

it('should have all the property', async () => {
  const dto: SelfieLivenessDTO = generateMockSelfieLivenessDTO();
  expect(dto).toHaveProperty('id');
  expect(dto).toHaveProperty('custId');
  expect(dto).toHaveProperty('faceMatchScore');
  expect(dto).toHaveProperty('livenessScore');
  expect(dto).toHaveProperty('faceMatchStatus');
  expect(dto).toHaveProperty('livenessMatchStatus');
  expect(dto).toHaveProperty('faceMatchComparisonResult');
  expect(dto).toHaveProperty('livenessComparisonResult');
  expect(dto).toHaveProperty('selfieImagePreSignedS3URL');
  expect(dto).toHaveProperty('livenessVideoPreSignedS3URL');
});
