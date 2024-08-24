import { Injectable, Logger } from '@nestjs/common';
import { LeadStatus } from '../domain/enum/leadStatus.enum';
import { MatchStatus } from '../domain/enum/matchStatus.enum';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustRefinitiv } from '../domain/model/custRefinitiv.interface';
import { ICustScoringData } from '../domain/model/custScoringData.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustScoringDataRepository } from '../domain/repository/custScoringDataRepository.interface';
import { ICustRefinitivService } from '../domain/services/custRefinitivService.interface';
import { ICustScoringDataService } from '../domain/services/custScoringDataService.interface';
import { ICustTelcoService } from '../domain/services/custTelcoService.interface';
import { ICustToLOSService } from '../domain/services/custToLOSService.interface';
import { CreditScoreServiceDto } from '../infrastructure/controllers/customers/dtos/creditScoreService.dto';
import { IExperianDataRepository } from '../domain/repository/experian-data-repository.interface';
import { IdType } from '../domain/enum/id-type.enum';
import { IExperianData } from '../domain/model/experian-data.interface';
import { ExperianData } from './experianData';
import { ConfigService } from '@nestjs/config';
import { ICustTelcoTransactionRepository } from '../domain/repository/custTelcoTransactionRepository.interface';
import { ICustTelcoTransaction } from '../domain/model/custTelcoTransaction.interface';
import { TelcoTransactionResp } from '../infrastructure/controllers/customers/dtos/telcoTransactionResp.dto';
import { CustTelcoTransaction } from '../infrastructure/entities/custTelcoTransaction.entity';
import {
  IExperianService,
  KycEnquiryDto,
} from '../domain/services/experian-service.interface';
import { ITelcoService } from '../domain/services/telcoService.interface';
import { TelcoOpType } from '../domain/enum/telcoOp.enum';
import { SendNotificationDto } from '../infrastructure/services/notifiction-service-client/dto/send-notification.dto';
import { SourceMicroservice } from '../infrastructure/services/notifiction-service-client/enum/source-microservice.enum';
import { TargetType } from '../infrastructure/services/notifiction-service-client/enum/target-type.enum';
import { IContentService } from '../domain/services/content.service.interface';
import { NotificationServiceClient } from '../infrastructure/services/notifiction-service-client/notifications-service-client.service';
import { PushNotificationService } from '../infrastructure/services/push-notification-service';

@Injectable()
export class CustScoringDataService implements ICustScoringDataService {
  private isUseMockExperianData: boolean;
  constructor(
    private readonly custScoringDataRepository: ICustScoringDataRepository,
    private readonly custTelcoService: ICustTelcoService,
    private readonly custRefinitivService: ICustRefinitivService,
    private readonly custToLOSService: ICustToLOSService,
    private readonly custOtpRepository: ICustOtpRepository,
    private readonly experianDataRepository: IExperianDataRepository,
    private readonly configService: ConfigService,
    private readonly telcoService: ITelcoService,
    private readonly custTelcoTransactionRepository: ICustTelcoTransactionRepository,
    private readonly notificationService: NotificationServiceClient,
    private experianService: IExperianService,
    private notificationServiceClient: NotificationServiceClient,
    private contentService: IContentService,
    private pushNotificationService: PushNotificationService,
  ) {
    this.isUseMockExperianData =
      this.configService.get<string>('IS_MOCK_EXPERIAN_DATA') === 'true' ||
      false; //default do not use experian mock
  }

