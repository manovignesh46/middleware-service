import { RunWorkFlowDTO } from './runApiLOSOutcome.dto';
export const generateRunWorkdlowDto = () => {
  const dto = new RunWorkFlowDTO();
  dto.msisdn = '7656676567';
  dto.partner_code = 'yabxstaging_in';
  dto.product_type = 'installment';
  dto.workflow_name = 'Furaha - Onboarding Workflow';
  return dto;
};

it('should have property', async () => {
  const dto: RunWorkFlowDTO = generateRunWorkdlowDto();
  expect(dto).toHaveProperty('msisdn');
  expect(dto).toHaveProperty('partner_code');
  expect(dto).toHaveProperty('product_type');
  expect(dto).toHaveProperty('workflow_name');
});
