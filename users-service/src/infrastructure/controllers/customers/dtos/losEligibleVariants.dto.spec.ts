import { EligibleVariantDTO } from './eligibleVariants.dto';

export const generateLOSEligibleVariants = () => {
  const dto: EligibleVariantDTO = new EligibleVariantDTO();
  dto.tenure = 90;
  dto.rate_of_interest = '0.005';
  dto.no_of_installment = '4';
  dto.product_variant_id = '1674033014999';
  dto.repayment_frequency = 'monthly';
  dto.product_variant_name = 'NewInstallment';
  dto.product_variant_type = 'Installment';
  dto.product_variant_limit = 180000.0;
  dto.product_variant_status = 'Active';
  dto.application_fee_json = {
    application_fee: '100.0',
    application_fee_type: 'amount',
    application_fee_min_amount: 100,
    application_fee_max_amount: 10000,
    application_fee_tax_mode: null,
    application_fee_tax_applicable: false,
    application_fee_short_disbursal: true,
  };

  return dto;
};

it('should have property', async () => {
  const dto: EligibleVariantDTO = generateLOSEligibleVariants();
  expect(dto).toHaveProperty('tenure');
  expect(dto).toHaveProperty('rate_of_interest');
  expect(dto).toHaveProperty('no_of_installment');
  expect(dto).toHaveProperty('product_variant_id');
  expect(dto).toHaveProperty('repayment_frequency');
  expect(dto).toHaveProperty('product_variant_name');
  expect(dto).toHaveProperty('product_variant_type');
  expect(dto).toHaveProperty('product_variant_limit');
  expect(dto).toHaveProperty('product_variant_status');
  expect(dto).toHaveProperty('application_fee_json');
});
