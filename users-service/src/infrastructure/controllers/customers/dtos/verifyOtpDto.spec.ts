import { validate } from 'class-validator';
import { VerifyOtpDto } from './verifyOtpDto';

describe('VerifyOtpDto', () => {
  it('should validate the DTO with valid properties', async () => {
    const dto = new VerifyOtpDto();
    dto.msisdnCountryCode = '+256';
    dto.msisdn = '1234567890';
    dto.otp = 'ABC-123456';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
