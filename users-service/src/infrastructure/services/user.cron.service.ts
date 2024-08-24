import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ICustPrimaryDetails } from '../../domain/model/custPrimaryDetails.interface';
import { ICustPrimaryDetailsRepository } from '../../domain/repository/custPrimaryDetailsRepository.interface';
import { SendNotificationDto } from './notifiction-service-client/dto/send-notification.dto';
import { SourceMicroservice } from './notifiction-service-client/enum/source-microservice.enum';
import { TargetType } from './notifiction-service-client/enum/target-type.enum';
import { NotificationServiceClient } from './notifiction-service-client/notifications-service-client.service';
import { ICustOtpRepository } from '../../domain/repository/custOtpRepository.interface';
import { ICustOtp } from '../../domain/model/custOtp.interface';
import { ICustRefinitivRepository } from '../../domain/repository/custRefinitivRepository.interface';
import { ICustRefinitiv } from '../../domain/model/custRefinitiv.interface';
import { IRefinitiveService } from '../../domain/services/refinitiveService.interface';
import { ICustTelcoRepository } from '../../domain/repository/custTelcoRepository.interface';
import { ICustTelco } from '../../domain/model/custTelco.interface';
import { ICustToLMSService } from '../../domain/services/custToLMSService.interface';
import { PushNotificationService } from './push-notification-service';
import { IdType } from '../../domain/model/user-device.interface';

@Injectable()
export class UserCronService {
  private readonly logger = new Logger(UserCronService.name);

  public SCHEDULE_REMINDER_FIRSTLOAN: string;
  public SCHEDULE_REMINDER_ONBOARD_DAYS: string;
  public SCHEDULE_JOB_REFINITIVE_RESOLUTION: string;
  public SCHEDULE_PII_PURGE_FREQUENCY: string;
  public ONBOARDING_REMINDERS_FREQUENCY_HOURS: string[];
  public APPROVED_LOANLIMIT_REMINDERS_FREQUENCY_HOURS: string[];
  public ACTIVATE_APPROVED_LOAN_LIMIT_REMINDER: boolean;
  public ACTIVATE_REFINITIVE_RESOLUTION: boolean;
  public ACTIVATE_ONBOARDING_REMINDER: boolean;
  public ACTIVATE_PII_PURGING: boolean;
  public AUTO_TERMINATION_ONBOARDING_CUSTOMER_HOUR: number;

  public PII_PURGE_THRESHOLD: number;

  constructor(
    private readonly custPrimaryDetailsRepo: ICustPrimaryDetailsRepository,
    private readonly custOtpRepo: ICustOtpRepository,
    private schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationServiceClient,
    private readonly custRefinitiveRepo: ICustRefinitivRepository,
    private readonly refinitiveService: IRefinitiveService,
    private readonly custTelcoRepository: ICustTelcoRepository,
    private readonly custToLMSService: ICustToLMSService,
    private readonly pushNotificationService: PushNotificationService,
  ) {
    this.SCHEDULE_REMINDER_FIRSTLOAN = this.configService.get<string>(
      'SCHEDULE_REMINDER_FIRSTLOAN',
    );
    this.SCHEDULE_REMINDER_ONBOARD_DAYS = this.configService.get<string>(
      'SCHEDULE_REMINDER_ONBOARD_DAYS',
    );
    this.SCHEDULE_JOB_REFINITIVE_RESOLUTION = this.configService.get<string>(
      'SCHEDULE_JOB_REFINITIVE_RESOLUTION',
    );

    this.SCHEDULE_PII_PURGE_FREQUENCY = this.configService.get<string>(
      'SCHEDULE_PII_PURGE_FREQUENCY',
    );

    this.ACTIVATE_ONBOARDING_REMINDER =
      this.configService.get<string>('ACTIVATE_ONBOARDING_REMINDER') ===
        'true' || false;

    this.ACTIVATE_APPROVED_LOAN_LIMIT_REMINDER =
      this.configService.get<string>(
        'ACTIVATE_APPROVED_LOAN_LIMIT_REMINDER',
      ) === 'true' || false;

    this.ACTIVATE_REFINITIVE_RESOLUTION =
      this.configService.get<string>('ACTIVATE_REFINITIVE_RESOLUTION') ===
        'true' || false;

    this.ACTIVATE_PII_PURGING =
      this.configService.get<string>('ACTIVATE_PII_PURGING') === 'true' ||
      false;

    this.ONBOARDING_REMINDERS_FREQUENCY_HOURS = JSON.parse(
      this.configService.get<string>('ONBOARDING_REMINDERS_FREQUENCY_HOURS'),
    );
    this.APPROVED_LOANLIMIT_REMINDERS_FREQUENCY_HOURS = JSON.parse(
      this.configService.get<string>(
        'APPROVED_LOANLIMIT_REMINDERS_FREQUENCY_HOURS',
      ),
    );
    this.AUTO_TERMINATION_ONBOARDING_CUSTOMER_HOUR =
      this.configService.get<number>(
        'AUTO_TERMINATION_ONBOARDING_CUSTOMER_HOUR',
      );
    this.PII_PURGE_THRESHOLD = this.configService.get<number>(
      'PII_PURGE_THRESHOLD',
    );
  }

