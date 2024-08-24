import { Test, TestingModule } from '@nestjs/testing';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { mockCustOtp, mockCustOtp3 } from '../domain/model/mocks/cust-otp.mock';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustOtpService } from '../domain/services/custOtpService.interface';
import { generateMockMTNConsentStatusDTO } from '../infrastructure/controllers/customers/dtos/mtnConsentStatus.dto.spec';
import { CustOtpService } from './custOtp.service';

describe('CustOtpService', () => {
  let service: ICustOtpService;

  const mockCustOtpRespository: ICustOtpRepository = {
    findLeadByNinMsisdnEmail: function (
      nationalIdNumber: string,
      msisdnCountryCode: string,
      msisdn: string,
      email: string,
    ): Promise<ICustOtp[]> {
      return Promise.resolve([mockCustOtp3]);
    },
    create: function (otp: ICustOtp): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    getById: function (id: string): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    getByMsisdn: function (
      msisdn: string,
      msisdnCountryCode: string,
    ): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    update: function (otp: ICustOtp): Promise<ICustOtp> {
      return Promise.resolve(mockCustOtp);
    },
    findLeadByFullMsisdnConcat: function (
      fullMsisdn: string,
    ): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    findNonOnboardedLead: function (): Promise<ICustOtp[]> {
      return Promise.resolve(null);
    },
    findLeadByExReqIdApprovalIdFullMsisdn: function (
      mtnOptInReqId: string,
      mtnApprovalId: string,
      fullMsisdn: string,
    ): Promise<ICustOtp> {
      return Promise.resolve(mockCustOtp);
    },
    findLeadByMsisdnApprovalId: function (
      msisdnCountryCode: string,
      msisdn: string,
      mtnApprovalId: string,
    ): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    findLeadForPurging: function (purgingHour: number): Promise<ICustOtp[]> {
      throw new Error('Function not implemented.');
    },
    updateCustOtpList: function (custOtpList: ICustOtp[]): Promise<ICustOtp[]> {
      throw new Error('Function not implemented.');
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ICustOtpService, useClass: CustOtpService },
        { provide: ICustOtpRepository, useValue: mockCustOtpRespository },
      ],
    }).compile();

    service = module.get<ICustOtpService>(ICustOtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findCustScoringData,failure refinitv null', async () => {
    const result = await service.findCustOTP(
      '999999999999',
      '+ 256',
      '999999999',
      'john@doe.com',
    );
    expect(result).toEqual([mockCustOtp3]);
  });

  it('should call mtnConsentStatus', async () => {
    const result = await service.mtnConsentStatus(
      generateMockMTNConsentStatusDTO(),
    );
    expect(result).toEqual(true);
  });
});
