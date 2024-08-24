import { mockCustOtp } from '../../../../domain/model/mocks/cust-otp.mock';
import { MTNApprovalServiceDTO } from './mtnApprovalService.dto';

export const generateMockMTNApprovalServiceDTO = () => {
  const dto = new MTNApprovalServiceDTO(mockCustOtp, false, false);
  return dto;
};

it('should have property', async () => {
  const dto: MTNApprovalServiceDTO = generateMockMTNApprovalServiceDTO();
  expect(dto).toHaveProperty('custOtp');
  expect(dto).toHaveProperty('validationFailed');
  expect(dto).toHaveProperty('validationNotAvaiable');
});
