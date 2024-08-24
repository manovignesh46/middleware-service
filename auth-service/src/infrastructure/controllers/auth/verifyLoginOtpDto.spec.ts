import { validate } from 'class-validator';
import { VerifyLoginOtpDto } from './auth.dto';

export const generateMockDto = () => {
  const dto = new VerifyLoginOtpDto();
  dto.msisdnCountryCode = '+256';
  dto.msisdn = '999999999';
  dto.sessionId = '123';
  dto.otp = '123123';
  return dto;
};

it('should FAIL when dto.phoneNumber is null ', async () => {
  const dto = generateMockDto();
  dto.msisdnCountryCode = null;
  dto.msisdn = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
it('should FAIL when dto.otp is null ', async () => {
  const dto = generateMockDto();
  dto.otp = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
it('should FAIL when dto.sessionId is null ', async () => {
  const dto = generateMockDto();
  dto.sessionId = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
it('should PASS when all properties are correct ', async () => {
  const dto = generateMockDto();
  const errors = await validate(dto);
  console.log(errors);
  expect(errors.length).toBe(0);
});
