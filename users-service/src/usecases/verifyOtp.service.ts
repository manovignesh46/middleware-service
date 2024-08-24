import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';
import { IdType } from '../domain/enum/id-type.enum';
import { LeadStatus } from '../domain/enum/leadStatus.enum';
import { MatchStatus } from '../domain/enum/matchStatus.enum';
import { TelcoOpType } from '../domain/enum/telcoOp.enum';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustTelcoRepository } from '../domain/repository/custTelcoRepository.interface';
import { IContentService } from '../domain/services/content.service.interface';
import { ICustRefinitivService } from '../domain/services/custRefinitivService.interface';
import { ICustTelcoService } from '../domain/services/custTelcoService.interface';
import { ICustToLMSService } from '../domain/services/custToLMSService.interface';
import { ICustToLOSService } from '../domain/services/custToLOSService.interface';
import { ITelcoService } from '../domain/services/telcoService.interface';
import { IVerifyOtpService } from '../domain/services/verifyOtp.interface';
import { ErrorMessage } from '../infrastructure/controllers/common/errors/enums/errorMessage.enum';
import { OtpExpiredError } from '../infrastructure/controllers/common/errors/otpExpired.error';
import { OtpLockedError } from '../infrastructure/controllers/common/errors/otpLocked.error';
import { VerifyOtpServiceDto } from '../infrastructure/controllers/customers/dtos/verifyOtpService.dto';
import { MockData } from '../infrastructure/services/mockData';
import { SendNotificationDto } from '../infrastructure/services/notifiction-service-client/dto/send-notification.dto';
import { SourceMicroservice } from '../infrastructure/services/notifiction-service-client/enum/source-microservice.enum';
import { TargetType } from '../infrastructure/services/notifiction-service-client/enum/target-type.enum';
import { NotificationServiceClient } from '../infrastructure/services/notifiction-service-client/notifications-service-client.service';
import { PushNotificationService } from '../infrastructure/services/push-notification-service';
import { getTimeToUnlockMinutes, parseDate } from './helpers';

@Injectable()
export class VerifyOtpService implements IVerifyOtpService {
  private otpMaxRetries: number;
  private otpCoolOffSeconds: number;
  private isMockCustTelcoData: boolean;
  constructor(
    private readonly leadsRepository: ICustOtpRepository,
    private readonly custToLOSService: ICustToLOSService,
    private readonly custTelcoService: ICustTelcoService,
    private readonly custTelcoRepository: ICustTelcoRepository,
    private readonly custRefinitiveService: ICustRefinitivService,
    private readonly telcoService: ITelcoService,
    private readonly notificationService: NotificationServiceClient,
    private configService: ConfigService,
    private readonly custToLMSService: ICustToLMSService,
    private readonly contentService: IContentService,
    private readonly notificationServiceClient: NotificationServiceClient,
    private readonly pushNotificationService: PushNotificationService,
  ) {
    this.otpMaxRetries = this.configService.get<number>(
      'REGISTER_OTP_MAX_RETRIES',
    );
    this.otpCoolOffSeconds =
      this.configService.get<number>('OTP_LOCKED_COOLOFF_SECONDS') || 7200;
    this.isMockCustTelcoData =
      this.configService.get('IS_MOCK_CUST_TELCO_DATA') === 'true';
  }

  private readonly logger = new Logger(VerifyOtpService.name);

