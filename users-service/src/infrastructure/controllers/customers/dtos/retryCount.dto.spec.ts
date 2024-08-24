import { retryCountDTO } from './retryCount.dto';

export const generateMockRetryCountDTO = () => {
  const dto = new retryCountDTO();
  dto.front = 0;
  dto.back = 0;
  dto.face = 0;
  dto.selfie = 0;

  return dto;
};

it('should have property', async () => {
  const dto: retryCountDTO = generateMockRetryCountDTO();
  expect(dto).toHaveProperty('front');
  expect(dto).toHaveProperty('back');
  expect(dto).toHaveProperty('face');
  expect(dto).toHaveProperty('selfie');
});
