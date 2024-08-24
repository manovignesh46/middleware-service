import { Injectable, Logger } from '@nestjs/common';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustOtpService } from '../domain/services/custOtpService.interface';
import { MTNConsentStatusDTO } from '../infrastructure/controllers/customers/dtos/mtnConsentStatus.dto';

@Injectable()
export class CustOtpService implements ICustOtpService {
  constructor(private readonly custOtpRepository: ICustOtpRepository) {}

  async mtnConsentStatus(
    mtnConsentStatusDTO: MTNConsentStatusDTO,
  ): Promise<boolean> {
    const custOtp: ICustOtp =
      await this.custOtpRepository.findLeadByExReqIdApprovalIdFullMsisdn(
        mtnConsentStatusDTO.externalRequestId,
        mtnConsentStatusDTO.approvalId,
        mtnConsentStatusDTO.msisdn,
      );
    if (custOtp) {
      custOtp.mtnValidationStatus = mtnConsentStatusDTO.validationResult;
      this.custOtpRepository.update(custOtp);
      return true;
    }

    return false;
  }

  private readonly logger = new Logger(CustOtpService.name);

  async findCustOTP(
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
    email: string,
  ): Promise<ICustOtp[]> {
    this.logger.log(this.findCustOTP.name);
    return await this.custOtpRepository.findLeadByNinMsisdnEmail(
      nationalIdNumber,
      msisdnCountryCode,
      msisdn,
      email,
    );
  }
}
