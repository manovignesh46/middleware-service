export enum ErrorMessage {
  //Trigger OTP
  OTP_NOT_EXPIRED = 'OTP not yet expired. Try to verify you existing OTP before triggering a new one',
  EXISTING_LEAD_WITH_DIFFERENT_NIN_OR_MSISDN = 'There is an existing OTP_VERIFIED lead with the same nin and different msisdn or vice versa',

  //OTP Error
  OTP_LOCK = `too many failed OTP attempts. You will be unable trigger a new OTP for now`,
  OTP_EXPIRED = 'OTP expired',
}
