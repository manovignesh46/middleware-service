import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from '../../usecases/notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { TargetType } from '../../domain/model/enum/target-type.enum';
import { SourceMicroservice } from '../../domain/model/enum/source-microservice.enum';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { generateMockPushStatusDTO } from './dto/pushStatus.dto.spec';
import { StatusMessagePresenter } from './common/statusMessage.presenter';

describe('NotificationController', () => {
  let controller: NotificationController;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: createMock<NotificationService>(),
        },
        ConfigService,
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  const sendNotificationDto: SendNotificationDto = {
    target: '+123456789',
    targetType: TargetType.PHONE_NUMBER,
    messageHeader: 'Greeting To You',
    message: 'Hello World',
    customerId: 'Customer 123',
    sourceMicroservice: SourceMicroservice.CUSTOMERS,
    priority: 9,
  };

  describe('sendNotification', () => {
    it('should call notificationService.sendNotification with the provided DTO', async () => {
      const sendNotificationSpy = jest.spyOn(
        notificationService,
        'sendNotification',
      );

      await controller.sendNotification(sendNotificationDto);

      expect(sendNotificationSpy).toHaveBeenCalledWith(sendNotificationDto);
    });

    it('should return a StatusMessagePresenter with the status and message', async () => {
      const expectedResult = {
        status: 2000,
        message: 'Success',
      };

      jest
        .spyOn(notificationService, 'sendNotification')
        .mockImplementationOnce(async () => {
          return;
        });

      const result = await controller.sendNotification(sendNotificationDto);

      expect(result).toEqual(expectedResult);
    });

    it('should call pushStatus return a StatusMessagePresenter', async () => {
      const result = await controller.pushStatus(generateMockPushStatusDTO());
      expect(result).toBeInstanceOf(StatusMessagePresenter);
    });
  });
});
