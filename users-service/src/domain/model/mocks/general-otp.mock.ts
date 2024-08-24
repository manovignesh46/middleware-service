import { OtpAction } from '../../enum/otp-action.enum';
import { IGeneralOtp } from '../general-otp.interface';

export const mockGeneralOtp: IGeneralOtp = {
  id: '115502d0-3461-4729-81f5-7b79a3c2a96e',
  customerId: 'customer123',
  otpValue: 'ABC-123456',
  otpAction: OtpAction.LOGIN,
  fullMsisdn: '+256999999999',
  failedAttempts: 0,
  expiredAt: undefined,
  sentAt: undefined,
  verifiedAt: undefined,
  lockedAt: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
  otpVerifiedKey: '',
  otpVerifiedKeyExpiredAt: undefined,
  otpSentCount: 0,
  otpSentLockedAt: null,
};
