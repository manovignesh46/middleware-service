import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SNSService } from './sns.service';
import { ICredentialHelper } from '../../domain/services/credential.service.interface';
import { PublishCommandInput } from '@aws-sdk/client-sns';

describe('SNSService', () => {
  let service: SNSService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SNSService,
        { provide: ConfigService, useValue: createMock<ConfigService>() },
        {
          provide: ICredentialHelper,
          useValue: {
            getCredentials: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SNSService>(SNSService);
  });

  describe('sendSMS', () => {
    it('should call snsClient.send with the correct command', async () => {
      const phoneNumber = '123456789';
      const message = 'Test message';
      const input: PublishCommandInput = {
        PhoneNumber: phoneNumber,
        Message: message,
      };
      const sendSpy = jest.spyOn(service['client'], 'send');
      sendSpy.mockImplementationOnce(() => null);
      await service.sendSMS(phoneNumber, message);
      expect(sendSpy).toHaveBeenCalledWith(expect.objectContaining({ input }));
    });
  });

  describe('sendPushNotification', () => {
    it('should call snsClient.send with the correct command', async () => {
      const endpointArn = 'endpoint123';
      const message = 'Test message';
      const pushId = 'pushId123';
      const messageHeader = 'Message Header';
      const input: PublishCommandInput = {
        TargetArn: endpointArn,
        Message: JSON.stringify({
          title: messageHeader,
          body: message,
          data: {
            pushId: pushId,
          },
        }),
      };
      const sendSpy = jest.spyOn(service['client'], 'send');
      sendSpy.mockImplementationOnce(() => null);
      await service.sendPushNotification(
        pushId,
        endpointArn,
        message,
        messageHeader,
      );
      expect(sendSpy).toHaveBeenCalledWith(expect.objectContaining({ input }));
    });
  });

  describe('sendToTopic', () => {
    it('should call snsClient.send with the correct command', async () => {
      const topicArn = 'topic123';
      const message = 'Test message';
      const messageHeader = 'Message Header';
      const input: PublishCommandInput = {
        TopicArn: topicArn,
        Message: JSON.stringify({ title: messageHeader, body: message }),
      };
      const sendSpy = jest.spyOn(service['client'], 'send');
      sendSpy.mockImplementationOnce(() => null);
      await service.sendToTopic(topicArn, message, messageHeader);
      expect(sendSpy).toHaveBeenCalledWith(expect.objectContaining({ input }));
    });
  });
});