  async verifyOtp(
    msisdnCountryCode: string,
    msisdn: string,
    otp: string,
  ): Promise<VerifyOtpServiceDto> {
    this.logger.log(this.verifyOtp.name);
    const lead = await this.leadsRepository.getByMsisdn(
      msisdnCountryCode,
      msisdn,
    );

    if (lead.leadCurrentStatus === LeadStatus.LEAD_ONBOARDED) {
      throw new Error(
        'Lead already onboarded. Please login using credentials.',
      );
    }
    if (lead.leadCurrentStatus === LeadStatus.OTP_NOT_SENT) {
      throw new Error('No OTP Sent For this User. Status is OTP_NOT_SENT');
    }

    if (lead.failedAttempts == this.otpMaxRetries) {
      const currentDateTime = Date.now();
      if (
        currentDateTime <
        lead.lockedAt.getTime() + this.otpCoolOffSeconds * 1000
      ) {
        const timeToUnlockMinutes = getTimeToUnlockMinutes(
          lead.lockedAt,
          this.otpCoolOffSeconds,
        );
        throw new OtpLockedError(ErrorMessage.OTP_LOCK, timeToUnlockMinutes);
      } else {
        lead.failedAttempts = 0;
        lead.lockedAt = null;
      }
    }

    if (Date.now() > lead.otpExpiry.getTime()) {
      throw new OtpExpiredError(ErrorMessage.OTP_EXPIRED);
    }

    const verified = lead.otp === otp;
    if (verified) {
      // Update to OTP_VERIFIED if this is the first time succesfully verifying OTP
      if (
        lead.leadCurrentStatus === LeadStatus.OTP_GENERATED ||
        lead.leadCurrentStatus === LeadStatus.OTP_FAILED
      ) {
        lead.leadCurrentStatus = LeadStatus.OTP_VERIFIED;
      }
      lead.failedAttempts = 0; //Reset counter to 0 after successful OTP verification
      lead.otpSentCount = 0;
      lead.otpSentLockedAt = null; //Unlock Otp sending
      lead.otpExpiry = new Date('1990-01-01'); //Expire OTP after successful OTP verification
    } else {
      // Set to OTP_FAILED if user has never succesfully verified OTP
      if (
        lead.leadCurrentStatus === LeadStatus.OTP_GENERATED ||
        lead.leadCurrentStatus === LeadStatus.OTP_FAILED
      ) {
        lead.leadCurrentStatus = LeadStatus.OTP_FAILED;
      }

      lead.failedAttempts += 1;
      if (lead.failedAttempts == this.otpMaxRetries) {
        lead.lockedAt = new Date();
      }
      const updatedLead = await this.leadsRepository.update(lead);
      return new VerifyOtpServiceDto(
        updatedLead.leadId,
        updatedLead.leadCurrentStatus,
        false,
        updatedLead.preferredName,
        verified,
        updatedLead.failedAttempts,
        updatedLead.createdAt,
        updatedLead.updatedAt,
      );
    }
    let updatedLead = await this.leadsRepository.update(lead);

    // LOS Lead Create
    if (updatedLead.leadCurrentStatus === LeadStatus.OTP_VERIFIED) {
      this.logger.log('LOS Lead Create');
      try {
        await this.custToLOSService.leadCreationInLOS(
          updatedLead.leadId,
          updatedLead.leadCurrentStatus,
        );
        //update customer status to LEAD_CREATED
        updatedLead = await this.leadsRepository.getById(updatedLead.leadId);
        updatedLead = await this.leadsRepository.update({
          ...updatedLead,
          leadCurrentStatus: LeadStatus.LEAD_CREATED,
        });
      } catch (err) {
        this.logger.error(err.stack);
        throw err;
      }
    }

    let custTelco: ICustTelco;
    const telcoOperatorCheck: boolean =
      this.configService.get<string>('TELCO-OPERATOR-CHECK') === 'true';

    //Get Telco KYC data from LOS if telco operator is MTN
    if (telcoOperatorCheck && updatedLead.telcoOp === TelcoOpType.MTN_UG) {
      this.logger.log('Calling LOS Customer Telco Endpoint');
      custTelco = await this.custToLMSService.getTelcoData(
        msisdnCountryCode,
        msisdn,
      );

      if (custTelco) {
        custTelco.idType = IdType.LEAD;
        custTelco.idValue = updatedLead.leadId;

        //NIN Comparison
        if (
          custTelco.nationalIdNumber && //Ensure NIN not null or undefined
          custTelco.nationalIdNumber == updatedLead.nationalIdNumber
        ) {
          custTelco.ninComparison = MatchStatus.MATCHED;
        } else {
          custTelco.ninComparison = MatchStatus.NOT_MATCHED;
        }

        custTelco = await this.custTelcoRepository.save(custTelco);
      }
    } else {
      this.logger.log('Calling Mock Server Telco Endpoint');
      // Non-MTN Telco, hit mock server and telco data will be sent to LOS on Lead Verified Step
      custTelco = await this.telcoService.findTelcoKYC(
        updatedLead.leadId,
        updatedLead.msisdnCountryCode,
        updatedLead.msisdn,
        updatedLead.nationalIdNumber,
      );
    }

    if (!custTelco) {
      this.logger.warn(
        `No Customer Telco Data found for: ${msisdnCountryCode + msisdn}`,
      );
      // Allow use of Mock Telco Data
      if (this.isMockCustTelcoData) {
        this.logger.warn(
          'Using mock Telco data as IS_MOCK_CUST_TELCO_DATA=true',
        );
        const mockCustTelco: ICustTelco = {
          ...MockData.mockCustTelcoEnitytData,
          idValue: updatedLead.leadId,
          createdAt: undefined,
          updatedAt: undefined,
          id: undefined,
        };
        custTelco = await this.custTelcoService.save(mockCustTelco);
      }
    }

    if (!custTelco || custTelco.ninComparison === MatchStatus.NOT_MATCHED) {
      updatedLead.isTerminated = true;
      updatedLead.terminationReason =
        'Telco NIN and User NIN does not match, hence declined.';
      await this.leadsRepository.update(updatedLead);
      this.custToLOSService.cancelOnboardingWorkflow(
        updatedLead.msisdnCountryCode,
        updatedLead.msisdn,
      );

      //Send Rejection SMS
      const { message: smsMessage, messageHeader } =
        await this.contentService.getOnboardingRejectedByFurahaMsg(
          updatedLead.preferredName,
          'National ID Number (NIN) mismatch',
        );

      const sendSmsNotificationDto: SendNotificationDto = {
        target: updatedLead.msisdnCountryCode + updatedLead.msisdn,
        targetType: TargetType.PHONE_NUMBER,
        messageHeader: messageHeader,
        message: smsMessage,
        customerId: null,
        sourceMicroservice: SourceMicroservice.CUSTOMERS,
        priority: 9,
      };

      this.notificationServiceClient.sendNotification(sendSmsNotificationDto);

      const pushNotificationEndpoint =
        await this.pushNotificationService.getEndpointArnFromCustomerOrLeadId(
          IdType.LEAD,
          updatedLead.leadId,
        );
      if (pushNotificationEndpoint) {
        const sendPushNotificationDto: SendNotificationDto = {
          target: pushNotificationEndpoint,
          targetType: TargetType.ENDPOINT_ARN,
          messageHeader: messageHeader,
          message: smsMessage,
          // fullMsisdn: updatedLead.msisdnCountryCode + updatedLead.msisdn
          // leadId: updatedLead.leadId
          customerId: null,
          sourceMicroservice: SourceMicroservice.CUSTOMERS,
          priority: 9,
        };
        this.notificationServiceClient.sendNotification(
          sendPushNotificationDto,
        );
      }

      return new VerifyOtpServiceDto(
        updatedLead.leadId,
        updatedLead.leadCurrentStatus,
        false,
        updatedLead.preferredName,
        verified,
        updatedLead.failedAttempts,
        updatedLead.createdAt,
        updatedLead.updatedAt,
      );
    }

    //Call Refinitive
    if (updatedLead.leadCurrentStatus === LeadStatus.LEAD_CREATED) {
      this.logger.log('Call Refinitive');

      const gender =
        custTelco.nationalIdNumber.charAt(1) === 'M' ? 'MALE' : 'FEMALE';
      let fullName: string =
        (custTelco?.firstName || '') +
        (custTelco?.middleName ? ' ' + custTelco?.middleName : '') +
        (custTelco?.lastName ? ' ' + custTelco?.lastName : '') +
        (custTelco && !custTelco.middleName && !custTelco.lastName
          ? ' ' + custTelco.givenName
          : '');
      fullName = fullName.trim();

      const custDob: Date = parseDate(custTelco.dob).toDate();
      await this.custRefinitiveService.findAndSaveRefinitiveData(
        true,
        lead.leadId,
        fullName,
        gender,
        moment(custDob).utc().format('YYYY-MM-DD'), //Expected format is YYYY-MM-DD
        'UGA', //Nationality is hardcoded because MTN doesn't provide it
      );

      updatedLead = await this.leadsRepository.getById(updatedLead.leadId);
      updatedLead = await this.leadsRepository.update({
        ...updatedLead,
        leadCurrentStatus: LeadStatus.SANCTION_DONE,
      });
      this.logger.log('REFINITIVE DONE');
    }

    // LOS Lead Verify
    if (updatedLead.leadCurrentStatus === LeadStatus.SANCTION_DONE) {
      try {
        await this.custToLOSService.leadVerifiedInLOS(updatedLead.leadId);

        //update customer status to LEAD_VERIFIED
        updatedLead = await this.leadsRepository.getById(updatedLead.leadId);
        updatedLead = await this.leadsRepository.update({
          ...updatedLead,
          leadCurrentStatus: LeadStatus.LEAD_VERIFIED,
        });

        custTelco.isDataSentToLOS = true;
        await this.custTelcoService.save(custTelco);
      } catch (err) {
        this.logger.error(err.stack);
        throw err;
      }
    }

    return new VerifyOtpServiceDto(
      updatedLead.leadId,
      updatedLead.leadCurrentStatus,
      true,
      updatedLead.preferredName,
      verified,
      updatedLead.failedAttempts,
      updatedLead.createdAt,
      updatedLead.updatedAt,
    );
  }
}
