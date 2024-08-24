import { MTNApprovalPollingDTO } from './mtnApprovalPolling.dto';

export const generateMockMTNApprovalPollingDTO = () => {
  const dto = new MTNApprovalPollingDTO();
  dto.approvalId = 'apiod1234';
  dto.countryCode = '+256';
  dto.msisdn = '201202203';

  return dto;
};

it('should have property', async () => {
  const dto: MTNApprovalPollingDTO = generateMockMTNApprovalPollingDTO();
  expect(dto).toHaveProperty('msisdn');
  expect(dto).toHaveProperty('countryCode');
  expect(dto).toHaveProperty('approvalId');
});