  private readonly logger = new Logger(CustScoringDataService.name);
  async findCustScoringData(
    leadId: string,
    custScoringData: ICustScoringData,
  ): Promise<CreditScoreServiceDto> {
    this.logger.log(this.findCustScoringData.name);
    let message: string;
    let status: string;
    let isTelcoKycMatch: boolean = null;
    let isSantionStatusMatch: boolean = null;

    const custOTP: ICustOtp = await this.custOtpRepository.getById(leadId);
    let custScore: ICustScoringData =
      await this.custScoringDataRepository.findByLeadId(leadId);

    if (custScore) {
      custScoringData.id = custScore.id;
    } else {
      custScoringData.leadId = leadId;
    }
    this.logger.log(custScoringData);
    custScore = await this.custScoringDataRepository.save(custScoringData);

    const custTelco: ICustTelco = await this.custTelcoService.findCustTelco(
      leadId,
    );

    if (custTelco) {
      if (custTelco.ninComparison === MatchStatus.MATCHED) {
        isTelcoKycMatch = true;
        const custRefinitiv: ICustRefinitiv =
          await this.custRefinitivService.findCustRefinitiv(leadId);

        if (custRefinitiv) {
          if (custRefinitiv.sanctionStatus === MatchStatus.NOT_MATCHED) {
            if (custOTP.leadCurrentStatus === LeadStatus.LEAD_VERIFIED) {
              const rejectionMsg: string =
                await this.custToLOSService.checkForRejection(leadId);
              if (!rejectionMsg) {
                isSantionStatusMatch = false;
                message =
                  'Both Telco NIN comparison and Refinitiv sanction checks passed';
                status = CustScoringDataStatusEnum.SUCCESS;
                await this.updateCustScoringLOS(
                  leadId,
                  custOTP,
                  custScoringData,
                );
              } else {
                // Rejection from LOS (Invalid Age / Nationality)
                message = rejectionMsg;
                status = CustScoringDataStatusEnum.ONBOARDING_CRITERIA_FAILED;
                this.custToLOSService.leadEnhancedInLOS(
                  leadId,
                  custScoringData,
                  null,
                  null,
                );
                custOTP.isTerminated = true;
                custOTP.terminationReason = rejectionMsg;
                await this.custOtpRepository.update(custOTP);
                await this.custToLOSService.cancelOnboardingWorkflow(
                  custOTP.msisdnCountryCode,
                  custOTP.msisdn,
                );
                //Send Rejection SMS
                const { message: smsMessage, messageHeader } =
                  await this.contentService.getOnboardingRejectedByFurahaMsg(
                    custOTP.preferredName,
                    'internal processes',
                  );

                const sendNotificationDto: SendNotificationDto = {
                  target: custOTP.msisdnCountryCode + custOTP.msisdn,
                  targetType: TargetType.PHONE_NUMBER,
                  messageHeader: messageHeader,
                  message: smsMessage,
                  customerId: null,
                  sourceMicroservice: SourceMicroservice.CUSTOMERS,
                  priority: 9,
                };

                this.notificationServiceClient.sendNotification(
                  sendNotificationDto,
                );

                //Send Rejection Push Notification
                const platformApplicationEndpoint =
                  await this.pushNotificationService.getEndpointArnFromCustomerOrLeadId(
                    IdType.LEAD,
                    custOTP.leadId,
                  );
                if (platformApplicationEndpoint) {
                  const sendPushNotificationDto: SendNotificationDto = {
                    target: platformApplicationEndpoint,
                    targetType: TargetType.ENDPOINT_ARN,
                    messageHeader: messageHeader,
                    message: smsMessage,
                    customerId: null,
                    // leadId: custOTP.leadId,
                    // fullMsisdn: custOTP.msisdnCountryCode + custOTP.msisdn,
                    sourceMicroservice: SourceMicroservice.CUSTOMERS,
                    priority: 9,
                  };
                  this.notificationServiceClient.sendNotification(
                    sendPushNotificationDto,
                  );
                }
              }
            }
          } else {
            //There is a Refinitiv Sanction Screening Hit
            isSantionStatusMatch = true;
            message = 'Refinitiv sanction has a match';
            status = CustScoringDataStatusEnum.SANCTION_SCREENING_FAILED;
            custOTP.isTerminated = true;
            custOTP.terminationReason = message;
            await this.custOtpRepository.update(custOTP);
            await this.custToLOSService.cancelOnboardingWorkflow(
              custOTP.msisdnCountryCode,
              custOTP.msisdn,
            );

            //Send Rejection SMS
            const { message: smsMessage, messageHeader } =
              await this.contentService.getOnboardingRejectedByFurahaMsg(
                custOTP.preferredName,
                'internal processes',
              );

            const sendNotificationDto: SendNotificationDto = {
              target: custOTP.msisdnCountryCode + custOTP.msisdn,
              targetType: TargetType.PHONE_NUMBER,
              messageHeader: messageHeader,
              message: smsMessage,
              customerId: null,
              sourceMicroservice: SourceMicroservice.CUSTOMERS,
              priority: 9,
            };

            this.notificationServiceClient.sendNotification(
              sendNotificationDto,
            );

            //Send Rejection Push Notification
            const platformApplicationEndpoint =
              await this.pushNotificationService.getEndpointArnFromCustomerOrLeadId(
                IdType.LEAD,
                custOTP.leadId,
              );
            if (platformApplicationEndpoint) {
              const sendPushNotificationDto: SendNotificationDto = {
                target: platformApplicationEndpoint,
                targetType: TargetType.PHONE_NUMBER,
                messageHeader: messageHeader,
                message: smsMessage,
                customerId: null,
                // fullMsisdn: custOTP.msisdnCountryCode + custOTP.msisdn,
                // leadId: custOTP.leadId,
                sourceMicroservice: SourceMicroservice.CUSTOMERS,
                priority: 9,
              };
              this.notificationServiceClient.sendNotification(
                sendPushNotificationDto,
              );
            }
          }
        } else {
          message = 'Sanction screening response not yet received';
          status = CustScoringDataStatusEnum.NO_SANCTION_SCREENING_DATA;
        }
      } else {
        isTelcoKycMatch = false;
        message = 'Telco NIN comparison failed';
        status = CustScoringDataStatusEnum.TELCO_KYC_FAILED;
      }
    } else {
      message = 'Telco KYC response not yet received';
      status = CustScoringDataStatusEnum.NO_TELCO_KYC_DATA;
    }

    return new CreditScoreServiceDto(
      leadId,
      status,
      message,
      isTelcoKycMatch,
      isSantionStatusMatch,
    );
  }

