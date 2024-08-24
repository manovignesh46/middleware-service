import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { OtpAction } from '../../domain/enum/otp-action.enum';
import { mockCustPrimaryDetails } from '../../domain/model/mocks/cust-primary-details.mock';
import { mockGeneralOtp } from '../../domain/model/mocks/general-otp.mock';
import { IContentRepository } from '../../domain/repository/contentRepository.interface';
import { ICustPrimaryDetailsRepository } from '../../domain/repository/custPrimaryDetailsRepository.interface';
import { IGeneralOtpRepository } from '../../domain/repository/general-otp-repository.interface';
import { OtpLockedError } from '../controllers/common/errors/otpLocked.error';
import { OtpNotExpiredError } from '../controllers/common/errors/otpNotExpired.error';
import { GeneralOtpVerifyDto } from '../controllers/customers/dtos/general-otp-verify.dto';
import { mockContentRepository } from '../repository/mocks/content.repository.mock';
import { GeneralOtpService } from './general-otp.service';
import { NotificationServiceClient } from './notifiction-service-client/notifications-service-client.service';

let service: GeneralOtpService;
const customerId = 'customer123';
const fullMsisdn = '+256999999999';

const mockConfigService = {
  get: jest.fn((input) => {
    switch (input) {
      case 'OTP_VALID_SECONDS':
        return 59;
      case 'REGISTER_OTP_MAX_RETRIES':
        return 3;
      case 'OTP_LOCKED_COOLOFF_SECONDS':
        return 7200;
      case 'IS_HARDCODED_OTP':
        return 'true';
      default:
        break;
    }
  }),
};

const mockGeneralOtpRepo = createMock<IGeneralOtpRepository>();
jest
  .spyOn(mockGeneralOtpRepo, 'update')
  .mockImplementation((otp) => Promise.resolve(otp));

jest
  .spyOn(mockGeneralOtpRepo, 'getByCustomerIdAndOtpAction')
  .mockResolvedValue({ ...mockGeneralOtp });

const mockCustPrimaryDetailsRepository =
  createMock<ICustPrimaryDetailsRepository>();
jest
  .spyOn(mockCustPrimaryDetailsRepository, 'getByCustomerId')
  .mockResolvedValue(mockCustPrimaryDetails);
