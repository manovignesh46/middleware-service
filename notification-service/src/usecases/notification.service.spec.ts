import { NotificationService } from './notification.service';
import { ISNSService } from '../domain/services/aws-sns-service.interface';
import { INotificationRepository } from '../domain/repository/notification-repository.interface';
import { SendNotificationDto } from '../infrastructure/controllers/dto/send-notification.dto';
import { TargetType } from '../domain/model/enum/target-type.enum';
import { Notification } from '../infrastructure/entities/notification.entity';
import { SNSService } from '../infrastructure/services/sns.service';
import { createMock } from '@golevelup/ts-jest';
import { SourceMicroservice } from '../domain/model/enum/source-microservice.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerServiceClient } from '../infrastructure/services/customer-service-client/customers-service-client.service';
import { SendLOSNotificationDto } from '../infrastructure/controllers/dto/send-los-notification.dto';
import { generateMockPushStatusDTO } from '../infrastructure/controllers/dto/pushStatus.dto.spec';
import { ConfigService } from '@nestjs/config';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  const mockSNSService: ISNSService = createMock<SNSService>();
  const mockNotificationRepository: INotificationRepository =
    createMock<INotificationRepository>();
  const mockConfigService: ConfigService = createMock<ConfigService>();
  jest.spyOn(mockConfigService, 'get').mockImplementation((envName) => {
    switch (envName) {
      case 'OTP_AUTO_READ_KEY':
        return 'ABC123';

      default:
        break;
    }
  });
  let createSpy;
  let updateSpy;

  const mockCustomerServiceClient = createMock<CustomerServiceClient>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: ISNSService, useValue: mockSNSService },
        {
          provide: INotificationRepository,
          useValue: mockNotificationRepository,
        },
        {
          provide: CustomerServiceClient,
          useValue: mockCustomerServiceClient,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();
    jest.clearAllMocks();

    notificationService = module.get<NotificationService>(NotificationService);

    createSpy = jest.spyOn(mockNotificationRepository, 'create');
    updateSpy = jest.spyOn(mockNotificationRepository, 'update');
  });

  describe('sendNotification', () => {
    it('should send SMS notification', async () => {
      // Arrange
      const sendNotificationDto: SendNotificationDto = {
        target: '123456789',
        messageHeader: 'Greeting To You',
        message: 'Hello',
        customerId: '123',
        sourceMicroservice: SourceMicroservice.AUTH,
        priority: 5,
        targetType: TargetType.PHONE_NUMBER,
      };

      const response = {
        MessageId: '123',
      };
      mockSNSService.sendSMS = jest.fn().mockResolvedValue(response);

      // Act
      await notificationService.sendNotification(sendNotificationDto);

      // Assert
      expect(createSpy).toHaveBeenCalledWith(expect.any(Notification));
      expect(mockSNSService.sendSMS).toHaveBeenCalledWith(
        sendNotificationDto.target,
        sendNotificationDto.message,
      );
      expect(updateSpy).toHaveBeenCalledWith(expect.any(Notification));
    });

    it('should send SMS notification when triggered from LOS (/register)', async () => {
      // Arrange
      const dto: SendLOSNotificationDto = {
        msisdn: '+6599999999',
        content: 'Test',
        channel: 'SMS',
        event_name: 'Testing Message',
        event_date: 'someDateString',
        txn_id: 'abc',
      };

      const response = {
        MessageId: '123',
      };
      mockSNSService.sendSMS = jest.fn().mockResolvedValue(response);

      // Act
      await notificationService.sendLOSNotification(dto);

      // Assert
      expect(createSpy).toHaveBeenCalledWith(expect.any(Notification));
      expect(mockSNSService.sendSMS).toHaveBeenCalledWith(
        dto.msisdn,
        dto.content,
      );
      expect(updateSpy).toHaveBeenCalledWith(expect.any(Notification));
    });

    it('should update notification with status', async () => {
      const result: boolean = await notificationService.pushStatus(
        generateMockPushStatusDTO(),
      );
      expect(result).toEqual(true);
    });

    //     // uncomment when targetType is not hardcoded as TargetType.PHONE_NUMBER
    //     it('should handle invalid TargetType', async () => {
    //       // Arrange
    //       const sendNotificationDto: SendNotificationDto = {
    //         target: '123456789',
    //         message: 'Hello',
    //         customerId: '123',
    //         sourceMicroservice: SourceMicroservice.AUTH,
    //         priority: 5,
    //         targetType: 'invalid target type',
    //       } as any as SendNotificationDto;

    //       // Act
    //       await notificationService.sendNotification(sendNotificationDto);

    //       // Assert
    //       expect(createSpy).toHaveBeenCalledWith(expect.any(Notification));
    //       expect(mockSNSService.sendSMS).not.toHaveBeenCalled();
    //       expect(updateSpy).not.toHaveBeenCalled();
    //     });
  });

  it('should send PUSH notification', async () => {
    jest
      .spyOn(mockNotificationRepository, 'create')
      .mockImplementationOnce((notification) =>
        Promise.resolve({
          ...notification,
          id: '123',
        }),
      );
    // Arrange
    const sendNotificationDto: SendNotificationDto = {
      target: '123456789',
      messageHeader: 'Greeting To You',
      message: 'Hello',
      customerId: '123',
      sourceMicroservice: SourceMicroservice.AUTH,
      priority: 5,
      targetType: TargetType.ENDPOINT_ARN,
    };

    const response = {
      MessageId: '123',
    };
    mockSNSService.sendSMS = jest.fn().mockResolvedValue(response);

    // Act
    await notificationService.sendNotification(sendNotificationDto);

    // Assert
    expect(createSpy).toHaveBeenCalledWith(expect.any(Notification));
    expect(mockSNSService.sendPushNotification).toHaveBeenCalledWith(
      '123',
      sendNotificationDto.target,
      sendNotificationDto.message,
      sendNotificationDto.messageHeader,
    );
    expect(updateSpy).toHaveBeenCalledWith(expect.any(Notification));
  });
});
