import { validate } from 'class-validator';
import { Gender } from '../../../../domain/enum/gender.enum';
import { ConfirmStudentDetailsDto } from './confirmStudentDetails.dto';

export const generateMockConfirmStudentDetailsDto = () => {
  const dto = new ConfirmStudentDetailsDto();

  dto.offerId = '1514';
  dto.studentName = 'John Desmond Doe';
  dto.schoolCode = '123';
  dto.schoolName = 'Furaha University';
  dto.studentRegnNumber = 'abcd';
  dto.studentClass = '1 HOPE';
  dto.studentGender = Gender.MALE;
  dto.currentOutstandingFee = 90000;
  dto.aggregatorId = '123';
  dto.aggregatorName = 'pegpay';

  return dto;
};

it('should FAIL when dto.offerId is null ', async () => {
  const dto = generateMockConfirmStudentDetailsDto();
  dto.offerId = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.studentName is null ', async () => {
  const dto = generateMockConfirmStudentDetailsDto();
  dto.studentName = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.schoolCode is null ', async () => {
  const dto = generateMockConfirmStudentDetailsDto();
  dto.schoolCode = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.schoolName is null ', async () => {
  const dto = generateMockConfirmStudentDetailsDto();
  dto.schoolName = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.studentRegnNumber is null ', async () => {
  const dto = generateMockConfirmStudentDetailsDto();
  dto.studentRegnNumber = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.studentClass is null ', async () => {
  const dto = generateMockConfirmStudentDetailsDto();
  dto.studentClass = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.studentGender is null ', async () => {
  const dto = generateMockConfirmStudentDetailsDto();
  dto.studentGender = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.currentOutstandingFee is null ', async () => {
  const dto = generateMockConfirmStudentDetailsDto();
  dto.currentOutstandingFee = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.aggregatorId is null ', async () => {
  const dto = generateMockConfirmStudentDetailsDto();
  dto.aggregatorId = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.aggregatorName is null ', async () => {
  const dto = generateMockConfirmStudentDetailsDto();
  dto.aggregatorName = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
