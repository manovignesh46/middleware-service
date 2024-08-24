import { ChecksumAlgorithm } from '@aws-sdk/client-s3';

export class LOSOutcomeDTO {}

export class LeadCreateDTO extends LOSOutcomeDTO {
  lead_id: string;
  name: string;
  NIN: string;
  email: string;
  lead_status: string;
  whitelisted: string;
  term_1_total_fee: number;
  term_2_total_fee: number;
  term_3_total_fee: number;
  all_terms_total_fee: number;
  last_payment_amount: number;
  last_payment_date: string;
  telco_op: string;
  whitelist_criteria: string;
}

export class MTNLeadVerifiedDTO extends LOSOutcomeDTO {
  lead_id: string;
  lead_status: string;
  kyc_status: boolean;
  kyc_status_reason: string;
  refinitiv_screening: RefinitivScreening;
}

export class LeadVerifiedDTO extends LOSOutcomeDTO {
  lead_id: string;
  lead_status: string;
  kyc_status: boolean;
  kyc_status_reason: string;
  telco_kyc_data: TelocKycData;
  refinitiv_screening: RefinitivScreening;
}

export class TelocKycData {
  telco_name: string;
  msisdn: string;
  national_id: string;
  first_name: string;
  last_name: string;
  given_name: string;
  dob: string;
  gender: string;
  registration_date: string;
  nationality: string;
}

export class RefinitivScreening {
  match: string;
}

export class MTNLeadEnhancedDTO extends LOSOutcomeDTO {
  lead_id: string;
  lead_status: string;
  lead_scoring_data: LeadScoringData;
  experian_details: any;
}

export class LeadEnhancedDTO extends LOSOutcomeDTO {
  lead_id: string;
  lead_status: string;
  lead_scoring_data: LeadScoringData;
  experian_details: any;
  telco_transactions_details: TelcoTransactionsDetails;
}

export class LeadScoringData {
  employment_type: string;
  active_bank_account: string;
  monthly_gross_income: string;
  years_in_current_place: string;
  number_of_school_kids: string;
  marital_status: string;
}

export class TelcoTransactionsDetails {
  msisdn: string;
  wallet_risk_score: number;
  loan_risk_score: number;
  churn_decile: number;
  spend_quartile: number;
  of_last_30d: number;
}

export class UpdateStudentDetailsDTO extends LOSOutcomeDTO {
  student_name: string;
  payment_gateway: string;
  school_code: string;
  student_code: string;
  school_name: string;
  student_class: string;
  student_gender: string;
  outstanding: Outstanding[];
  student_dob: string;
  student_paymentcode: string;
  student_ova: string;
  telco_ova: string;
}

export class Outstanding {
  Amount: string;
  is_computed_amount: boolean;
  Date: string;
  billername: string;
  minimum_payment_percent: string;
  minimum_payment_amount: string;
}

export class PineCreationDTO extends LOSOutcomeDTO {
  pin_created: boolean;
}
