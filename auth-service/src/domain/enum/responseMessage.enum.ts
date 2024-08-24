export enum ResponseMessage {
  //General
  SUCCESS = 'Success',
  FAIL = 'Failure',

  //reset pin
  RESET_PIN_SUCCESS = 'Reset Pin Success',
  COGNITO_SIGN_UP_SUCCESS = 'Credentials are valid',
  PIN_CONFIRM_PIN_MISTMATCH = 'PIN and Confirm PIN do not match. Please try again.',

  //Cognito Sign Up
  USERNAME_EXISTS = 'You seem to have an existing account with us. Please login.',
  LEAD_NOT_ENHANCED = 'Your mobile number is either not verified, or already onboarded',
  USER_NOT_FOUND = 'No Such User Found',

  //Cognito Login
  TRIGGER_LOGIN_SUCCESS = 'OTP has been sent to your registered mobile number',
  TRIGGER_LOGIN_FAIL = 'Invalid mobile number or PIN. Please enter valid values',
  LOGIN_LOCK = 'Hold on! You have made too many attempts. Try again in ${timeInMinutes} minutes',
  LOGIN_OPTOUT_OR_CLOSED = 'Account inactive. You will be contacted on how to activate your account.',

  //Cognito login OTP verify
  VERIFY_LOGIN_OTP_SUCCESS = 'OTP successfully verified',
  OTP_FAIL = 'Enter correct OTP received on SMS',
  OTP_EXPIRED = 'The entered OTP has expired. Please request a new OTP and try again',

  //logout
  LOGOUT_SUCCESS = 'Logout Success',

  //reset pin
  INVALID_TOKEN = 'Invalid Token',
  RESET_PIN_FAIL = 'Incorrect PIN',
  FORGOT_PIN_RESET_FAIL = 'PIN reset session has expired. Please try again',
  LOGOUT_FAIL = 'Logout unsuccessful. Make sure to send a valid refresh token',

  //Device Binding
  DEVICE_ALREADY_BOUND = 'This account is already bound to another device',
  REGISTER_NEW_DEVICE_OTP_VERIFICATION_KEY_FAIL = 'OTP Verified Key is either incorrect or expired',
  SIGNUP_DEVICE_ALREADY_BOUND = 'This device is already bound to another account',
  NO_OLD_DEVICE = 'Old Device ID not found',
  REGISTER_DEVICE_SUCCESS = 'New device registered',
  MATCHING_DEVICE_ID = 'Old device ID should not match new device ID',
}
