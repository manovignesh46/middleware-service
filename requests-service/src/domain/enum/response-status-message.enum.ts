export enum ResponseMessage {
  //General
  SUCCESS = 'Success',

  // submit
  SUBMIT_SUCCESS = 'Your loan application has been successfully submitted. You will shortly receive an SMS notification once school fees has been paid to school.',
  SUBMIT_FAILURE = 'We are sorry, you loan application request was not successful due to some technical issues. Please try after some time by selecting “Apply Now” from the dashboard screen.',

  //Repayment
  REPAYMENT_SUCCESS_PENDING = 'Loan repayment is under progress. Please check after some time.', //Repayment is pending USSD Confirmation
  REPAYMENT_FAILURE_PREVIOUS_PAYMENT_PENDING = 'Your previous payment is under progress, so you cannot do this repayment now.',
  REPAYMENT_FAILURE_GENERIC = 'Your repayment request cannot be completed now. Please retry after sometime.',
  REPAYMENT_FAILURE = 'Your request could not be completed due to insufficient funds. Please top up your mobile wallet and retry.',
  REPAYMENT_UPDATE_SUCCESS = 'Repayment status details received and updated successfully.',
  REPAYMENT_UPDATE_FAILURE = 'Request Id not found for this repayment transaction.',

  REPAYMENT_STATUS_SUCCESS = 'Loan repayment details available.',
  REPAYMENT_STATUS_PENDING = 'Please retry again, repayment status not updated yet.',
  REPAYMENT_STATUS_REJECTED = 'Loan repayment is rejected. Please check with your telco operator.',
  REPAYMENT_STATUS_FAILURE = 'No repayment request is available for this loan item.',

  //Loan Statements
  ACTIVE_LOANS_SUCCESS = 'Active Loans',
  NO_ACTIVE_LOANS = 'We are sorry. You dont have any active loans at the moment',

  //terminate loan
  LOAN_TERMINATED = 'Loan application is successfully terminated.',
  TERMINATE_LOAN_FAILURE = 'Failed to terminate loan',

  //FAQ
  FAQ_SUCCESS = 'FAQs details available.',

  //Policy Docs
  NO_POLICY_DOCS = 'No policy documents available',
  SOME_POLICY_DOCS = 'Some policy documents not available',

  //PDF
  GENERATE_PDF_SUCCESS = 'Loan statement PDF document is available for download',
  ERROR_GENERATING_PDF = 'Your request for this loan statement cannot be processed now. Please try after some time',
  LOAN_APPLICATION_PDF_SUCCESS = 'Loan application PDF document is available for download.',

  // IP Blacklisting
  NO_X_USER_IP_HEADER = 'No IP Address provided',
  COUNTRY_WHITELISTING_API_ERROR = 'Error connecting to source IP location resolver. Please try again later',
  COUNTRY_BLACKLISTED = 'Sorry, you are not allowed to transact on this App from your current location. Thanks for your interest in our products.',
}
