import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { mockContent } from '../domain/model/mocks/content.mock';
import { mockCustPrimaryDetails } from '../domain/model/mocks/cust-primary-details.mock';
import { IContentRepository } from '../domain/repository/contentRepository.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { IIdExpiryCronService } from '../domain/services/id-expiry-cron.service.interface';
import { CustOtpRepository } from '../infrastructure/repository/custOtp.repository';
import { CustPrimaryDetailsRepository } from '../infrastructure/repository/custPrimaryDetails.repository';
import { mockContentRepository } from '../infrastructure/repository/mocks/content.repository.mock';
import { NotificationServiceClient } from '../infrastructure/services/notifiction-service-client/notifications-service-client.service';
import { PushNotificationService } from '../infrastructure/services/push-notification-service';
import { IdExpiryCronService } from './id-expiry-cron.service';

describe('IdExpiryCronService', () => {
  let service: IIdExpiryCronService;

  const mockCustPrimaryDetailsRepository =
    createMock<CustPrimaryDetailsRepository>();

  const mockNotificationServiceClient = createMock<NotificationServiceClient>();
  const mockPushNotificationService = createMock<PushNotificationService>();
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        { provide: IIdExpiryCronService, useClass: IdExpiryCronService },
        {
          provide: ICustPrimaryDetailsRepository,
          useValue: mockCustPrimaryDetailsRepository,
        },
        {
          provide: ICustOtpRepository,
          useValue: createMock<CustOtpRepository>(),
        },
        { provide: IContentRepository, useValue: mockContentRepository },
        {
          provide: NotificationServiceClient,
          useValue: mockNotificationServiceClient,
        },
        {
          provide: PushNotificationService,
          useValue: mockPushNotificationService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: (envName: string) => {
              switch (envName) {
                case 'DISABLE_CRON_NOTIFICATIONS':
                  return 'false';
                  break;

                default:
                  break;
              }
            },
          },
        },
      ],
    }).compile();

    service = module.get<IIdExpiryCronService>(IIdExpiryCronService);
  });

  it('Service is defined', async () => {
    expect(service).toBeDefined();
  });
  it('sendNotificationForExpiredIds should send notifications', async () => {
    jest
      .spyOn(mockContentRepository, 'findByContentName')
      .mockResolvedValueOnce({
        ...mockContent,
        messageHeader: 'Sample Header for Expired IDs',
        message: 'Hello ${preferredName}, sample message for expired IDs',
      });

    jest
      .spyOn(mockPushNotificationService, 'getEndpointArnFromCustomerOrLeadId')
      .mockResolvedValueOnce('endpointarn1')
      .mockResolvedValueOnce('endpointarn2');

    jest
      .spyOn(mockCustPrimaryDetailsRepository, 'getCustomersByIdExpiryDaysList')
      .mockResolvedValueOnce([
        {
          ...mockCustPrimaryDetails,
          preferredName: 'Johnation Doughnut',
          idExpiryDays: 90,
        },
        {
          ...mockCustPrimaryDetails,
          preferredName: 'Janice Peanut',
          idExpiryDays: 1,
        },
      ]);
    const sendNotiSpy = jest.spyOn(
      mockNotificationServiceClient,
      'sendNotification',
    );
    await service.sendNotificationForExpiredIds();
    expect(sendNotiSpy).toBeCalledTimes(4); //2X for SMS and 2X for Push notifications
    expect(sendNotiSpy).toHaveBeenNthCalledWith(1, {
      customerId: '8ec69ca8-373a-49bb-b610-e3b52fbdf35c',
      message: 'Hello Johnation Doughnut, sample message for expired IDs',
      messageHeader: 'Sample Header for Expired IDs',
      priority: 9,
      sourceMicroservice: 'CUSTOMERS',
      target: 'endpointarn1',
      targetType: 'ENDPOINT_ARN',
    });
    expect(sendNotiSpy).toHaveBeenNthCalledWith(2, {
      customerId: '8ec69ca8-373a-49bb-b610-e3b52fbdf35c',
      message: 'Hello Johnation Doughnut, sample message for expired IDs',
      messageHeader: 'Sample Header for Expired IDs',
      priority: 9,
      sourceMicroservice: 'CUSTOMERS',
      target: '+256999999999',
      targetType: 'PHONE_NUMBER',
    });
    expect(sendNotiSpy).toHaveBeenNthCalledWith(3, {
      customerId: '8ec69ca8-373a-49bb-b610-e3b52fbdf35c',
      message: 'Hello Janice Peanut, sample message for expired IDs',
      messageHeader: 'Sample Header for Expired IDs',
      priority: 9,
      sourceMicroservice: 'CUSTOMERS',
      target: 'endpointarn2',
      targetType: 'ENDPOINT_ARN',
    });
    expect(sendNotiSpy).toHaveBeenNthCalledWith(4, {
      customerId: '8ec69ca8-373a-49bb-b610-e3b52fbdf35c',
      message: 'Hello Janice Peanut, sample message for expired IDs',
      messageHeader: 'Sample Header for Expired IDs',
      priority: 9,
      sourceMicroservice: 'CUSTOMERS',
      target: '+256999999999',
      targetType: 'PHONE_NUMBER',
    });
  });

  it('decrement id expiry days should call apporpriate methods custPriamryDetailsRepo.decrementIdExpiryDays and custPriamryDetailsRepo.setExpiredIdStatus', async () => {
    const decrementSpy = jest.spyOn(
      mockCustPrimaryDetailsRepository,
      'decrementIdExpiryDays',
    );
    const updateIdStatusSpy = jest.spyOn(
      mockCustPrimaryDetailsRepository,
      'setExpiredIdStatus',
    );
    await (service as IdExpiryCronService).decrementIdExpiryDays();
    expect(decrementSpy).toBeCalledTimes(1);
    expect(updateIdStatusSpy).toBeCalledTimes(1);
  });
});