  onModuleInit() {
    // this.addCronJob(
    //   `make_coffee`,
    //   this.SCHEDULE_REMINDER_FIRSTLOAN,
    //   this.hello.bind(this),
    // );

    if (this.ACTIVATE_ONBOARDING_REMINDER) {
      this.addCronJob(
        'ONBOARDING_REMINDER',
        this.SCHEDULE_REMINDER_ONBOARD_DAYS,
        this.doCustOnboardingReminder.bind(this),
      );
    }

    if (this.ACTIVATE_APPROVED_LOAN_LIMIT_REMINDER) {
      this.addCronJob(
        'APPROVED_LOAN_LIMIT_REMINDER',
        this.SCHEDULE_REMINDER_FIRSTLOAN,
        this.doCustFirstLoanReminder.bind(this),
      );
    }

    if (this.ACTIVATE_REFINITIVE_RESOLUTION) {
      this.addCronJob(
        'REFINITIVE_RESOLUTION_JOB',
        this.SCHEDULE_JOB_REFINITIVE_RESOLUTION,
        this.doRefinitiveResolution.bind(this),
      );
    }

    if (this.ACTIVATE_PII_PURGING) {
      this.addCronJob(
        'PII_PURGING_JOB',
        this.SCHEDULE_PII_PURGE_FREQUENCY,
        this.doPIIPurging.bind(this),
      );
    }
  }

  // async hello() {
  //   const thresholdDate: Date = new Date();
  //   console.log(thresholdDate);

  //   thresholdDate.setHours(thresholdDate.getHours() - 27);
  //   console.log(thresholdDate);
  // }

  async doRefinitiveResolution() {
    const unresolvedCase: ICustRefinitiv[] =
      await this.custRefinitiveRepo.findUnResolvedCase();
    for await (const custRefinitiv of unresolvedCase) {
      const respone = await this.refinitiveService.refinitiveResolution(
        custRefinitiv.caseSystemId,
        custRefinitiv.resultIdReferenceId,
      );
      if (respone.status === 204) {
        custRefinitiv.resolutionDone = 'YES';
        custRefinitiv.resolutionSentDate = new Date();
        custRefinitiv.resolutionStatus = 'SUCCESS';
      } else {
        custRefinitiv.resolutionDone = 'ERROR';
        custRefinitiv.resolutionSentDate = new Date();
        custRefinitiv.resolutionStatus = respone.data;
      }
      this.custRefinitiveRepo.save(custRefinitiv);
    }
  }

