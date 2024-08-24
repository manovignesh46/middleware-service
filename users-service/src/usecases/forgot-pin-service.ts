import { Injectable, Logger } from '@nestjs/common';
import { ICustIdCardDetails } from '../domain/model/custIdCardDetails.interface';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { IdType } from '../domain/model/user-device.interface';
import { ICustIdCardDetailsRepository } from '../domain/repository/custIdCardDetailsRepository.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { ICustTelcoRepository } from '../domain/repository/custTelcoRepository.interface';
import { IContentService } from '../domain/services/content.service.interface';
import {
  ForgotPinOtpTriggerDto,
  RegisterNewDeviceOtpTriggerDto,
} from '../infrastructure/controllers/customers/dtos/general-otp-trigger.dto';
import { GeneralOtpService } from '../infrastructure/services/general-otp.service';
import { SendNotificationDto } from '../infrastructure/services/notifiction-service-client/dto/send-notification.dto';
import { SourceMicroservice } from '../infrastructure/services/notifiction-service-client/enum/source-microservice.enum';
import { TargetType } from '../infrastructure/services/notifiction-service-client/enum/target-type.enum';
import { NotificationServiceClient } from '../infrastructure/services/notifiction-service-client/notifications-service-client.service';
import { PushNotificationService } from '../infrastructure/services/push-notification-service';
import { parseDate } from './helpers';

@Injectable()
export class ForgotPinService {
  private logger = new Logger(ForgotPinService.name);
  constructor(
    private readonly custPrimaryDetailsRepository: ICustPrimaryDetailsRepository,
    private readonly custIdCardDetailsRepository: ICustIdCardDetailsRepository,
    private readonly custTelcoRepository: ICustTelcoRepository,
    private readonly generalOtpService: GeneralOtpService,
    private readonly contentService: IContentService,
    private readonly notificationserviceClient: NotificationServiceClient,
    private readonly pushNotificationService: PushNotificationService,
  ) {}
  private async validateMsisdnDobNin(
    msisdnCountryCode: string,
    msisdn: string,
    dateOfBirth: string,
    nationalIdNumber: string,
  ): Promise<ICustPrimaryDetails | null> {
    const customer: ICustPrimaryDetails =
      await this.custPrimaryDetailsRepository.findByNinMsisdn(
        nationalIdNumber,
        msisdnCountryCode,
        msisdn,
      );
    if (!customer) {
      this.logger.log('No Matching Customer with NIN and Phone Number');
      return null;
    }
    const custTelcoKycDetails: ICustTelco =
      await this.custTelcoRepository.findByLeadId(customer.leadId);
    if (!custTelcoKycDetails) {
      this.logger.log(
        `No Customer Telco Details for this customer: ${customer.id}`,
      );
    }
    if (custTelcoKycDetails?.dob) {
      const parsedTelcoKycDob = parseDate(custTelcoKycDetails.dob);
      const parsedDob = parseDate(dateOfBirth);
      const isMatchingTelcoDob =
        parsedTelcoKycDob !== null && parsedTelcoKycDob.isSame(parsedDob);
      this.logger.log(
        `Input DOB: ${parsedDob.format(
          'DD-MM-YYYY',
        )}, Telco KYC DOB: ${parsedTelcoKycDob.format(
          'DD-MM-YYYY',
        )}, Match: ${isMatchingTelcoDob}`,
      );
      if (isMatchingTelcoDob) return customer;
      else return null; // Fail DOB comparison
    }
    const custIdCardDetails: ICustIdCardDetails =
      await this.custIdCardDetailsRepository.findByCustId(customer.id);
    if (!custIdCardDetails) {
      this.logger.warn(
        'Customer present but no DOB found in CustIdCardDetails Repo ',
      );
      return customer; //If no DOB in telco KYC / scanned card repos, ignore DOB
    }
    if (custIdCardDetails) {
      const { editedDOB, mrzDOB, parsedOcrDOB } = custIdCardDetails;
      let actualDob: Date = null;
      if (editedDOB) {
        actualDob = editedDOB;
      } else if (mrzDOB && parsedOcrDOB) {
        // dates match and are not null / undefined
        if (mrzDOB == parsedOcrDOB && mrzDOB && parsedOcrDOB)
          actualDob = custIdCardDetails.mrzDOB;
      }
      if (actualDob) {
        //Although actualDob is stored as a Date in DB, it is in YYYY-MM-DD format (not a date object)
        if (actualDob.toString() != dateOfBirth) {
          return null;
        }
      }
      return customer; // DOBs in custIdCardDetails either null or mrz does not match ocr DOBs
    }
  }
  async forgotPinOrRegisterNewDevice(
    dto: ForgotPinOtpTriggerDto | RegisterNewDeviceOtpTriggerDto,
  ) {
    this.logger.log(this.forgotPinOrRegisterNewDevice.name);
    const { nationalIdNumber, msisdnCountryCode, msisdn, dateOfBirth } = dto;

    const matchingCustomer = await this.validateMsisdnDobNin(
      msisdnCountryCode,
      msisdn,
      dateOfBirth,
      nationalIdNumber,
    );

    //send forgot pin incorrect details SMS
    if (!matchingCustomer) {
      const customerWithMatchingMsisdn =
        await this.custPrimaryDetailsRepository.findByMsisdn(
          msisdnCountryCode,
          msisdn,
        );
      if (customerWithMatchingMsisdn) {
        const content = await this.contentService.getForgotPinIncorrectDetails(
          customerWithMatchingMsisdn.preferredName,
        );

        const sendNotificationDto: SendNotificationDto = {
          target: msisdnCountryCode + msisdn,
          targetType: TargetType.PHONE_NUMBER,
          messageHeader: content.messageHeader,
          message: content.message,
          customerId: customerWithMatchingMsisdn.id,
          sourceMicroservice: SourceMicroservice.CUSTOMERS,
          priority: 9,
        };
        //send sms
        await this.notificationserviceClient.sendNotification(
          sendNotificationDto,
        );

        //Send Push Notification for Incorrect Profile Details
        const platformApplicationEndpoint =
          await this.pushNotificationService.getEndpointArnFromCustomerOrLeadId(
            IdType.CUSTOMER,
            customerWithMatchingMsisdn.id,
          );
        if (platformApplicationEndpoint) {
          const sendPushNotificationDto: SendNotificationDto = {
            target: platformApplicationEndpoint,
            targetType: TargetType.ENDPOINT_ARN,
            messageHeader: content.messageHeader,
            message: content.message,
            customerId: customerWithMatchingMsisdn.id,
            // fullMsisdn: msisdnCountryCode + msisdn,
            sourceMicroservice: SourceMicroservice.CUSTOMERS,
            priority: 9,
          };
          await this.notificationserviceClient.sendNotification(
            sendPushNotificationDto,
          );
        }
      }
      return null;
    }
    const fullMsisdn = msisdnCountryCode + msisdn;
    return this.generalOtpService.triggerOtp(
      matchingCustomer.id,
      fullMsisdn,
      dto.otpAction,
    );
  }
}
