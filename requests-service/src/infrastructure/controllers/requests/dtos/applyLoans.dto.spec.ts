import { ApplyLoansDTO } from './applyLoans.dto';

export const generateMockApplyLoansDTO = () => {
  const dto = new ApplyLoansDTO();
  dto.aggregatorId = '1514';
  dto.currentOutStandingFees = 90000;
  dto.offerId = '123abhdkad';
  dto.studentPCOId = 'pco1231';

  return dto;
};

it('should have all the property', async () => {
  const dto: ApplyLoansDTO = generateMockApplyLoansDTO();
  expect(dto).toHaveProperty('aggregatorId');
  expect(dto).toHaveProperty('currentOutStandingFees');
  expect(dto).toHaveProperty('offerId');
  expect(dto).toHaveProperty('studentPCOId');
});