  async doCustOnboardingReminder() {
    const custOtpList: ICustOtp[] =
      await this.custOtpRepo.findNonOnboardedLead();

    let dto: SendNotificationDto;
    for await (const custOtp of custOtpList) {
      const toBeSent: Date = new Date();

      if (!custOtp.smsNextHours) {
        custOtp.smsNextHours = parseInt(
          this.ONBOARDING_REMINDERS_FREQUENCY_HOURS[0],
        );
      }

      const platformApplicationEndpoint =
        await this.pushNotificationService.getEndpointArnFromCustomerOrLeadId(
          IdType.LEAD,
          custOtp.leadId,
        );

      if (
        custOtp.smsNextHours >= this.AUTO_TERMINATION_ONBOARDING_CUSTOMER_HOUR
      ) {
        custOtp.isTerminated = true;
        custOtp.terminationReason =
          'Auto-termination for incomplete applications';
        custOtp.smsNextHours = 0;
        const messageHeader = 'Onboarding Reminder';
        const message = `Dear ${custOtp.preferredName}. Your incomplete application has been terminated. You can always come back. Thank you for your interest in our products. \nFURAHA`;
        dto = {
          target: custOtp.msisdnCountryCode + custOtp.msisdn,
          targetType: TargetType.PHONE_NUMBER,
          messageHeader: messageHeader,
          message: message,
          customerId: custOtp.leadId,
          sourceMicroservice: SourceMicroservice.CUSTOMERS,
          priority: 9,
        };
        this.notificationService.sendNotification(dto);

        //Send Push Notification
        if (platformApplicationEndpoint) {
          dto = {
            target: platformApplicationEndpoint,
            targetType: TargetType.ENDPOINT_ARN,
            messageHeader: messageHeader,
            message: message,
            customerId: custOtp.leadId,
            // fullMsisdn: custOtp.msisdnCountryCode + custOtp.msisdn,
            sourceMicroservice: SourceMicroservice.CUSTOMERS,
            priority: 9,
          };
          this.notificationService.sendNotification(dto);
        }
        this.custOtpRepo.update(custOtp);
      } else {
        toBeSent.setTime(
          custOtp.createdAt.getTime() + custOtp.smsNextHours * 60 * 60 * 1000,
        );

        if (toBeSent <= new Date()) {
          const message = `Dear ${custOtp.preferredName}.You are yet to complete your application. Access our Mobile App to resume the journey.\nFURAHA`;
          const messageHeader = 'Onboarding Reminder';
          dto = {
            target: custOtp.msisdnCountryCode + custOtp.msisdn,
            targetType: TargetType.PHONE_NUMBER,
            messageHeader: messageHeader,
            message: message,
            customerId: custOtp.leadId,
            sourceMicroservice: SourceMicroservice.CUSTOMERS,
            priority: 9,
          };
          this.notificationService.sendNotification(dto);

          //Send Push Notification
          if (platformApplicationEndpoint) {
            dto = {
              target: platformApplicationEndpoint,
              targetType: TargetType.ENDPOINT_ARN,
              messageHeader: messageHeader,
              message: message,
              customerId: custOtp.leadId,
              // fullMsisdn: custOtp.msisdnCountryCode + custOtp.msisdn,
              sourceMicroservice: SourceMicroservice.CUSTOMERS,
              priority: 9,
            };
            this.notificationService.sendNotification(dto);
          }

          custOtp.smsNextHours = parseInt(
            this.ONBOARDING_REMINDERS_FREQUENCY_HOURS[
              this.ONBOARDING_REMINDERS_FREQUENCY_HOURS.indexOf(
                custOtp.smsNextHours.toString(),
              ) + 1
            ],
          );
          this.custOtpRepo.update(custOtp);
        }
      }
    }
  }

