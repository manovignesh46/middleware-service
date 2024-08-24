import { LeadStatus } from '../../enum/customer/leadStatus.enum';
import { OtpType } from '../../enum/customer/otpType.enum';
import { IBase } from '../base.interface';

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
  otpStatusAt: Date;
  otpSentAt: Date;
  otpExpiry: Date;
  leadCurrentStatus: LeadStatus;
  otpCount: number;
}
