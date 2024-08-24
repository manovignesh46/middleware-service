import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ISMSLog } from '../../domain/model/smsLog.interface';
import { IContentRepository } from '../../domain/repository/contentRepository.interface';
import { ISMSLogRepository } from '../../domain/repository/smsLogRepository.interface';
import { ISmsService } from '../../domain/services/smsService.interface';
import { SmsService } from './sms.service';
import { ICredentialHelper } from '../../domain/services/credential.service.interface';
import { fromEnv } from '@aws-sdk/credential-providers';
import { mockContentRepository } from '../repository/mocks/content.repository.mock';

describe('SmsService', () => {
  let service: ISmsService;

  const mockSmsLogRepository: ISMSLogRepository = {
    save: function (smsLog: ISMSLog): Promise<ISMSLog> {
      return null;
    },
  };
  const mockCredentialHelper: ICredentialHelper = {
    getCredentials: function () {
      return fromEnv();
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ISmsService, useClass: SmsService },
        { provide: IContentRepository, useValue: mockContentRepository },
        { provide: ISMSLogRepository, useValue: mockSmsLogRepository },
        { provide: ICredentialHelper, useValue: mockCredentialHelper },
        ConfigService,
      ],
    }).compile();

    service = module.get<ISmsService>(ISmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call the SMSServuce sendSmsWithReplacable', async () => {
    const replacble = {
      otp: '1234',
    };
    jest.spyOn(service['snsClient'], 'send').mockReturnValueOnce(null);
    const result = await service.sendSmsWithReplacable(
      '7991141715',
      'OTP_SMS',
      replacble,
    );
    expect(result).toEqual(undefined);
  });

  // it('should call AWS snsClient.send with correct parameters', async () => {
  //   const phoneNumber = '+6591700158';
  //   const message = 'My Message';
  //   jest.spyOn(service.snsClient, 'send').mockImplementation();

  //   await service.sendSms(phoneNumber, message);

  //   expect(service.snsClient.send).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       input: expect.objectContaining({
  //         Message: 'My Message',
  //         PhoneNumber: '+6591700158',
  //       }),
  //     }),
  //   );
  // });
});
