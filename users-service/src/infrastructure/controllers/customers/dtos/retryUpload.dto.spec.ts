import { RetryUploadType } from '../../../../domain/enum/retryUploadType.enum';
import { RetryUploadDTO } from './retryUpload.dto';

export const generateMockRetryUploadDTO = () => {
  const dto = new RetryUploadDTO();
  dto.imageName = '/selfie.jpg';
  dto.type = RetryUploadType.selfie;

  return dto;
};

it('should have property', async () => {
  const dto: RetryUploadDTO = generateMockRetryUploadDTO();
  expect(dto).toHaveProperty('imageName');
  expect(dto).toHaveProperty('type');
});