  async doCustFirstLoanReminder() {
    const custPrimaryDetails: ICustPrimaryDetails[] =
      await this.custPrimaryDetailsRepo.getZeroLoansCust();

    for await (const custPrimaryDetail of custPrimaryDetails) {
      const toBeSent: Date = new Date();

      if (!custPrimaryDetail.smsNextHours) {
        custPrimaryDetail.smsNextHours = parseInt(
          this.APPROVED_LOANLIMIT_REMINDERS_FREQUENCY_HOURS[0],
        );
      }

      toBeSent.setTime(
        custPrimaryDetail.createdAt.getTime() +
          custPrimaryDetail.smsNextHours * 60 * 60 * 1000,
      );

      const platformApplicationEndpoint =
        await this.pushNotificationService.getEndpointArnFromCustomerOrLeadId(
          IdType.CUSTOMER,
          custPrimaryDetail.id,
        );

      if (toBeSent <= new Date()) {
        const message = `Hello ${custPrimaryDetail.preferredName}. Welcome to FURAHA. 
        Get a 3-month loan of up to {Amount} at a low interest of {Interestpm} towards School Fees.`;
        const messageHeader = 'Onboarding Reminder';
        const dto: SendNotificationDto = {
          target:
            custPrimaryDetail.msisdnCountryCode + custPrimaryDetail.msisdn,
          targetType: TargetType.PHONE_NUMBER,
          messageHeader: messageHeader,
          message: message,
          customerId: custPrimaryDetail.id,
          sourceMicroservice: SourceMicroservice.CUSTOMERS,
          priority: 9,
        };
        this.notificationService.sendNotification(dto);

        //Send Push Notification
        if (platformApplicationEndpoint) {
          const dto: SendNotificationDto = {
            target: platformApplicationEndpoint,
            targetType: TargetType.ENDPOINT_ARN,
            messageHeader: messageHeader,
            message: message,
            customerId: custPrimaryDetail.id,
            sourceMicroservice: SourceMicroservice.CUSTOMERS,
            priority: 9,
          };
          this.notificationService.sendNotification(dto);
        }

        custPrimaryDetail.smsNextHours = parseInt(
          this.APPROVED_LOANLIMIT_REMINDERS_FREQUENCY_HOURS[
            this.APPROVED_LOANLIMIT_REMINDERS_FREQUENCY_HOURS.indexOf(
              custPrimaryDetail.smsNextHours.toString(),
            ) + 1
          ],
        );
        this.custPrimaryDetailsRepo.updateCustomer(custPrimaryDetail);
      }
    }
  }

  async doPIIPurging() {
    const custOtpList: ICustOtp[] = await this.custOtpRepo.findLeadForPurging(
      this.PII_PURGE_THRESHOLD,
    );

    const msisdnList: string[] = [];
    const leadIdList: string[] = [];
    for await (const custOtp of custOtpList) {
      msisdnList.push(custOtp.msisdnCountryCode + custOtp.msisdn);
      leadIdList.push(custOtp.leadId);

      custOtp.preferredName = '';
      custOtp.nationalIdNumber = '';
      custOtp.email = '';
      custOtp.msisdn = 'PURGED';
    }

    const custTelcoList: ICustTelco[] =
      await this.custTelcoRepository.findByLeadIdList(leadIdList);
    for await (const custTelco of custTelcoList) {
      custTelco.firstName = '';
      custTelco.lastName = '';
      custTelco.middleName = '';
      custTelco.givenName = '';
      custTelco.dob = '';
      custTelco.gender = null;
      custTelco.nationalIdNumber = '';
      custTelco.nationality = '';
      custTelco.msisdn = 'PURGED';
    }

    this.custTelcoRepository.updateCustTelcoList(custTelcoList);
    this.custOtpRepo.updateCustOtpList(custOtpList);

    this.custToLMSService.purgeCustomer(msisdnList);
  }

  addCronJob(
    name: string,
    cronExpression: string,
    callback: () => Promise<void>,
  ) {
    const job = new CronJob(`${cronExpression}`, () => {
      callback();
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.log(
      `The cron job ${name} has been added with the following cron expression : ${cronExpression}.`,
    );
  }
}
