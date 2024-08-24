export class ApplciationFeeJson {
  application_fee: string;
  application_fee_type: string;
  application_fee_min_amount: number;
  application_fee_max_amount: number;
  application_fee_tax_applicable: boolean;
  application_fee_short_disbursal: boolean;
  application_fee_tax_mode: null;
}

export class EligibleVariantDTO {
  no_of_installment: string;
  product_variant_id: string;
  product_variant_name: string;
  product_variant_type: string;
  product_variant_limit: number;
  product_variant_status: string;
  rate_of_interest: string;
  tenure: number;
  repayment_frequency: string;
  application_fee_json: ApplciationFeeJson;
}
