import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { IdType } from '../domain/model/user-device.interface';
import { IContentRepository } from '../domain/repository/contentRepository.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { IIdExpiryCronService } from '../domain/services/id-expiry-cron.service.interface';
import { SendNotificationDto } from '../infrastructure/services/notifiction-service-client/dto/send-notification.dto';
import { SourceMicroservice } from '../infrastructure/services/notifiction-service-client/enum/source-microservice.enum';
import { TargetType } from '../infrastructure/services/notifiction-service-client/enum/target-type.enum';
import { NotificationServiceClient } from '../infrastructure/services/notifiction-service-client/notifications-service-client.service';
import { PushNotificationService } from '../infrastructure/services/push-notification-service';

@Injectable()
export class IdExpiryCronService implements IIdExpiryCronService {
  private DISABLE_CRON_NOTIFICATIONS: boolean;
  private logger = new Logger(IdExpiryCronService.name);
  constructor(
    private custPrimaryDetailsRepository: ICustPrimaryDetailsRepository,
    private custOtpRepository: ICustOtpRepository,
    private contentRepository: IContentRepository,
    private notificationServiceClient: NotificationServiceClient,
    private configService: ConfigService,
    private pushNotificationService: PushNotificationService,
  ) {
    this.DISABLE_CRON_NOTIFICATIONS =
      this.configService.get<string>('DISABLE_CRON_NOTIFICATIONS') == 'true';
    this.logger.log(
      `DISABLE_CRON_NOTIFICATIONS: ${this.DISABLE_CRON_NOTIFICATIONS}`,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { utcOffset: 0 })
  async decrementIdExpiryDays(): Promise<void> {
    this.logger.log(this.decrementIdExpiryDays.name);
    await this.custPrimaryDetailsRepository.decrementIdExpiryDays();
    await this.custPrimaryDetailsRepository.setExpiredIdStatus();
    return;
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM, { utcOffset: 0 })
  async sendNotificationForExpiredIds(): Promise<void> {
    this.logger.log(this.sendNotificationForExpiredIds.name);
    const customersWithExpiringIds: ICustPrimaryDetails[] =
      await this.custPrimaryDetailsRepository.getCustomersByIdExpiryDaysList();
    if (!customersWithExpiringIds) {
      return;
    }
    const messageContent = await this.contentRepository.findByContentName(
      'ID_EXPIRING_SOON',
    );
    this.logger.log(
      `Customers with expiring IDs as of ${new Date()}: ${customersWithExpiringIds
        .map((customer) => customer.id)
        .toString()}`,
    );
    if (this.DISABLE_CRON_NOTIFICATIONS) {
      //skip sending the actual notification
      return;
    }
    for (const customer of customersWithExpiringIds) {
      const message = messageContent.message.replace(
        '${preferredName}',
        customer.preferredName || 'dear customer', //use placeholder name in case it is null
      );
      const fullMsisdn = customer.msisdnCountryCode + customer.msisdn;
      const platformApplicationEndpoint =
        await this.pushNotificationService.getEndpointArnFromCustomerOrLeadId(
          IdType.CUSTOMER,
          customer.id,
        );
      if (platformApplicationEndpoint) {
        const pushDto: SendNotificationDto = {
          target: platformApplicationEndpoint,
          targetType: TargetType.ENDPOINT_ARN,
          messageHeader: messageContent.messageHeader,
          message,
          customerId: customer.id,
          // fullMsisdn: fullMsisdn,
          sourceMicroservice: SourceMicroservice.CUSTOMERS,
          priority: 9,
        };
        this.notificationServiceClient.sendNotification(pushDto);

        if (this.DISABLE_CRON_NOTIFICATIONS) {
          //skip sending the actual SMS notification. Push Notification still being sent
          continue;
        }
        const dto: SendNotificationDto = {
          target: fullMsisdn,
          targetType: TargetType.PHONE_NUMBER,
          messageHeader: messageContent.messageHeader,
          message,
          customerId: customer.id,
          sourceMicroservice: SourceMicroservice.CUSTOMERS,
          priority: 9,
        };
        this.notificationServiceClient.sendNotification(dto);
      }
    }
  }
}
