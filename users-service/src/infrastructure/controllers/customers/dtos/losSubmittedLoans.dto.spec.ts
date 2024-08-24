import { SubmittedLoansLOS } from './losSubmittedLoans.dto';

export const generateSubmittedLoansDTO = () => {
  const dto: SubmittedLoansLOS = new SubmittedLoansLOS();
  dto.ProductVariantName = 'xyz';
  dto.creationDate = new Date();
  dto.loanAmount = 1244;
  dto.loanId = '12312';
  dto.loan_against_details = undefined;
  dto.loan_against_id = 'sdasdas';
  dto.productName = 'School loans';
  dto.rejectionCode = undefined;
  dto.rejectionReason = undefined;
  dto.schoolCode = 'M1231';
  dto.schoolName = 'sadasdas';
  dto.status = 'Good';
  dto.studentClass = '5';
  dto.studentName = 'John';
  dto.studentRegnNumber = 'Joen121';
  dto.variant_id = 123;

  return dto;
};

it('should have property', async () => {
  const dto: SubmittedLoansLOS = generateSubmittedLoansDTO();
  expect(dto).toHaveProperty('ProductVariantName');
  expect(dto).toHaveProperty('creationDate');
  expect(dto).toHaveProperty('loanAmount');
  expect(dto).toHaveProperty('loanId');
  expect(dto).toHaveProperty('loan_against_details');
  expect(dto).toHaveProperty('loan_against_id');
  expect(dto).toHaveProperty('productName');
  expect(dto).toHaveProperty('rejectionCode');
  expect(dto).toHaveProperty('rejectionReason');
  expect(dto).toHaveProperty('schoolCode');
  expect(dto).toHaveProperty('schoolName');
  expect(dto).toHaveProperty('status');
  expect(dto).toHaveProperty('studentClass');
  expect(dto).toHaveProperty('studentName');
  expect(dto).toHaveProperty('studentRegnNumber');
  expect(dto).toHaveProperty('variant_id');
});
