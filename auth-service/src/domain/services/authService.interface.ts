import { ForgotPinResetDto } from '../../infrastructure/controllers/auth/dtos/forgot-pin-reset-password.dto';

export abstract class IAuthService {
  abstract registerPhoneNumber(
    msisdnCountryCode: string,
    msisdn: string,
    pin: string,
    confirmPin: string,
    deviceId: string,
    deviceName: string,
    email?: string,
  );
  abstract login(phoneNumber: string, pin: string, preferredName: string);
  abstract isLoginEligible(msisdnCountryCode: string, msisdn: string);
  abstract verifyLoginOtp(sessionId: string, phoneNumber: string, otp: string);
  abstract resetPin(
    accessToken: string,
    currentPin: string,
    newPin: string,
  ): Promise<boolean>;
  abstract logout(refreshToken: string): Promise<boolean>;
  abstract listUsersWithFullMsisdn(customerId: string): Promise<any>;
  abstract forgotPinResetPassword(dto: ForgotPinResetDto): Promise<boolean>;
  abstract adminDeleteUser(cognitoId: string): Promise<boolean>;
}