  async updateCustScoringLOS(
    leadId: string,
    custOTP: ICustOtp,
    custScoringData: ICustScoringData,
  ) {
    let experianDataJson = null;
    let telcoTransactionResp: TelcoTransactionResp = null;
    //Call experian asynchronously
    const kycDto: KycEnquiryDto = {
      idType: IdType.LEAD,
      idValue: leadId,
      nationalIdNumber: custOTP.nationalIdNumber,
      isConsent: true, //hardcode true for now
    };
    this.logger.log('Call Experian');
    await this.experianService.kycEnquiry(kycDto);
    this.logger.log('End Experian');

    const telcoOperatorCheck: boolean =
      this.configService.get<string>('TELCO-OPERATOR-CHECK') === 'true';

    if (!(telcoOperatorCheck && custOTP.telcoOp === TelcoOpType.MTN_UG)) {
      // call cust telcoTransaction data Asynchornously
      this.logger.log('Call Telco KYC');
      await this.telcoService
        .findTelcoTransaction(
          custOTP.leadId,
          custOTP.msisdnCountryCode,
          custOTP.msisdn,
        )
        .then(() => {
          this.logger.log('End Telco KYC');
        });
    }

    //retreive experian data from repo
    let experianData: IExperianData =
      await this.experianDataRepository.getByIdTypeIdValueAndIsActive(
        IdType.LEAD,
        leadId,
      );
    if (
      experianData?.experianData &&
      experianData.experianData !== 'MOCK_DATA'
    ) {
      experianDataJson = JSON.parse(experianData?.experianData)?.data;
    } else if (experianData?.experianData == 'MOCK_DATA') {
      experianDataJson = ExperianData.experian;
    } else {
      const warningMessage = 'No valid  experian data found for customer';
      this.logger.error(warningMessage);
      throw new Error(warningMessage);
    }
    this.logger.debug(experianDataJson);

    let custTelcoTransaction: ICustTelcoTransaction =
      await this.custTelcoTransactionRepository.findByLeadId(leadId);

    if (!custTelcoTransaction) {
      const warningMessage =
        'No valid Telco Transaction data found for customer';
      this.logger.warn(warningMessage);
      custTelcoTransaction = new CustTelcoTransaction();
      custTelcoTransaction.createdAt = new Date(
        Date.parse('2023-08-16T19:25:01.257Z'),
      );
      custTelcoTransaction.updatedAt = new Date(
        Date.parse('2023-08-16T19:25:01.257Z'),
      );
      custTelcoTransaction.idType = IdType.LEAD;
      custTelcoTransaction.idValue = leadId;
      custTelcoTransaction.telcoId = '1';
      custTelcoTransaction.transactionData = `{"id":1,"countrycode":${custOTP.msisdnCountryCode.replace(
        '+',
        '',
      )},"msisdn":${
        custOTP.msisdn
      },"wallet_risk_score":700,"loan_risk_score":700,"churn_decile ":1,"spend_quartile":1,"of_last_30d":130,"30d_of":140}`;
      custTelcoTransaction.isDataSentToLOS = false;
      custTelcoTransaction.isActive = true;

      this.custTelcoTransactionRepository.save(custTelcoTransaction);
    }
    telcoTransactionResp = JSON.parse(custTelcoTransaction?.transactionData);

    const isLOSSuccess = await this.custToLOSService.leadEnhancedInLOS(
      leadId,
      custScoringData,
      experianDataJson,
      telcoTransactionResp,
    );
    if (isLOSSuccess) {
      custOTP.leadCurrentStatus = LeadStatus.LEAD_ENHANCED;
      custOTP = await this.custOtpRepository.update(custOTP);

      if (experianData) {
        experianData.isDataSentToLOS = true;
        experianData = await this.experianDataRepository.update(experianData);
      }
      if (custTelcoTransaction) {
        custTelcoTransaction.isDataSentToLOS = true;
        custTelcoTransaction = await this.custTelcoTransactionRepository.update(
          custTelcoTransaction,
        );
      }
    }
  }
}

export enum CustScoringDataStatusEnum {
  SUCCESS = 'SUCCESS',
  TELCO_KYC_FAILED = 'TELCO_KYC_FAILED',
  SANCTION_SCREENING_FAILED = 'SANCTION_SCREENING_FAILED',
  ONBOARDING_CRITERIA_FAILED = 'ONBOARDING_CRITERIA_FAILED',
  NO_TELCO_KYC_DATA = 'NO_TELCO_KYC_DATA',
  NO_SANCTION_SCREENING_DATA = 'NO_SANCTION_SCREENING_DATA',
}
