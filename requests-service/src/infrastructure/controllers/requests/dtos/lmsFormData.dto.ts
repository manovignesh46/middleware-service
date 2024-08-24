export class LMSFormData {
  msisdn: string;
  referenceNumber: string;
  applicationDateTime: Date;
  applicationStatus: string;
  firstName: string;
  givenName: string;
  productName: string;
  variantMinLoanAmount: number;
  variantMaxLoanAmount: number;
  latePaymentFeePercent: number;
  schoolFeesAmount: number;
  arrangementFeesPercent: number;
  arrangementFeesAmount: number;
  governmentTaxesAnmount: number;
  loanDurationPeriod: string;
  loanPeriod: number;
  loanInterestPercent: number;
  loanInterestAmount: number;
  totalAmountPayable: number;
  installmentFrequency: string;
  installmentAmount: number;
  firstInstallmentDate: Date;
  lastInstallmentDate: Date;
  studentName: string;
  studentRegistrationNumber: string;
  schoolName: string;
  emis: EMI[];
}

export class EMI {
  emi_due_date: any;
  emi_amount: string;
}
