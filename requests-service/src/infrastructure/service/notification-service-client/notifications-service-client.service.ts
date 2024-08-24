import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { ResponseStatusCode } from '../../../domain/enum/responseStatusCode.enum';
import { SendNotificationDto } from './dto/send-notification.dto';
import { SourceMicroservice } from './enum/source-microservice.enum';

@Injectable()
export class NotificationServiceClient {
  private notificationServiceHostname: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.notificationServiceHostname = this.configService.get<string>(
      'NOTIFICATIONS_SERVICE_HOSTNAME',
    );
  }

  private logger = new Logger(NotificationServiceClient.name);

  async sendNotification(sendNotificationServiceDto: SendNotificationDto) {
    this.logger.log(this.sendNotification.name);
    sendNotificationServiceDto.sourceMicroservice = SourceMicroservice.REQUESTS; // Set Source to Request MS
    const path = `/notifications/send`;
    const url = new URL(this.notificationServiceHostname);
    url.pathname += path;
    try {
      const response = (
        await lastValueFrom(
          this.httpService.post(url.toString(), sendNotificationServiceDto),
        )
      ).data;

      if (response?.status === ResponseStatusCode.SUCCESS) {
        return;
      } else {
        this.logger.error(`Error Sending Notification`);
        this.logger.error(response?.message);
        this.logger.error(response);
        throw new Error('Error sending notification');
      }
    } catch (err) {
      this.logger.error(err.stack);
      throw err;
    }
  }
}
