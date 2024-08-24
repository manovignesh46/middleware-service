import { FormType } from '../../enum/form-type.enum';
import { IFormData } from '../form-data.interface';

export const mockFormData: IFormData = {
  id: '123',
  customerId: 'cust123',
  fullMsisdn: '123456678',
  loanId: '555',
  typeId: '2',
  formData: `{
          "msisdn":"msisdn123",
          "referenceNumber":"ref12345678901",
          "applicationDateTime":"30 Feb 2020 11:22:48",
          "applicationStatus":"approved",
          "firstName":"John",
          "givenName":"Doe",
          "productName":"School loan",
          "variantMinLoanAmount":"100,000",
          "variantMaxLoanAmount":"1 million",
          "latePaymentFeePercent":"2.5",
          "schoolFeesAmount":"200,000",
          "arrangementFeesPercent":"2",
          "arrangementFeesAmount":"400",
          "governmentTaxesAmount":"500",
          "loanDurationPeriod":"weeks",
          "loanPeriod":"7",
          "loanInterestPercent":"5",
          "loanInterestAmount":"500",
          "totalAmountPayable":"10000",
          "installmentFrequency":"7",
          "installmentAmount":"500",
          "firstInstallmentDate":"01 Jan 2000",
          "lastInstallmentDate":"01 Jan 2001",
          "studentName":"Katumba",
          "studentRegistrationNumber":"999",
          "schoolName":"PegPAy school",
          "emis": [
            {
                "emi_amount": "2743.0",
                "emi_due_date": "2024-05-13"
            },
            {
                "emi_amount": "2743.0",
                "emi_due_date": "2024-05-20"
            },
            {
                "emi_amount": "2743.0",
                "emi_due_date": "2024-05-27"
            },
            {
                "emi_amount": "2743.0",
                "emi_due_date": "2024-06-06"
            }
        ]
          }`,
  formType: FormType.LOAN_APPLICATION_FORM,
  formStatus: undefined,
  s3Bucket: undefined,
  s3DocPath: undefined,
  s3PresignedUrl: 'your-presigned-url',
  s3UrlUpdatedAt: new Date(),
  requestCount: 1,
  createdBy: undefined,
  updatedBy: undefined,
  createdAt: undefined,
  updatedAt: undefined,
};
