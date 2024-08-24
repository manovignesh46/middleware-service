import { validate } from 'class-validator';
import { RetrieveStudentDetailsDto } from './retrieveStudentDetails.dto';

export const genertaeMockRetrieveStudentDetailsDto = () => {
  const dto = new RetrieveStudentDetailsDto();
  dto.aggregatorId = '1234';
  dto.schoolCode = '123';
  dto.studentRegnNumber = 'abcd';
  dto.msisdn = '1514';

  return dto;
};

it('should FAIL when dto.aggregatorId is null ', async () => {
  const dto = genertaeMockRetrieveStudentDetailsDto();
  dto.aggregatorId = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.studentRegnNumber is null ', async () => {
  const dto = genertaeMockRetrieveStudentDetailsDto();
  dto.studentRegnNumber = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.msisdn is null ', async () => {
  const dto = genertaeMockRetrieveStudentDetailsDto();
  dto.msisdn = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
