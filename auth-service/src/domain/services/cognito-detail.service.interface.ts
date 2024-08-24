export abstract class ICognitoDetailService {
  abstract canLogin(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<boolean>;

  abstract incrementFailedAttempts(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<void>;

  abstract incrementOtpSentCount(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<void>;

  abstract resetFailedAttempts(msisdnCountryCode, msisdn): Promise<void>;

  abstract deleteCognitoCredentials(customerId: string): Promise<any>;
}
