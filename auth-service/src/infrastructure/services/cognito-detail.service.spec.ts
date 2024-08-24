import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { mockCognitoDetail } from '../../domain/models/mocks/cognito-details.mock';
import { ICognitoDetailRepository } from '../../domain/repositories/cognito-detail-repository.interface';
import { mockCognitoDetailRepository } from '../../domain/repositories/mocks/cognito-detail-repository.mock';
import { IAuthService } from '../../domain/services/authService.interface';
import { AwsCognitoAuthService } from '../../usecases/awsCognitoAuth.service';
import { CognitoDetailService } from './cognito-detail.service';

describe('CognitoDetailService', () => {
  let service: CognitoDetailService;
  const msisdnCountryCode = '+123';
  const msisdn = '999999999';

  const mockConfigService = createMock<ConfigService>();
  mockConfigService.get.mockImplementation((envName) => {
    switch (envName) {
      case 'LOGIN_OTP_MAX_RETRIES':
        return 3;
      case 'OTP_LOCKED_COOLOFF_SECONDS':
        return 7200;
      default:
        break;
    }
  });
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        CognitoDetailService,
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: ICognitoDetailRepository,
          useValue: mockCognitoDetailRepository,
        },
        {
          provide: IAuthService,
          useValue: createMock<AwsCognitoAuthService>(),
        },
      ],
    }).compile();
    service = module.get<CognitoDetailService>(CognitoDetailService);
  });

  describe('canLogin', () => {
    it('service should be defined', async () => {
      expect(service).toBeDefined();
    });
    it('canLogin should return true if user is not locked', async () => {
      const result = await service.canLogin(msisdnCountryCode, msisdn);
      expect(result).toEqual(true);
    });
    it('canLogin should throw error if user is locked', async () => {
      jest
        .spyOn(mockCognitoDetailRepository, 'findByMsisdn')
        .mockResolvedValueOnce({
          ...mockCognitoDetail,
          msisdnCountryCode,
          msisdn,
          failedLoginAttempts: 3,
          loginLockedAt: new Date(),
        });
      const result = service.canLogin(msisdnCountryCode, msisdn);
      await expect(result).rejects.toThrowError();
    });
    it('canLogin should throw error if user was locked but beyond cooloff of 2h', async () => {
      jest
        .spyOn(mockCognitoDetailRepository, 'findByMsisdn')
        .mockResolvedValueOnce({
          ...mockCognitoDetail,
          msisdnCountryCode,
          msisdn,
          failedLoginAttempts: 3,
          loginLockedAt: new Date(Date.now() - 7201 * 1000),
        });
      const result = await service.canLogin(msisdnCountryCode, msisdn);
      expect(result).toEqual(true);
    });
  });

  describe('incrementFailedAttempts', () => {
    it('should increment if failed response is 0', async () => {
      const repoSpy = jest.spyOn(mockCognitoDetailRepository, 'update');
      const result = service.incrementFailedAttempts(msisdnCountryCode, msisdn);
      await expect(result).resolves.not.toThrowError();
      expect(repoSpy).toBeCalledWith(
        expect.objectContaining({ failedLoginAttempts: 1 }),
      );
    });
    it('should increment if failed attempts is 1', async () => {
      jest
        .spyOn(mockCognitoDetailRepository, 'findByMsisdn')
        .mockResolvedValueOnce({
          ...mockCognitoDetail,
          msisdnCountryCode,
          msisdn,
          failedLoginAttempts: 1,
        });
      const repoSpy = jest.spyOn(mockCognitoDetailRepository, 'update');
      const result = service.incrementFailedAttempts(msisdnCountryCode, msisdn);
      await expect(result).resolves.not.toThrowError();
      expect(repoSpy).toBeCalledWith(
        expect.objectContaining({ failedLoginAttempts: 2 }),
      );
    });
    it('should throw error once the max failed attempts is hit', async () => {
      jest
        .spyOn(mockCognitoDetailRepository, 'findByMsisdn')
        .mockResolvedValueOnce({
          ...mockCognitoDetail,
          msisdnCountryCode,
          msisdn,
          failedLoginAttempts: 2,
        });
      const repoSpy = jest.spyOn(mockCognitoDetailRepository, 'update');
      const result = service.incrementFailedAttempts(msisdnCountryCode, msisdn);
      await expect(result).rejects.toThrowError();
      expect(repoSpy).toBeCalledWith(
        expect.objectContaining({
          failedLoginAttempts: 3,
          loginLockedAt: expect.any(Date),
        }),
      );
    });
  });

  describe('resetFailedAttempts', () => {
    it('should update repo to set failedLogins to 0, otpSentCount to 0 and loginLockedAt to null', async () => {
      const repoSpy = jest.spyOn(mockCognitoDetailRepository, 'update');

      const result = service.resetFailedAttempts(msisdnCountryCode, msisdn);
      await expect(result).resolves.not.toThrowError();
      expect(repoSpy).toBeCalledWith(
        expect.objectContaining({
          failedLoginAttempts: 0,
          otpSentCount: 0,
          loginLockedAt: null,
        }),
      );
    });
  });

  describe('incrementOtpSentCount', () => {
    it('should increment otpSentCount', async () => {
      jest
        .spyOn(mockCognitoDetailRepository, 'findByMsisdn')
        .mockResolvedValueOnce({
          ...mockCognitoDetail,
          msisdnCountryCode,
          msisdn,
          otpSentCount: 0,
        });
      const repoSpy = jest.spyOn(mockCognitoDetailRepository, 'update');

      await service.incrementOtpSentCount(msisdnCountryCode, msisdn);
      expect(repoSpy).toBeCalledWith(
        expect.objectContaining({
          otpSentCount: 1,
          loginLockedAt: null,
        }),
      );
    });
    it('should set loginLockedAt to date when otpSentCount hits max resends', async () => {
      jest
        .spyOn(mockCognitoDetailRepository, 'findByMsisdn')
        .mockResolvedValueOnce({
          ...mockCognitoDetail,
          msisdnCountryCode,
          msisdn,
          otpSentCount: 2,
        });
      const repoSpy = jest.spyOn(mockCognitoDetailRepository, 'update');

      await service.incrementOtpSentCount(msisdnCountryCode, msisdn);
      expect(repoSpy).toBeCalledWith(
        expect.objectContaining({
          otpSentCount: 3,
          loginLockedAt: expect.any(Date),
        }),
      );
    });
  });
});
