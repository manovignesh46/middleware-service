import { randomUUID } from 'crypto';
import { LeadStatus } from '../../enum/leadStatus.enum';
import { MTNValidationStatus } from '../../enum/mtn-validation-status.enum';
import { OtpType } from '../../enum/otpType.enum';
import { ICustOtp } from '../custOtp.interface';

// mockCustOtp and mockCustOtp2 are used in custDedupService Tests
const currDate: Date = new Date();
export const mockCustOtp: ICustOtp = {
  leadId: '286c78ce-a289-4a63-9d4a-7566c86ee4b1',
  msisdn: '7991140000',
  msisdnCountryCode: '+91',
  preferredName: 'Xyz',
  nationalIdNumber: '1234',
  email: 'abx@mgail.com',
  otp: 'ABC-123456',
  leadCurrentStatus: LeadStatus.LEAD_ONBOARDED,
  failedAttempts: 2,
  otpCreatedAt: currDate,
  lockedAt: null,
  createdAt: currDate,
  updatedAt: currDate,
  otpType: OtpType.SMS,
  phoneStatus: true,
  emailStatus: false,
  otpSentAt: new Date(Date.now()),
  otpExpiry: new Date(Date.now()),
  targetApiUUID: '',
  outcomeApiUUID: '',
  isTerminated: false,
  whitelisted: 'Y',
  whitelistedJSON: '{}',
  terminationReason: null,
  telcoOp: '',
  telcoUssdCode: '',
  telcoWallet: '',
  smsNextHours: 0,
  mtnOptInReqId: 'MtnRequestId123',
  mtnApprovalId: 'MtnApprovalId123',
  mtnValidationStatus: MTNValidationStatus.VALIDATION_SUCCESS,
  otpSentCount: 0,
  otpSentLockedAt: null,
  whitelistCriteria: '',
};

export const mockCustOtp2: ICustOtp = {
  ...mockCustOtp,
  msisdn: '7991140001',
};

// mockCustOtp3 is used in custOtpService and customers service tests
export const mockCustOtp3: ICustOtp = {
  leadId: randomUUID(),
  msisdnCountryCode: '+256',
  msisdn: '999999999',
  preferredName: 'John',
  nationalIdNumber: '999999999',
  email: 'John@Doe.com',
  otpType: OtpType.SMS,
  phoneStatus: false,
  emailStatus: false,
  otp: 'ABC-123123',
  otpCreatedAt: new Date(Date.now()),
  lockedAt: null,
  otpSentAt: new Date(Date.now()),
  otpExpiry: new Date(Date.now()),
  leadCurrentStatus: LeadStatus.OTP_GENERATED,
  failedAttempts: 0,
  createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now()),
  targetApiUUID: '',
  outcomeApiUUID: '',
  isTerminated: false,
  whitelisted: 'Y',
  whitelistedJSON: '',
  terminationReason: null,
  telcoOp: '',
  telcoUssdCode: '',
  telcoWallet: '',
  smsNextHours: 0,
  mtnOptInReqId: 'MtnRequestId123',
  mtnApprovalId: 'MtnApprovalId123',
  mtnValidationStatus: 'VALIDATION_SUCCESS',
  otpSentCount: 0,
  otpSentLockedAt: null,
  whitelistCriteria: '',
};
