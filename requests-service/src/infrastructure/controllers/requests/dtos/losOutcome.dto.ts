export class LOSOutcomeDTO {}

export class LOSApplyLoansDTO extends LOSOutcomeDTO {
  national_id_details: NationalIdDetails;
  selfie_liveness_details: SelfieLivenessDetails;
  comparison_results: ComparisonResults;
  ocr_mrz_comparison_results: OCR_MRZComparisonResults;
}

export class ComparisonResults {
  telco_nin_mrz_status: string;
  telco_name_mrz_status: string;
  telco_name_mrz_percent: string;
}

export class OCR_MRZComparisonResults {
  surname_result: string;
  givenname_result: string;
  dob_result: string;
  nin_result: string;
}

export class NationalIdDetails {
  ocrGivenName: string;
  ocrSurname: string;
  ocrNin: string;
  ocrDob: Date;
  ocrNINExpiry: string;
  mrzGivenName: string;
  mrzSurname: string;
  mrzNin: string;
  mrzDob: Date;
  mrzNINExpiry: string;
  editedGivenName: string;
  editedSurname: string;
  editedNin: string;
  editedDob: Date;
  editedNINExpiry: Date;
  frontsideImageS3Url: string;
  backsideImageS3Url: string;
  faceImageS3Url: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  district: string;
  countryOfResidence: string;
  addressType: string;
}

export class SelfieLivenessDetails {
  faceMatchScore: string;
  livenessScore: string;
  faceMatchStatus: string;
  livenessMatchStatus: string;
  faceMatchComparisonResult: string;
  livenessComparisonResult: string;
  selfieImagePreSignedS3URL: string;
  livenessVideoPreSignedS3URL: string;
}

export class LOSSubmitLoansDTO extends LOSOutcomeDTO {
  loan_against_id: string;
  amount: number;
  variant_id: string;
  loan_tenure: number;
  repayment_frequency: string;
  preferred_payment_day: string;
}
