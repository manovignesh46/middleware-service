import { randomUUID } from 'crypto';
import { LeadStatus } from '../../../../domain/enum/leadStatus.enum';
import { VerifyOtpServiceDto } from './verifyOtpService.dto';

const generateUpdateCustomerDto = () => {
  const otpCount = 0;
  const verified = true;
  const leadId = randomUUID();
  const leadStatus = LeadStatus.OTP_VERIFIED;
  const preferredName = 'John';
  const dto = new VerifyOtpServiceDto(
    leadId,
    leadStatus,
    true,
    preferredName,
    verified,
    otpCount,
    new Date(Date.now()),
    new Date(Date.now()),
  );
  return dto;
};

it('shoudl PASS if dto has properties otpCount and verified', async () => {
  const dto = generateUpdateCustomerDto();
  expect(dto).toHaveProperty('otpCount');
  expect(dto).toHaveProperty('verified');
});
it('shoudl PASS if otpCount is number and verified is boolean', async () => {
  const dto = generateUpdateCustomerDto();
  expect(typeof dto.otpCount).toBe('number');
  expect(typeof dto.verified).toBe('boolean');
});
