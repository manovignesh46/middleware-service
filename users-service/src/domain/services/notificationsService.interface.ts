import { OtpType } from '../enum/otpType.enum';

export abstract class INotificationService {
  abstract sendOTPSms(
    preferredName: string,
    otp: string,
    otpType: OtpType,
    msisdnCountryCode: string,
    msisdn: string,
  );
  abstract sendOTPEmail(otp: string, otpType: string, recipientEmail: string);
}
