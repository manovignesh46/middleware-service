import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DedupStatus } from '../domain/enum/dedupStatus.enum';
import { LeadStatus } from '../domain/enum/leadStatus.enum';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { mockCustOtp, mockCustOtp2 } from '../domain/model/mocks/cust-otp.mock';
import { mockCustPrimaryDetails } from '../domain/model/mocks/cust-primary-details.mock';
import { ICustDedupRepository } from '../domain/repository/custDedupRespository.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustDedupService } from '../domain/services/custDedupService.interface';
import { ICustOtpService } from '../domain/services/custOtpService.interface';
import { ICustPrimaryDetailsService } from '../domain/services/custPrimaryDetailsService.interface';
import { ErrorMessage } from '../infrastructure/controllers/common/errors/enums/errorMessage.enum';
import { mockCustDedupRepository } from '../infrastructure/repository/mocks/cust-dedup.repository.mock';
import { CustDedupService } from './custDedup.service';
import { MTNConsentStatusDTO } from '../infrastructure/controllers/customers/dtos/mtnConsentStatus.dto';

describe('CustDedupService', () => {
  let service: ICustDedupService;

  const currDate: Date = new Date();

  const mockCustOtpService: ICustOtpService = {
    findCustOTP: function (
      nationalIdNumber: string,
      msisdnCountryCode: string,
      msisdn: string,
      email: string,
    ): Promise<ICustOtp[]> {
      if (msisdn === '7991140001')
        return Promise.resolve([
          { ...mockCustOtp2, msisdnCountryCode, msisdn, nationalIdNumber },
        ]);
      return Promise.resolve([
        { ...mockCustOtp, msisdnCountryCode, msisdn, nationalIdNumber },
      ]);
    },
    mtnConsentStatus: function (
      mtnConsentStatusDTO: MTNConsentStatusDTO,
    ): Promise<boolean> {
      return Promise.resolve(true);
    },
  };

  const mockCustPrimaryDetailsService: ICustPrimaryDetailsService = {
    findCustPrimaryDetails: function (
      nationalIdNumber: string,
      msisdnCountryCode: string,
      msisdn: string,
      email: string,
    ): Promise<ICustPrimaryDetails[]> {
      if (msisdn === '7991140001')
        return Promise.resolve([
          {
            ...mockCustPrimaryDetails,
            msisdnCountryCode,
            msisdn,
            nationalIdNumber,
          },
        ]);
      return null;
    },
    createCustPrimaryDeatils: function (
      custPrimaryDetails: ICustPrimaryDetails,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
  };

  const mockCustOtpRepository = createMock<ICustOtpRepository>();

  beforeEach(async () => {
    jest.clearAllMocks();
    mockCustOtpRepository.findLeadByNinMsisdnEmail.mockResolvedValue([
      { ...mockCustOtp, leadCurrentStatus: LeadStatus.OTP_GENERATED },
    ]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ICustDedupService, useClass: CustDedupService },
        { provide: ICustDedupRepository, useValue: mockCustDedupRepository },
        { provide: ICustOtpService, useValue: mockCustOtpService },
        {
          provide: ICustPrimaryDetailsService,
          useValue: mockCustPrimaryDetailsService,
        },
        {
          provide: ICustOtpRepository,
          useValue: mockCustOtpRepository,
        },
      ],
    }).compile();

    service = module.get<ICustDedupService>(ICustDedupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call the CustDedup service', async () => {
    const nin = '12345';
    const msisdn = '987654321';
    const email = 'abx@gmail.com';

    const spy = jest.spyOn(service, 'checkWIPDedup').mockImplementation();
    await service.checkWIPDedup(nin, null, msisdn, email);
    expect(spy).toHaveBeenCalled();
  });

  it('CustDedup checkWIPDedup, DEDUP_NO_MATCH', async () => {
    const nin = '12345';
    const msisdn = '7991140000';
    const email = 'abx@gmail.com';

    const result = service.checkWIPDedup(nin, null, msisdn, email);
    await expect(result).rejects.toThrowError();
  });

  it('CustDedup checkWIPDedup,DEDUP_MATCH ', async () => {
    const nin = '12345';
    const msisdn = '7991140001';
    const email = 'abZ@gmail.com';

    const result = await service.checkWIPDedup(nin, null, msisdn, email);
    expect(result).toEqual({ responseStatus: 'DEDUP_MATCH' });
  });
  it('CustDedup checkWIPDedup,DEDUP_MATCH ', async () => {
    const nin = '12345';
    const msisdn = '7991140001';
    const email = 'abZ@gmail.com';

    const result = await service.checkWIPDedup(nin, null, msisdn, email);
    expect(result).toEqual({ responseStatus: 'DEDUP_MATCH' });
  });
  it('If nin / msisdn dont match db, should throw error if OTP_VERIFIED', async () => {
    jest.spyOn(mockCustOtpService, 'findCustOTP').mockResolvedValueOnce([
      {
        ...mockCustOtp,
        msisdn: '999',
        leadCurrentStatus: LeadStatus.OTP_VERIFIED,
      },
    ]);
    const nin = '12345';
    const msisdn = '7991140001';
    const email = 'abZ@gmail.com';

    const result = service.checkWIPDedup(nin, null, msisdn, email);
    await expect(result).rejects.toThrowError(
      Error(ErrorMessage.EXISTING_LEAD_WITH_DIFFERENT_NIN_OR_MSISDN),
    );
  });

  it('If nin / msisdn match db, should WIP return response if OTP_GENERATED / OTP_FAILED', async () => {
    const msisdnCountryCode = '+256';
    const msisdn = '7991140000';
    const nin = '12345';
    const email = 'abZ@gmail.com';
    const mockedCustOtp = {
      ...mockCustOtp,
      msisdnCountryCode,
      msisdn,
      nationalIdNumber: nin,
      leadCurrentStatus: LeadStatus.OTP_GENERATED,
    };
    jest
      .spyOn(mockCustOtpService, 'findCustOTP')
      .mockResolvedValueOnce([mockedCustOtp]);

    const result = await service.checkWIPDedup(
      nin,
      msisdnCountryCode,
      msisdn,
      email,
    );
    expect(result).toEqual({
      responseStatus: DedupStatus.WIP,
      custOtp: mockedCustOtp,
    });
  });
  it('If nin / msisdn match db, should WIP return response if OTP_GENERATED / OTP_FAILED', async () => {
    const msisdnCountryCode = '+256';
    const msisdn = '7991140000';
    const nin = '12345';
    const email = 'abZ@gmail.com';
    const mockedCustOtp = {
      ...mockCustOtp,
      msisdnCountryCode,
      msisdn: '999',
      nationalIdNumber: nin,
      leadCurrentStatus: LeadStatus.OTP_GENERATED,
    };
    jest
      .spyOn(mockCustOtpService, 'findCustOTP')
      .mockResolvedValueOnce([mockedCustOtp]);

    const result = await service.checkWIPDedup(
      nin,
      msisdnCountryCode,
      msisdn,
      email,
    );
    expect(result).toEqual({
      responseStatus: DedupStatus.DEDUP_NO_MATCH,
    });
  });
});
