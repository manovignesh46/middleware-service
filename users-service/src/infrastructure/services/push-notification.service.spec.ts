import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  mockTopicSubscription,
  mockUserDevice,
} from '../../domain/model/mocks/user-device.mock';
import { IdType } from '../../domain/model/user-device.interface';
import { IUserDeviceRepository } from '../../domain/repository/user-device-repository.interface';
import { ISNSService } from '../../domain/services/aws-sns-service.interface';
import { mockUserDeviceRepository } from '../repository/mocks/user-device.repository.mock';
import { SNSService } from './aws-sns.service';
import { PushNotificationService } from './push-notification-service';
import { generateMockDeviceDetailsDTO } from '../controllers/customers/dtos/deviceDetails.dto.spec';

describe('Push Notification Service', () => {
  let service: PushNotificationService;
  const mockSNSService = createMock<SNSService>();
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: IUserDeviceRepository,
          useValue: mockUserDeviceRepository,
        },
        {
          provide: ISNSService,
          useValue: mockSNSService,
        },
        ConfigService,
        PushNotificationService,
      ],
    }).compile();
    service = module.get<PushNotificationService>(PushNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('It should return null if data matches db', async () => {
    jest
      .spyOn(mockUserDeviceRepository, 'findByDeviceIdAndIsActive')
      .mockResolvedValueOnce(mockUserDevice);

    const res = await service.registerDeviceForPushNotifications({
      deviceId: mockUserDevice.deviceId,
      deviceOs: mockUserDevice.deviceOs,
      firebaseToken: mockUserDevice.firebaseDeviceToken,
      customerId: mockUserDevice.customerOrLeadId,
    });
    expect(res).not.toBeDefined();
  });
  it('It should return userDevice if data matches db', async () => {
    jest
      .spyOn(mockUserDeviceRepository, 'findByDeviceIdAndIsActive')
      .mockResolvedValueOnce(mockUserDevice);

    const res = await service.registerDeviceForPushNotifications({
      deviceId: mockUserDevice.deviceId,
      deviceOs: mockUserDevice.deviceOs,
      firebaseToken: 'someOtherToken',
      customerId: mockUserDevice.customerOrLeadId,
    });
    expect(res).toEqual(
      expect.objectContaining({ firebaseDeviceToken: 'someOtherToken' }),
    );
  });
  it('It should create a new device if it does not exist', async () => {
    jest
      .spyOn(mockUserDeviceRepository, 'findByDeviceIdAndIsActive')
      .mockResolvedValueOnce(null);
    const createUserDeviceSpy = jest.spyOn(
      mockUserDeviceRepository,
      'createUserDevice',
    );

    const createPlatformApplicationSpy = jest
      .spyOn(mockSNSService, 'createPlatformApplicationEndpoint')
      .mockResolvedValueOnce('endpoint123');

    const subscribeEndpointSpy = jest.spyOn(
      mockSNSService,
      'subscribeEndpointToTopic',
    );
    await service.registerDeviceForPushNotifications({
      deviceId: 'device123',
      deviceOs: 'android',
      firebaseToken: 'token123',
      customerId: 'customer123',
    });

    expect(createUserDeviceSpy).toBeCalledTimes(1);
    expect(createPlatformApplicationSpy).toBeCalledTimes(1);
    expect(createPlatformApplicationSpy).toBeCalledWith('token123');
    // expect(subscribeEndpointSpy).toBeCalledTimes(1);
    // expect(subscribeEndpointSpy).toBeCalledWith(
    //   'endpoint123',
    //   'SAMPLE-TOPIC-ARN',
    // );
  });
  it('It should create a new device if it does not exist', async () => {
    jest
      .spyOn(mockUserDeviceRepository, 'findByDeviceIdAndIsActive')
      .mockResolvedValueOnce(mockUserDevice);
    const updateUserDeviceSpy = jest.spyOn(
      mockUserDeviceRepository,
      'updateUserDevice',
    );

    const updateEndpointSpy = jest.spyOn(
      mockSNSService,
      'updateEndpointAttributes',
    );

    const subscribeEndpointSpy = jest.spyOn(
      mockSNSService,
      'subscribeEndpointToTopic',
    );
    await service.registerDeviceForPushNotifications({
      deviceId: 'device123',
      deviceOs: 'android',
      firebaseToken: 'token123',
      leadId: 'lead123',
    });

    expect(updateUserDeviceSpy).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        customerOrLeadId: 'lead123',
        deviceId: 'device123',
        deviceOs: 'android',
        firebaseDeviceToken: 'token123',
        idType: IdType.LEAD,
        isActive: true,
        platformApplicationEndpoint: 'snsEndpoint123',
        subscribedSnsTopics: [mockTopicSubscription],
      }),
    );
    expect(updateEndpointSpy).toBeCalledTimes(1);
    expect(updateEndpointSpy).toBeCalledWith('snsEndpoint123', 'token123');
    // expect(subscribeEndpointSpy).toBeCalledTimes(1);
    // expect(subscribeEndpointSpy).toBeCalledWith(
    //   'snsEndpoint123',
    //   'SAMPLE-TOPIC-ARN',
    // );
  });

  describe('removeDeviceFromPushNotifications', () => {
    it('should unsubscribe topics, delete endpoint and remove from DB', async () => {
      jest
        .spyOn(mockUserDeviceRepository, 'findByDeviceIdAndIsActive')
        .mockClear()
        .mockImplementationOnce((deviceId) => {
          return Promise.resolve({
            ...mockUserDevice,
            deviceId,
            subscribedSnsTopics: [mockTopicSubscription],
          });
        });
      const unsubSpy = jest.spyOn(
        mockSNSService,
        'unsubscribeEndpointFromTopic',
      );
      const deleteEndpointSpy = jest.spyOn(mockSNSService, 'deleteEndpoint');
      const deleteDeviceFromDbSpy = jest.spyOn(
        mockUserDeviceRepository,
        'deleteUserDevice',
      );
      await service.removeDeviceFromPushNotifications('device123');
      expect(unsubSpy).toBeCalledWith('subscription1');
      expect(deleteEndpointSpy).toBeCalledWith('snsEndpoint123');
      expect(deleteDeviceFromDbSpy).toBeCalledWith(
        expect.objectContaining({
          customerOrLeadId: 'lead123',
          deviceId: 'device123',
          deviceOs: 'android',
          firebaseDeviceToken: 'token123',
          id: '17e3b105-e31a-46dd-9089-0f1327f35088',
          idType: 'LEAD',
          isActive: true,
          platformApplicationEndpoint: 'snsEndpoint123',
          subscribedSnsTopics: [],
        }),
      );
    });
  });

  it('unenroll all topics', async () => {
    const unsubSpy = jest.spyOn(mockSNSService, 'unsubscribeEndpointFromTopic');
    await service.unenrolAllTopics(mockUserDevice);
    expect(unsubSpy).toHaveBeenNthCalledWith(1, 'subscription1');
  });
  it('enroll topics', async () => {
    const subSpy = jest.spyOn(mockSNSService, 'subscribeEndpointToTopic');
    await service.enrolTopic(mockUserDevice);
    expect(subSpy).toHaveBeenNthCalledWith(
      1,
      'snsEndpoint123',
      'SAMPLE-TOPIC-ARN',
    );
  });

  it('Register Device', async () => {
    const result = await service.registerToken(generateMockDeviceDetailsDTO());
    expect(result).toEqual(true);
  });
});
