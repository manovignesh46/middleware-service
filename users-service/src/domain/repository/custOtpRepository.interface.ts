import { ICustOtp } from '../model/custOtp.interface';

export abstract class ICustOtpRepository {
  abstract create(otp: ICustOtp): Promise<ICustOtp>;
  abstract getById(id: string): Promise<ICustOtp>;
  abstract getByMsisdn(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<ICustOtp>;
  abstract update(otp: ICustOtp): Promise<ICustOtp>;
  abstract findLeadByNinMsisdnEmail(
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
    email: string,
  ): Promise<ICustOtp[]>;
  abstract findLeadByFullMsisdnConcat(fullMsisdn: string): Promise<ICustOtp>;
  abstract findLeadByExReqIdApprovalIdFullMsisdn(
    mtnOptInReqId: string,
    mtnApprovalId: string,
    fullMsisdn: string,
  ): Promise<ICustOtp>;
  abstract findNonOnboardedLead(): Promise<ICustOtp[]>;
  abstract findLeadByMsisdnApprovalId(
    msisdnCountryCode: string,
    msisdn: string,
    mtnApprovalId: string,
  ): Promise<ICustOtp>;
  abstract findLeadForPurging(purgingHour: number): Promise<ICustOtp[]>;
  abstract updateCustOtpList(custOtpList: ICustOtp[]): Promise<ICustOtp[]>;
}
