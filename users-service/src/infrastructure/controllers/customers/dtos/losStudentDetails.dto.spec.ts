import { LOSStudentDetailsDto } from './losStudentDetails.dto';

export const generateLOSStudentDetailsDto = () => {
  const dto = new LOSStudentDetailsDto(
    '',
    '',
    '1514',
    'qwerrty',
    new Date(Date.parse('2023-04-08T20:29:40.521Z')),
  );

  return dto;
};

it('should have property', async () => {
  const dto: LOSStudentDetailsDto = generateLOSStudentDetailsDto();
  expect(dto).toHaveProperty('custId');
  expect(dto).toHaveProperty('losRefNumber');
  expect(dto).toHaveProperty('studentId');
  expect(dto).toHaveProperty('studentPCOId');
  expect(dto).toHaveProperty('createdAt');
});
