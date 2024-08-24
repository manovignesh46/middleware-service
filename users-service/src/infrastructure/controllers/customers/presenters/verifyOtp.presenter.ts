import { ApiProperty } from '@nestjs/swagger';
import { LeadStatus } from '../../../../domain/enum/leadStatus.enum';

export class VerifyOtpPresenter {
  @ApiProperty()
  leadId: string;

  @ApiProperty()
  leadStatus: LeadStatus;

  @ApiProperty()
  preferredName: string;

  @ApiProperty()
  msisdnCountryCode: string;

  @ApiProperty()
  msisdn: string;

  @ApiProperty()
  countCheck: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(
    leadId: string,
    leadStatus: LeadStatus,
    preferredName: string,
    msisdnCountryCode: string,
    msisdn: string,
    countCheck: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.leadId = leadId;
    this.leadStatus = leadStatus;
    this.preferredName = preferredName;
    this.msisdnCountryCode = msisdnCountryCode;
    this.msisdn = msisdn;
    this.countCheck = countCheck;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
