import { validate } from 'class-validator';
import { CreditScoreDto } from './creditScore.dto';

export const generateMockCreditScoreDto = () => {
  const dto = new CreditScoreDto();

  dto.employmentType = 'Salaried';
  dto.monthlyGrossIncome = '50000';
  dto.activeBankAccount = '1234567890';
  dto.numberOfSchoolKids = '10';
  dto.yearsInCurrentPlace = '7';
  dto.maritalStatus = 'married';
  dto.leadId = 'b929d538-a667-4989-9fa5-97ae46fc9d1f';
  return dto;
};

it('should FAIL when dto.employmentNature is null ', async () => {
  const dto = generateMockCreditScoreDto();
  dto.employmentType = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.monthlyGrossIncome is null ', async () => {
  const dto = generateMockCreditScoreDto();
  dto.monthlyGrossIncome = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.activeBankAccount is null ', async () => {
  const dto = generateMockCreditScoreDto();
  dto.activeBankAccount = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.numberOfSchoolKids is null ', async () => {
  const dto = generateMockCreditScoreDto();
  dto.numberOfSchoolKids = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.yearsInCurrentPlace is null ', async () => {
  const dto = generateMockCreditScoreDto();
  dto.yearsInCurrentPlace = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.maritalStatus is null ', async () => {
  const dto = generateMockCreditScoreDto();
  dto.maritalStatus = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.firstName is null ', async () => {
  const dto = generateMockCreditScoreDto();
  dto.leadId = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