const mockNotificationServiceClient = createMock<NotificationServiceClient>();
const notiSpy = jest.spyOn(mockNotificationServiceClient, 'sendNotification');
describe('GeneralOtpService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        GeneralOtpService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: IGeneralOtpRepository, useValue: mockGeneralOtpRepo },
        { provide: IContentRepository, useValue: mockContentRepository },
        {
          provide: NotificationServiceClient,
          useValue: mockNotificationServiceClient,
        },
        {
          provide: ICustPrimaryDetailsRepository,
          useValue: mockCustPrimaryDetailsRepository,
        },
      ],
    }).compile();
    service = module.get<GeneralOtpService>(GeneralOtpService);
  });

  describe('triggerOtp', () => {
    it('should trigger otp', async () => {
      const result = await service.triggerOtp(
        customerId,
        fullMsisdn,
        OtpAction.LOGIN,
      );
      expect(result).toBeDefined();
      expect(notiSpy).toBeCalled();
    });
    // it('trigger otp should throw otp not expired error if otp sent and not expired', async () => {
    //   jest
    //     .spyOn(mockGeneralOtpRepo, 'getByCustomerIdAndOtpAction')
    //     .mockResolvedValueOnce({
    //       ...mockGeneralOtp,
    //       expiredAt: new Date('3010-12-25'), //otp not yet expired
    //       sentAt: new Date('2023-12-25'), //otp already sent
    //     });
    //   const result = service.triggerOtp(
    //     customerId,
    //     fullMsisdn,
    //     OtpAction.LOGIN,
    //   );
    //   await expect(result).rejects.toThrowError(OtpNotExpiredError);
    //   expect(notiSpy).not.toBeCalled();
    // });
    it('trigger otp should throw otp locked error', async () => {
      jest
        .spyOn(mockGeneralOtpRepo, 'getByCustomerIdAndOtpAction')
        .mockResolvedValueOnce({
          ...mockGeneralOtp,
          lockedAt: new Date(), //otp not yet expired
        });
      const result = service.triggerOtp(
        customerId,
        fullMsisdn,
        OtpAction.LOGIN,
      );
      await expect(result).rejects.toThrowError(OtpLockedError);
      expect(notiSpy).not.toBeCalled();
    });
  });

  const dto: GeneralOtpVerifyDto = {
    customerId,
    msisdnCountryCode: '+256',
    msisdn: '999999999',
    otp: '',
    otpAction: OtpAction.FORGOT_PIN,
  };

  describe('verifyOtp', () => {
    it('should verify otp', async () => {
      const correctOtp = 'ABC-123456';
      const isVerified = await service.verifyOtp({ ...dto, otp: correctOtp });
      expect(isVerified).not.toBeNull();
    });
    it('should fail otp verification, and increment failed attempts', async () => {
      jest
        .spyOn(mockGeneralOtpRepo, 'getByCustomerIdAndOtpAction')
        .mockResolvedValue({
          ...mockGeneralOtp,
          expiredAt: new Date('3010-12-25'),
        });
      const wrongOtp = 'some-wrong-otp';
      const otpRepoSpy = jest.spyOn(mockGeneralOtpRepo, 'update');
      const isVerified = await service.verifyOtp({ ...dto, otp: wrongOtp });
      expect(isVerified).toBeNull();
      expect(otpRepoSpy).toBeCalledWith(
        expect.objectContaining({ failedAttempts: 1 }),
      );
      await service.verifyOtp({ ...dto, otp: wrongOtp });
      expect(otpRepoSpy).toBeCalledWith(
        expect.objectContaining({ failedAttempts: 2 }),
      );
    });
  });

  describe('verifyOtpVerifiedKey', () => {
    it('Should return true if valid', async () => {
      const otpVerifiedKey = 'verifiedKey123';
      jest
        .spyOn(mockGeneralOtpRepo, 'getByCustomerIdAndOtpAction')
        .mockResolvedValueOnce({
          ...mockGeneralOtp,
          verifiedAt: new Date(),
          otpVerifiedKey,
          otpVerifiedKeyExpiredAt: new Date('3010-12-25'), // not expired
        });

      const result = await service.verifyOtpVerfiedKey(
        'customer123',
        otpVerifiedKey,
        OtpAction.FORGOT_PIN,
      );
      expect(result).toEqual(mockCustPrimaryDetails);
    });
    it('Should return null if otpVerifiedKey wrong', async () => {
      const correctOtpVerifiedKey = 'verificationKey123';
      const wrongOtpVerifiedKey = 'someWrongKey';
      jest
        .spyOn(mockGeneralOtpRepo, 'getByCustomerIdAndOtpAction')
        .mockResolvedValueOnce({
          ...mockGeneralOtp,
          verifiedAt: new Date(),
          otpVerifiedKey: correctOtpVerifiedKey,
          otpVerifiedKeyExpiredAt: new Date('3010-12-25'), // not expired
        });

      const result = await service.verifyOtpVerfiedKey(
        'customer123',
        wrongOtpVerifiedKey,
        OtpAction.FORGOT_PIN,
      );
      expect(result).toBeNull();
    });
    it('Should return null if otpVerifiedKey expired', async () => {
      const otpVerifiedKey = 'verifiedKey123';
      jest
        .spyOn(mockGeneralOtpRepo, 'getByCustomerIdAndOtpAction')
        .mockResolvedValueOnce({
          ...mockGeneralOtp,
          verifiedAt: new Date(),
          otpVerifiedKey: otpVerifiedKey,
          otpVerifiedKeyExpiredAt: new Date('1990-12-25'), // not expired
        });

      const result = await service.verifyOtpVerfiedKey(
        'customer123',
        otpVerifiedKey,
        OtpAction.FORGOT_PIN,
      );
      expect(result).toBeNull();
    });
  });
});
