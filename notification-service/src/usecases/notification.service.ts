import { PublishCommandOutput } from '@aws-sdk/client-sns';
import { Injectable, Logger } from '@nestjs/common';
import { SourceMicroservice } from '../domain/model/enum/source-microservice.enum';
import { TargetType } from '../domain/model/enum/target-type.enum';
import { INotificationRepository } from '../domain/repository/notification-repository.interface';
import { ISNSService } from '../domain/services/aws-sns-service.interface';
import { SendLOSNotificationDto } from '../infrastructure/controllers/dto/send-los-notification.dto';
import { SendNotificationDto } from '../infrastructure/controllers/dto/send-notification.dto';
import { Notification } from '../infrastructure/entities/notification.entity';
import { CustomerServiceClient } from '../infrastructure/services/customer-service-client/customers-service-client.service';
import { GetCustomerFromFullMsisdnPresenter } from '../infrastructure/services/customer-service-client/presenter/get-customer-from-full-msisdn.presenter';
import { PushStatusDTO } from '../infrastructure/controllers/dto/pushStatus.dto';
import { INotification } from '../domain/model/notification.interface';
import { PushStatusType } from '../domain/enum/pushStatus.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  logger = new Logger(NotificationService.name);
  private OTP_AUTO_READ_KEY: string;
  constructor(
    private readonly snsService: ISNSService,
    private readonly notificationRepository: INotificationRepository,
    private readonly customerServiceClient: CustomerServiceClient,
    private readonly configService: ConfigService,
  ) {
    this.OTP_AUTO_READ_KEY = configService.get('OTP_AUTO_READ_KEY');
  }
  async sendNotification(sendNotificationDto: SendNotificationDto) {
    this.logger.log(this.sendNotification.name);
    const {
      target,
      messageHeader,
      message,
      customerId,
      sourceMicroservice,
      targetType,
    } = sendNotificationDto;
    let priority = 9; // default priority
    if (sendNotificationDto?.priority) {
      priority = sendNotificationDto.priority;
    }

    const notification = new Notification();
    notification.messageHeader = messageHeader;
    notification.message = message?.replace(
      '${otpAutoReadKey}',
      this.OTP_AUTO_READ_KEY, //For OTP auto-population
    );
    notification.targetType = targetType;
    notification.target = target;
    notification.customerId = customerId;
    notification.sourceMicroservice = sourceMicroservice;
    notification.priority = priority;

    const newNotification = await this.notificationRepository.create(
      notification,
    );

    const { messageSendAttempted, response } =
      await this.sendNotificationHelper(
        targetType,
        target,
        messageHeader,
        notification.message,
        newNotification.id,
      );

    if (messageSendAttempted) {
      notification.response = JSON.stringify(response);
      if (response?.MessageId) {
        notification.snsMessageId = response.MessageId;
        notification.sentAt = new Date(Date.now());
      }
      await this.notificationRepository.update(notification);
    }
  }

  async sendLOSNotification(sendLOSNotificationDto: SendLOSNotificationDto) {
    this.logger.log(this.sendLOSNotification.name);
    const {
      msisdn: fullMsisdn,
      content,
      channel,
      event_name,
      event_date,
      txn_id,
    } = sendLOSNotificationDto;

    const custData: GetCustomerFromFullMsisdnPresenter =
      await this.customerServiceClient.getCustomerFromFullMsisdn(fullMsisdn);

    const notification = new Notification();
    notification.customerId = custData.customerId;
    notification.leadId = custData.leadId;
    notification.message = content;
    notification.sourceMicroservice = SourceMicroservice.LOS;
    notification.priority = 9;
    //LOS/LMS properties below
    notification.fullMsisdn = fullMsisdn;
    notification.eventDate = event_date;
    notification.eventName = event_name;
    notification.transactionId = txn_id;
    notification.channel = channel;

    switch (channel) {
      case 'SMS':
        notification.targetType = TargetType.PHONE_NUMBER;
        notification.target = fullMsisdn;
        break;
      case 'Push':
        notification.targetType = TargetType.ENDPOINT_ARN;
        notification.target = custData.email;
        break;
      case 'In App':
        notification.targetType = TargetType.IN_APP;
        // To add notification.target
        break;
      case 'Email':
        notification.targetType = TargetType.EMAIL;
        notification.target = custData.email;
        break;
      case 'Topic':
        notification.targetType = TargetType.TOPIC_ARN;
        // To add notification.target
        break;
      default:
        this.logger.error('Invalid Channel');
        const invalidChannelError = new Error('Invalid Channel');
        throw invalidChannelError;
        break;
    }

    await this.notificationRepository.create(notification);
    const { messageSendAttempted, response } =
      await this.sendNotificationHelper(
        notification.targetType,
        notification.target,
        null, //messageHeader is not received from LOS yet
        notification.message,
      );

    if (messageSendAttempted) {
      notification.response = JSON.stringify(response);
      if (response?.MessageId) {
        notification.snsMessageId = response.MessageId;
        notification.sentAt = new Date(Date.now());
      }
      await this.notificationRepository.update(notification);
    }
    return {
      isSent: messageSendAttempted,
      notificationUUID: notification?.snsMessageId,
    };
  }

  private async sendNotificationHelper(
    targetType: TargetType,
    target: string,
    messageHeader: string,
    message: string,
    pushId?: string,
  ) {
    let response: PublishCommandOutput;

    let messageSendAttempted = false;
    switch (targetType) {
      case TargetType.PHONE_NUMBER:
        this.logger.log('Sending SMS');
        response = await this.snsService.sendSMS(target, message);
        messageSendAttempted = true;
        break;
      case TargetType.ENDPOINT_ARN:
        this.logger.log('Sending Push Notification');
        response = await this.snsService.sendPushNotification(
          pushId,
          target,
          message,
          messageHeader,
        );
        this.logger.debug(response);
        messageSendAttempted = true;
        break;
      // case TargetType.TOPIC_ARN:
      //   this.logger.log('Sending to Topic ARN');
      //   response = await this.snsService.sendToTopic(target, message);
      // messageSendAttempted = true;
      //   break;
      default:
        this.logger.error('Invalid TargetType');
        break;
    }
    return { messageSendAttempted, response };
  }

  async pushStatus(pushStatusDTO: PushStatusDTO): Promise<boolean> {
    const notification: INotification =
      await this.notificationRepository.findById(pushStatusDTO.pushId);
    if (notification) {
      if (pushStatusDTO.pushStatus === PushStatusType.DELIVERED) {
        notification.pushDeliveryStatus = PushStatusType.DELIVERED;
        notification.pushDeliveredAt = new Date();
      } else if (pushStatusDTO.pushStatus === PushStatusType.VIEWED) {
        notification.pushViewedStatus = PushStatusType.VIEWED;
        notification.pushViewedAt = new Date();
      } else {
        return false;
      }
      this.notificationRepository.update(notification);
      return true;
    }
    return null;
  }
}
