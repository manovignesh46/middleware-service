import { LeadStatus } from '../enum/leadStatus.enum';
import { OtpType } from '../enum/otpType.enum';
import { IBase } from './base.interface';

export interface ICustOtp extends IBase {
  leadId: string;
  msisdnCountryCode: string;
  msisdn: string;
  preferredName: string;
  nationalIdNumber: string;
  email: string;
  otpType: OtpType;
  phoneStatus: boolean;
  emailStatus: boolean;
  otp: string;
  otpCreatedAt: Date;
  lockedAt: Date;
  otpSentAt: Date;
  otpExpiry: Date;
  leadCurrentStatus: LeadStatus;
  failedAttempts: number;
  otpSentCount: number;
  otpSentLockedAt: Date;
  targetApiUUID: string;
  outcomeApiUUID: string;
  isTerminated: boolean;
  terminationReason: string;
  whitelisted: string;
  whitelistedJSON: string;
  telcoOp: string;
  telcoUssdCode: string;
  telcoWallet: string;
  smsNextHours: number;
  mtnOptInReqId: string;
  mtnApprovalId: string;
  mtnValidationStatus: string;
  whitelistCriteria: string;
}
