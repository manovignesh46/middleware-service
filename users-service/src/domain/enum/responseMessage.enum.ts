export enum ResponseMessage {
  //General
  SUCCESS = 'Success',
  FAIL = 'FAIL',
  MATCHING_LEAD_FOUND = 'Matching Lead Found.',
  MATCHING_LEAD_NOT_FOUND = 'No Lead with matching msisdn found.',

  //Trigger OTP
  WIP = 'You application is in progress.',
  DEDUPE_MATCH = 'You profile already exists. Please login using your credentials',
  OTP_GENERATED = 'OTP successfully generated and sent to your mobile number',
  OTP_NOT_EXPIRED = 'Your previous OTP is not yet expired. Please verify using that OTP',
  WHITE_LISTED_NOT_PRESENT = 'No whiteListed entry present for this msisdn',
  WHITE_LISTED_ERROR = 'We appreciate you taking time to apply. However, this feature is not available for you at the moment. Your interest will be noted for consideration in the upcoming update, and you will be notified if it becomes available.',
  MSISDN_OR_NIN_MISMATCH = 'You must use the national ID number and phone number you used for your initial sign up',
  TELCO_NOT_FOUND = 'Consent Registration Required. Your mobile number is not yet registered at MTN Momo for data sharing. Please follow the below: (i ) Login to MTN Momo App (ii) Select Savings and Lending menu (iii) Select Furaha Menu to register. (iv) Enter MTN Momo PIN to verify.',
  MSISDN_OPERATOR_RESTRICTED = 'Your mobile number service provider is not supported currently. Thank you for your interest in our products.',
  DEDUPE_MATCH_OPTOUT_OR_CLOSED = 'Account inactive. You will be contacted on how to activate your account.',

  //General Trigger OTP
  NO_CUSTOMER_MATCHING_NIN_DOB_MSISDN = 'Oops! The details provided does not match our records. Please recheck values and try again',

  //Verify OTP
  VERIFICATION_FAIL = 'Enter correct OTP received on SMS',
  OTP_EXPIRED = 'The entered OTP has expired. Please request a new OTP and try again',
  VERIFICATION_SUCCESS = 'OTP successfully verified',
  OTP_LOCK = 'Hold on! You have made too many attempts. Try again in ${timeInMinutes} minutes',
  NIN_NOT_MATCHED = 'Telco NIN and User NIN does not match, hence declined.',

  //Cognito Signup
  USERNAME_EXISTS = 'You seem to have an existing account with us. Please login.',
  LEAD_NOT_ENHANCED = 'Your mobile number is either not verified, or already onboarded',
  CUSTOMER_DELETED = 'Customer Successfully Deleted',
  USER_NOT_FOUND = 'No Such User found',
  CUSTOMER_CREATED = 'Customer created',

  //Credit Score
  CREDIT_SCORE_SUCCESS = 'KYC checks and sanction screening verification completed successfully',
  CREDIT_SCORE_FAIL_KYC_MISMATCH = 'Telco KYC details do not match provided details',
  CREDIT_SCORE_FAIL_SANCTION_HIT = 'Declined due to internal policy.',
  CREDIT_SCORE_FAIL_MISSING_KYC = 'Telco KYC details are missing',
  CREDIT_SCORE_FAIL_MISSING_SANCTION = 'Sanction screening details are missing',
  TARGET_API_UUID_SUCCESS = 'Successfully retreived target API UUID',
  TARGET_API_UUID_FAIL = 'Target UUID is null',

  //Whitelisted School
  WHITELISTED_SCHOOL_SUCCESS = 'List of whitelisted schools available.',

  //Interserivce call
  ID_CARD_DETAILS_SUCCESS = 'Successfully Retrieved Id Card details for the given customer',
  ID_CARD_DETAILS_FAIL = 'Id Card missing for the customer',
  SELFIE_LIVENESS_SUCCESS = 'Successfully Retrieved the Selfie Liveness for the customer',
  SELFIE_LIVENESS_FAIL = 'Failed to retrieve the selfie Liveness for the customer',
  OFFER_DETAILS_SUCCESS = 'Successfully retrieved the offer details',
  OFFER_DETAILS_FAILURE = 'Failed to retrieve the offer details',
  STUDENT_DETAILS_SUCCESS = 'Successfully retrieved student details',
  STUDENT_DETAILS_FAIL = 'Failed to retrieve student details',
  WHITE_LISTED_NO_STUDENT = 'Student details are not available.',

  //id-scan
  ID_SCAN_SUCCESS = 'OCR and MRZ data matched',
  ID_SCAN_MISMATCH = 'Certain OCR and MRZ details do not match',
  ID_SCAN_EDITED_SUCCESS = 'Id Card Details Edited Successfully',
  SCANNED_NIN_TELCO_NIN_MISMATCH = 'The Scanned NIN does not match with the number from the Mobile Service provider.',

  //Retrieve Student Details
  RETRIEVE_STUDENT_DETAILS_SUCCESS = 'Student details retrieved successfully.',
  RETRIEVE_STUDENT_DETAILS_FAIL = 'Student details are not available',
  SCHOOL_AGGREGATOR_DOWN = 'Your request could not be completed at this time. Please try again after some time.',
  STUDENT_SCHOOL_NAME_MISMATCH = 'You can only take loan for a student associated with ${selected_school_name} as you selected during onboarding.',
  //CONFIRM STUDENT DETAILS
  CONFIRM_STUDENT_DETAILS_SUCCESS = 'Student details saved successfully.',
  CONFIRM_STUDENT_DETAILS_WIP = 'Student details are not saved.',

  PROFILE_PERSONAL = 'Personal details available.',
  //Address
  GET_ADDRESS_SUCCESS = 'Successfully Retreived Address Details',
  ADDRESS_NOT_AVAILABLE = 'Address details not available.',

  //Update Customer
  UPDATE_CUSTOMER_SUCCESS = 'Successfully updated customer',

  //Verify OTP Key
  VERIFY_OTP_KEY_FAIL = 'Verification failed, key is either wrong or expired',

  WHITELISTED_STUDENT_DELETED = 'Student details successfully deleted.',
  WHITELISTED_STUDENT_NOT_DELETED = 'Student details not deleted.',
  WHITELISTED_STUDENT_ADDED = 'Student details successfully saved.',
  WHITELISTED_STUDENT_ADD_FAILED = 'Duplicate. This student record already exists',

  //Country IP Whitelisting
  COUNTRY_WHITELISTING_API_ERROR = 'Error connecting to source IP location resolver. Please try again later',
  COUNTRY_NOT_WHITELISTED = 'Sorry, you cannot register or apply for a new product from your current location. Thanks for your interest in our products',
  NO_X_USER_IP_HEADER = 'No IP Address provided',

  WHITE_LISTED_IP_SUCCESS = 'Request originated from the allowed country.',

  //EKYC
  EKYC_SUCCESS = 'eKYC states details retrieved.',

  //RESUME ONBOARDING
  RESUME_ONBOARDING_SUCCESS = 'Onboarding can be resumed. OTP is generated successfully and sent to the given mobile number.',
  RESUME_ONBOARDING_DEDUP_MATCH = 'Your profile is already available. Please login using your credentials.',

  // selfie check
  SELFIE_CHECK_SUCCESS = 'Selfie Check Done Successfully.',
  SELFIE_CHECK_FAILURE = 'Thank you for your application. Unfortunately, we are not able to proceed with your request due to our internal processes. Thank you for your interest.',

  SUPPORT_TICKET_SUCCESS = 'Received your request for support. You will be notified within 48 hours.',
  SUPPORT_TICKET_EMAIL_ALREADY_PRESENT = 'Entered email is already in use. Please provide another email Id.',
  SUPPORT_TICKET_FILE_SIZE_EXCEEDED = 'Total File size exceeded. Please keep under 40MB.',
  SUPPORT_TICKET_LIST_SUCCESS = 'Support requests available.',
  SUPPORT_TICKET_LIST_UNAVAILABLE = 'You do not have any requests for support.',

  MTN_SUCCESS_CONSENT = 'MTN consent data received successfully.',
  MTN_FAILURE_CONSENT = 'Msisdn and approval id does not exist on MW side.',
  //MTN APPROVAL
  MTN_APPROVAL_PIN_FAILURE = 'Consent PIN validation failed.',
  MTN_APPROVAL_PIN_NOT_AVAILABLE = 'Consent PIN status not available yet.',
  MTN_APPROVAL_PINT_INVALID_INPUT = 'Invalid input values.',
  //MTN Opt-In Flow
  MTN_OPT_IN_TRIGGERED = 'Consent approval id available.',

  REGISTER_TOKEN_SUCCESS = 'Device token registered successfully.',

  //MTN OPT OUT
  MTN_OPT_OUT_NON_MTN = 'Opt-out is not allowed for this telco subscriber.',
  MTN_OPT_OUT_INVALID_USER = 'Invalid authentication and hence opt-out is not allowed.',
  MTN_OPT_OUT_SUCCESS = 'You are successfully opted-out.',
  MTN_OPT_OUT_NETWORK_FAILURE = 'Your opt-out request could not be completed now. Please retry after sometime.',
  MTN_OPT_OUT_PENDING = 'Your opt-out request is submitted.',
  MTN_OPT_OUT_FAILURE = 'Your request for Opt-Out had failed. Please contact your telco provider for further details.',
  MTN_OPT_OUT_LOANS_PRESENT = 'Sorry, you will need to first pay off your outstanding loans to opt-out from Furaha.',

  //Dashboard
  DASHBOARD_REJECTION = 'We are sorry, you are not eligible for loan product at the moment. Thanks for your interest in our product.',
}
