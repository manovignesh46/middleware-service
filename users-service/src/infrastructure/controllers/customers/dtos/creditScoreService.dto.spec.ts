import { CreditScoreServiceDto } from './creditScoreService.dto';

export const generateMockCreditScoreServiceDto = (
  leadId: string,
  status: string,
  message: string,
  isTelcoKycMatch: boolean,
  isSanctionStatusMatch: boolean,
) => {
  const dto = new CreditScoreServiceDto(
    leadId,
    status,
    message,
    isTelcoKycMatch,
    isSanctionStatusMatch,
  );
  return dto;
};

it('should have all the property', async () => {
  const dto: CreditScoreServiceDto = generateMockCreditScoreServiceDto(
    '123',
    'FAILURE',
    'Telco NIN comparison failed',
    true,
    false,
  );

  expect(dto).toHaveProperty('leadId');
  expect(dto).toHaveProperty('status');
  expect(dto).toHaveProperty('message');
  expect(dto).toHaveProperty('isTelcoKycMatch');
  expect(dto).toHaveProperty('isSanctionStatusMatch');
});
