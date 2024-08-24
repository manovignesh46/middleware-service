import { Test, TestingModule } from '@nestjs/testing';
import { INotificationService } from '../domain/services/notificationsService.interface';
import { NotificationService } from './notifications.service';
import { ISmsService } from '../domain/services/smsService.interface';
import { IEmailService } from '../domain/services/emailService.interface';
import { ConfigService } from '@nestjs/config';

describe('NotificationService', () => {
  let service: INotificationService;

  const mockSmsService: ISmsService = {
    sendSmsWithReplacable: function (
      phoneNumber: string,
      contentName: string,
      replacble: any,
    ) {
      return null;
    },
  };

  const mockEmailService: IEmailService = {
    sendEmail: function (
      recipientEmail: string,
      senderEmail: string,
      message: string,
    ) {
      return null;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: INotificationService, useClass: NotificationService },
        { provide: ISmsService, useValue: mockSmsService },
        { provide: IEmailService, useValue: mockEmailService },
        ConfigService,
      ],
    }).compile();

    service = module.get<INotificationService>(INotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
