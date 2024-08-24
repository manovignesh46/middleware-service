import { MockData } from '../../../service/mockData';
import { LMSLoanCalculatorRespDTO } from './LMSLoanCalculatorResp.dto';

export const generateMockLMSLoanCalculatorRespDTO = () => {
  let dto = new LMSLoanCalculatorRespDTO();
  dto = MockData.loanCalculatorResp;

  return dto;
};

it('should have all the property', async () => {
  const dto: LMSLoanCalculatorRespDTO = generateMockLMSLoanCalculatorRespDTO();
  expect(dto).toHaveProperty('installments');
  expect(dto).toHaveProperty('interest_rate');
  expect(dto).toHaveProperty('emi_amount');
  expect(dto).toHaveProperty('tax_amount');
  expect(dto).toHaveProperty('application_fee');
  expect(dto).toHaveProperty('total_application_fee');
  expect(dto).toHaveProperty('loan_amount');
  expect(dto).toHaveProperty('loan_due_date');
  expect(dto).toHaveProperty('total_payable');
  expect(dto).toHaveProperty('interest_amount');
  expect(dto).toHaveProperty('variant_id');
  expect(dto).toHaveProperty('product_name');
});
