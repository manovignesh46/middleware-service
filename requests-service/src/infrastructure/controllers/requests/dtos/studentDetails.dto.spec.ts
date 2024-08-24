import { StudentDetailsDTO } from './studentDetails.dto';

export const generateMockStudentDetailsDTO = () => {
  const dto = new StudentDetailsDTO();
  dto.studentId = 'd62f19ac-31f8-44cb-b112-250025827cec';
  dto.studentFullName = 'akelo';
  dto.studentGender = 'MALE';
  dto.studentClass = 'HOPE';
  dto.studentSchoolCode = '123';
  dto.studentSchoolRegnNumber = 'abcd';
  dto.schoolName = 'xyz';
  dto.associatedCustomerId = '2f1eb760-6755-4a05-bd80-a597078d438c';
  dto.currentSchoolFees = 90000;
  dto.studentPCOId = '647626593c80aa0684242856';
  dto.isLOSDeleted = false;

  return dto;
};

it('should have all the property', async () => {
  const dto: StudentDetailsDTO = generateMockStudentDetailsDTO();
  expect(dto).toHaveProperty('studentId');
  expect(dto).toHaveProperty('studentFullName');
  expect(dto).toHaveProperty('studentGender');
  expect(dto).toHaveProperty('studentClass');
  expect(dto).toHaveProperty('studentSchoolCode');
  expect(dto).toHaveProperty('studentSchoolRegnNumber');
  expect(dto).toHaveProperty('schoolName');
  expect(dto).toHaveProperty('associatedCustomerId');
  expect(dto).toHaveProperty('currentSchoolFees');
  expect(dto).toHaveProperty('studentPCOId');
  expect(dto).toHaveProperty('isLOSDeleted');
});
