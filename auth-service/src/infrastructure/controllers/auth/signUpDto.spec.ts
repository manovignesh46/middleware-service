import { validate } from 'class-validator';
import { SignUpDto } from './auth.dto';

export const generateMockTriggerOtpDto = () => {
  const dto = new SignUpDto();
  dto.msisdnCountryCode = '+256';
  dto.msisdn = '9999999999';
  dto.pin = '123123';
  dto.confirmPin = '123123';
  dto.email = 'abc@abc.com';
  dto.deviceId = 'deviceId123';
  return dto;
};

it('should FAIL when dto.phoneNumber is null ', async () => {
  const dto = generateMockTriggerOtpDto();
  dto.msisdnCountryCode = null;
  dto.msisdn = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
it('should FAIL when dto.pin is null ', async () => {
  const dto = generateMockTriggerOtpDto();
  dto.pin = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
it('should FAIL when dto.confirmPin is null ', async () => {
  const dto = generateMockTriggerOtpDto();
  dto.confirmPin = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
it('should FAIL when dto.pin is not 6 digits ', async () => {
  const dto = generateMockTriggerOtpDto();
  dto.pin = '1234567';
  let errors = await validate(dto);
  expect(errors.length).not.toBe(0);
  dto.pin = 'A12345';
  errors = await validate(dto);
  expect(errors.length).not.toBe(0);
  dto.pin = '12345';
  errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
it('should PASS when all properties are correct ', async () => {
  const dto = generateMockTriggerOtpDto();
  const errors = await validate(dto);
  console.log(errors);
  expect(errors.length).toBe(0);
});
