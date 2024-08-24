import { Injectable } from '@nestjs/common';
import { ICustOtpRepository } from '../../domain/repository/custOtpRepository.interface';
import { IMtnService } from '../../domain/services/mtn.service.interface';
import { SoapService } from './soap-client.service';

@Injectable()
export class MtnService implements IMtnService {
  constructor(
    private soapService: SoapService,
    private custOtpRepository: ICustOtpRepository,
  ) {}

  /*
  Call MTN Opt-In API through SoapService

  @Throws 
  Error(ResponseErrorMessages.RESPONSE_TIMEOUT)
  Error(ResponseErrorMessages.INVALID_HTTP_CODE)
  Error(ResponseErrorMessages.ERROR_PARSING_XML_RESPONSE_BODY)
  Error(errorResponse) from the <ns0:errorResponse> tag of MTN response
  */
  async optIn(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<{ approvalid: string; externalRequestId: string }> {
    const optInResponse = await this.soapService.mtnOptIn(
      msisdnCountryCode,
      msisdn,
    );
    const custOtp = await this.custOtpRepository.getByMsisdn(
      msisdnCountryCode,
      msisdn,
    );

    await this.custOtpRepository.update({
      ...custOtp,
      mtnApprovalId: optInResponse?.approvalid,
      mtnOptInReqId: optInResponse?.externalRequestId,
    });
    return optInResponse;
  }
}
