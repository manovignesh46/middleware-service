import { LeadStatus } from '../../../../domain/enum/leadStatus.enum';

export class VerifyOtpServiceDto {
  constructor(
    public leadId: string,
    public leadStatus: LeadStatus,
    public isNINMatch: boolean,
    public preferredName: string,
    public verified: boolean,
    public otpCount: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
