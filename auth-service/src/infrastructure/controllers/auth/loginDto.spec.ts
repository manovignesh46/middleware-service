import { validate } from 'class-validator';
import { LoginDto } from './auth.dto';

export const generateMockDto = () => {
  const dto = new LoginDto();
  dto.msisdnCountryCode = '+256';
  dto.msisdn = '999999999';
  dto.pin = '123123';
  dto.deviceId = 'deviceId123';
  return dto;
};

it('should FAIL when dto.phoneNumber is null ', async () => {
  const dto = generateMockDto();
  dto.msisdnCountryCode = null;
  dto.msisdn = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
it('should FAIL when dto.pin is null ', async () => {
  const dto = generateMockDto();
  dto.pin = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
it('should FAIL when dto.pin is not 6 digits ', async () => {
  const dto = generateMockDto();
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
  const dto = generateMockDto();
  const errors = await validate(dto);
  console.log(errors);
  expect(errors.length).toBe(0);
});
