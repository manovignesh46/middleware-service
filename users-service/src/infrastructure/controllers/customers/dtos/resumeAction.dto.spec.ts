import { ResumeActionDTO } from './resumeAction.dto';

export const generateMockResumeActionDTO = () => {
  const dto = new ResumeActionDTO();
  dto.msisdn = '123455667';
  dto.msisdnCountryCode = '+65';
  dto.opId = 1;

  return dto;
};

it('should have property', async () => {
  const dto: ResumeActionDTO = generateMockResumeActionDTO();
  expect(dto).toHaveProperty('msisdn');
  expect(dto).toHaveProperty('msisdnCountryCode');
  expect(dto).toHaveProperty('opId');
});
