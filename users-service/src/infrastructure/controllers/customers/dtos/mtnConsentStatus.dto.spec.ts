import { MTNConsentStatusDTO } from './mtnConsentStatus.dto';

export const generateMockMTNConsentStatusDTO = () => {
  const dto = new MTNConsentStatusDTO();
  dto.approvalId = 'approval123';
  dto.externalRequestId = 'ext123Ref';
  dto.msisdn = '+256201202203';
  dto.validationResult = 'yes';
  return dto;
};

it('should have property', async () => {
  const dto: MTNConsentStatusDTO = generateMockMTNConsentStatusDTO();
  expect(dto).toHaveProperty('approvalId');
  expect(dto).toHaveProperty('externalRequestId');
  expect(dto).toHaveProperty('msisdn');
  expect(dto).toHaveProperty('validationResult');
});
