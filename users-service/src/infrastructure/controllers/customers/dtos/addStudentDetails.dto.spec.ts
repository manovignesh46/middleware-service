import { Gender } from '../../../../domain/enum/gender.enum';
import { AddStudentDetailsDTO } from './addStudentDetails.dto';

export const generateMockAddStudentDetailsDto = () => {
  const dto = new AddStudentDetailsDTO();

  dto.studentId = '123456789';
  dto.studentName = 'John Desmond Doe';
  dto.schoolCode = '123';
  dto.schoolName = 'Furaha University';
  dto.studentRegnNumber = 'abcd';
  dto.studentClass = '1 HOPE';
  dto.studentGender = Gender.MALE;
  dto.aggregatorId = 'SCHOOL_PAY';
  dto.aggregatorIdNumber = 1;

  return dto;
};

it('should have property', async () => {
  const dto: AddStudentDetailsDTO = generateMockAddStudentDetailsDto();
  expect(dto).toHaveProperty('studentId');
  expect(dto).toHaveProperty('studentName');
  expect(dto).toHaveProperty('schoolCode');
  expect(dto).toHaveProperty('schoolName');
  expect(dto).toHaveProperty('studentRegnNumber');
  expect(dto).toHaveProperty('studentClass');
  expect(dto).toHaveProperty('studentGender');
  expect(dto).toHaveProperty('aggregatorId');
  expect(dto).toHaveProperty('aggregatorIdNumber');
});
