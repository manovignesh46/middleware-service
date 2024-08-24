import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SendNotificationDto } from './dto/send-notification.dto';
import { of, throwError } from 'rxjs';
import { NotificationServiceClient } from './notifications-service-client.service';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { TargetType } from './enum/target-type.enum';
import { SourceMicroservice } from './enum/source-microservice.enum';
import { AxiosResponse } from 'axios';
import { ResponseStatusCode } from '../../../domain/enum/responseStatusCode.enum';

jest.mock('@nestjs/axios');

describe('NotificationServiceClient', () => {
  let notificationServiceClient: NotificationServiceClient;
  const httpService: HttpService = createMock<HttpService>();
  const configService: ConfigService = createMock<ConfigService>();

  const sendNotificationServiceDto = new SendNotificationDto();
  sendNotificationServiceDto.target = '+256123456789';
  sendNotificationServiceDto.targetType = TargetType.PHONE_NUMBER;
  sendNotificationServiceDto.messageHeader = 'Greetings Human';
  sendNotificationServiceDto.message = 'Hello World';
  sendNotificationServiceDto.customerId = 'Customer 123';
  sendNotificationServiceDto.sourceMicroservice = SourceMicroservice.CUSTOMERS;
  sendNotificationServiceDto.priority = 9;
  beforeEach(async () => {
    jest.clearAllMocks();
    jest
      .spyOn(configService, 'get')
      .mockReturnValue('http://localhost:3000/v1');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationServiceClient,
        { provide: HttpService, useValue: httpService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    notificationServiceClient = module.get<NotificationServiceClient>(
      NotificationServiceClient,
    );
  });

  describe('sendNotification', () => {
    it('should send a notification successfully', async () => {
      const response = {
        data: {
          status: ResponseStatusCode.SUCCESS,
        },
      } as AxiosResponse;
      jest.spyOn(httpService, 'post').mockReturnValueOnce(of(response));
      await notificationServiceClient.sendNotification(
        sendNotificationServiceDto,
      );
      expect(httpService.post).toHaveBeenCalledWith(
        'http://localhost:3000/v1/notifications/send',
        sendNotificationServiceDto,
      );
    });

    it('should handle error response', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          status: 500,
          message: 'Some Error With Notification Service',
        },
      } as AxiosResponse;
      jest.spyOn(httpService, 'post').mockReturnValueOnce(of(mockResponse));

      const response = notificationServiceClient.sendNotification(
        sendNotificationServiceDto,
      );
      await expect(response).rejects.toThrowError();

      // Assert
      expect(httpService.post).toHaveBeenCalledWith(
        'http://localhost:3000/v1/notifications/send',
        sendNotificationServiceDto,
      );
    });
    it('should handle network error', async () => {
      const error = new Error('Network error');
      jest.spyOn(httpService, 'post').mockImplementationOnce(() => {
        throw error;
      });

      await expect(
        notificationServiceClient.sendNotification(sendNotificationServiceDto),
      ).rejects.toThrow(error);
    });
  });
});
