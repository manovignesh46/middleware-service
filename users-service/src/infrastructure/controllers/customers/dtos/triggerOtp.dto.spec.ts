import { validate } from 'class-validator';
import { TriggerOtpDto } from './triggerOtp.dto';

export const generateMockTriggerOtpDto = () => {
  const dto = new TriggerOtpDto();
  dto.msisdn = '700000000';
  dto.msisdnCountryCode = '+256';
  dto.nationalIdNumber = 'nin123';
  dto.email = 'abc@abc.com';
  dto.preferredName = 'bryan';
  dto.deviceId = 'deviceId123';
  dto.deviceOs = 'deviceOs123';
  dto.deviceToken = 'deviceToken123';
  dto.schoolName = 'School123';

  return dto;
};

it('should FAIL when dto.msisdn is null ', async () => {
  const dto = generateMockTriggerOtpDto();
  dto.msisdn = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
// it('should FAIL when dto.otpType is null ', async () => {
//   const dto = generateMockTriggerOtpDto();
//   dto.otpType = null;
//   const errors = await validate(dto);
//   expect(errors.length).not.toBe(0);
// });
it('should FAIL when dto.preferredName is null ', async () => {
  const dto = generateMockTriggerOtpDto();
  dto.preferredName = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
it('should PASS when all properties valid ', async () => {
  const dto = generateMockTriggerOtpDto();
  const errors = await validate(dto);
  expect(errors.length).toBe(0);
});
