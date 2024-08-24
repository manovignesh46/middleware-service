import { ICustOtp } from '../../../../domain/model/custOtp.interface';

export class TriggerOtpServiceDto {
  constructor(
    public lead: ICustOtp,
    public dedupStatus: string,
    public isOtpExpired: boolean,
    public whiteListErrorMsg: string,
    public whiteListedJSON: any,
    public isOperatorRestricted: boolean,
    public telcoNotFound: boolean,
    public approvalId: string,
    public isOnboardingTerminated: boolean,
  ) {}
}
