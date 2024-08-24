import { validate } from 'class-validator';
import { DeleteStudentDetailsDTO } from './deleteStudentDetails.dto';

export const generateMockDeleteStudentDetailsDTO = () => {
  const dto = new DeleteStudentDetailsDTO();
  dto.studentId = '1514';
  dto.studentRegnNum = 'abcd';

  return dto;
};

it('should FAIL when dto.studentId is null ', async () => {
  const dto = generateMockDeleteStudentDetailsDTO();
  dto.studentId = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.studentRegnNum is null ', async () => {
  const dto = generateMockDeleteStudentDetailsDTO();
  dto.studentRegnNum = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
