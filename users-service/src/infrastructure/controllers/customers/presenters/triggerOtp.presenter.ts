import { ApiProperty } from '@nestjs/swagger';
import { ICustOtp } from '../../../../domain/model/custOtp.interface';

export class TriggerOtpPresenter {
  @ApiProperty()
  msisdn: string;

  @ApiProperty()
  msisdnCountryCode: string;

  @ApiProperty()
  otp: string;

  @ApiProperty()
  otpExpiry: Date;

  @ApiProperty()
  whitelisted: any;

  @ApiProperty()
  telcoDetails;

  constructor(lead: ICustOtp, telcoDetails, whitelistedJSON: any) {
    this.msisdn = lead.msisdn;
    this.msisdnCountryCode = lead.msisdnCountryCode;
    //extract first 3 digits of otp
    // if (lead.otp) {
    //   this.otp = lead.otp.slice(0, 3);
    // }
    this.whitelisted = whitelistedJSON;
    this.otp = lead.otp;
    this.otpExpiry = lead.otpExpiry;
    if (telcoDetails != null) {
      this.telcoDetails = telcoDetails;
    }
  }
}
