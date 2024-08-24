import { Injectable, Logger } from '@nestjs/common';
import { DedupStatus } from '../domain/enum/dedupStatus.enum';
import { LeadStatus } from '../domain/enum/leadStatus.enum';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { ICustDedupRepository } from '../domain/repository/custDedupRespository.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustDedupService } from '../domain/services/custDedupService.interface';
import { ICustOtpService } from '../domain/services/custOtpService.interface';
import { ICustPrimaryDetailsService } from '../domain/services/custPrimaryDetailsService.interface';
import { ErrorMessage } from '../infrastructure/controllers/common/errors/enums/errorMessage.enum';
import { CustDedup } from '../infrastructure/entities/custDedup.entity';
import { ClientStatus } from '../domain/enum/clientStatus.enum';

@Injectable()
export class CustDedupService implements ICustDedupService {
  constructor(
    private readonly custDedupRepository: ICustDedupRepository,
    private readonly custOtpService: ICustOtpService,
    private readonly custOtpRespository: ICustOtpRepository,
    private readonly custPrimaryDetailsService: ICustPrimaryDetailsService,
  ) {}

  private readonly logger = new Logger(CustDedupService.name);

  async checkWIPDedup(
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
    email: string,
  ): Promise<{ responseStatus: DedupStatus; custOtp: ICustOtp | undefined }> {
    this.logger.log(this.checkWIPDedup.name);

    let responseStatus: DedupStatus = DedupStatus.DEDUP_NO_MATCH;

    const custOtpList: ICustOtp[] = await this.custOtpService.findCustOTP(
      nationalIdNumber,
      msisdnCountryCode,
      msisdn,
      email,
    );

    if (custOtpList !== null && custOtpList.length !== 0) {
      responseStatus = DedupStatus.WIP;
      for await (let custOtp of custOtpList) {
        //If there are existing entries with same msisdn and diff nin or vice versa
        if (
          (custOtp.msisdnCountryCode + custOtp.msisdn !==
            msisdnCountryCode + msisdn ||
            custOtp.nationalIdNumber !== nationalIdNumber) &&
          nationalIdNumber !== null //NIN is null for triggerOtpService.resumeAction
        ) {
          //If otp not verified, terminate existing and create new entries
          if (
            custOtp.leadCurrentStatus === LeadStatus.OTP_NOT_SENT ||
            custOtp.leadCurrentStatus === LeadStatus.OTP_FAILED ||
            custOtp.leadCurrentStatus === LeadStatus.OTP_GENERATED
          ) {
            this.logger.log(
              `System Terminating lead ${custOtp.leadId} due to new OTP triggered with same nin and different msisdn or vice versa`,
            );
            custOtp.isTerminated = true;
            custOtp.terminationReason =
              'System terminated due to OTP not verified and new OTP triggered with same nin and different msisdn or vice versa';
            custOtp = await this.custOtpRespository.update(custOtp);
            responseStatus = await this.checkDedupInternal(
              null,
              nationalIdNumber,
              msisdnCountryCode,
              msisdn,
              email,
            );
            //there exists a lead who already verified msisdn and nin
          } else if (
            custOtp.leadCurrentStatus !== LeadStatus.LEAD_ONBOARDED //Ignore if lead is already onboarded
          ) {
            this.logger.warn(
              ErrorMessage.EXISTING_LEAD_WITH_DIFFERENT_NIN_OR_MSISDN,
            );
            throw new Error(
              ErrorMessage.EXISTING_LEAD_WITH_DIFFERENT_NIN_OR_MSISDN,
            );
          }
        }
        if (LeadStatus.LEAD_ONBOARDED === custOtp.leadCurrentStatus) {
          // lead already converted to customer
          responseStatus = await this.checkDedupInternal(
            custOtp.leadId,
            nationalIdNumber,
            msisdnCountryCode,
            msisdn,
            email,
          );
          if (responseStatus === DedupStatus.DEDUP_NO_MATCH) {
            this.logger.warn(
              'Lead has onboarded status but not onboarded as customer. Lead Id: ' +
                custOtp.leadId,
            );
            throw new Error(
              'Lead onboarded status but not onboarded as customer.',
            );
          }
        }
      }
    } else {
      responseStatus = await this.checkDedupInternal(
        null,
        nationalIdNumber,
        msisdnCountryCode,
        msisdn,
        email,
      );
    }

    if (responseStatus === DedupStatus.WIP)
      return { responseStatus: responseStatus, custOtp: custOtpList[0] };
    return { responseStatus: responseStatus, custOtp: undefined };
  }

  async checkDedupInternal(
    leadId: string,
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
    email: string,
  ): Promise<DedupStatus> {
    let dedupStatus: DedupStatus = DedupStatus.DEDUP_NO_MATCH;
    const custPrimaryDetailsList: ICustPrimaryDetails[] =
      await this.custPrimaryDetailsService.findCustPrimaryDetails(
        nationalIdNumber,
        msisdnCountryCode,
        msisdn,
        email,
      );

    if (
      custPrimaryDetailsList === null ||
      custPrimaryDetailsList.length === 0
    ) {
      dedupStatus = DedupStatus.DEDUP_NO_MATCH;
    } else {
      let optOutDone = false;
      for await (const custPrimaryDetails of custPrimaryDetailsList) {
        if (
          ClientStatus.OPTOUT === custPrimaryDetails.clientStatus ||
          ClientStatus.CLOSED === custPrimaryDetails.clientStatus
        ) {
          dedupStatus = DedupStatus.DEDUP_MATCH_OPTOUT_OR_CLOSED;
          optOutDone = true;
          break;
        }
      }

      if (!optOutDone) dedupStatus = DedupStatus.DEDUP_MATCH;
    }
    const custDedup: CustDedup = new CustDedup(
      leadId,
      'DDREF-' + Date.now(),
      dedupStatus,
      msisdnCountryCode,
      msisdn,
      nationalIdNumber,
      email,
    );

    this.custDedupRepository.create(custDedup);
    return dedupStatus;
  }
}
