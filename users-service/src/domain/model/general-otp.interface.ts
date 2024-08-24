import { OtpAction } from '../enum/otp-action.enum';
import { IBase } from './base.interface';

export interface IGeneralOtp extends IBase {
  id: string;
  customerId: string;
  otpValue: string;
  otpAction: OtpAction;
  fullMsisdn: string;
  failedAttempts: number;
  otpSentCount: number;
  otpSentLockedAt: Date;
  expiredAt: Date;
  sentAt: Date;
  verifiedAt: Date;
  otpVerifiedKey: string;
  otpVerifiedKeyExpiredAt: Date;
  lockedAt: Date;
}
