import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IdType } from '../domain/enum/id-type.enum';
import { LeadStatus } from '../domain/enum/leadStatus.enum';
import { MatchStatus } from '../domain/enum/matchStatus.enum';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustRefinitiv } from '../domain/model/custRefinitiv.interface';
import { ICustScoringData } from '../domain/model/custScoringData.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { ICustTelcoTransaction } from '../domain/model/custTelcoTransaction.interface';
import { IExperianData } from '../domain/model/experian-data.interface';
import { mockCustOtp } from '../domain/model/mocks/cust-otp.mock';
import {
  mockCustTelco,
  mockCustTelcoNotMatched,
} from '../domain/model/mocks/cust-telco.mock';
import { mockExperianData } from '../domain/model/mocks/experian-data.mock';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustScoringDataRepository } from '../domain/repository/custScoringDataRepository.interface';
import { ICustTelcoTransactionRepository } from '../domain/repository/custTelcoTransactionRepository.interface';
import { IExperianDataRepository } from '../domain/repository/experian-data-repository.interface';
import { IContentService } from '../domain/services/content.service.interface';
import { ICustRefinitivService } from '../domain/services/custRefinitivService.interface';
import { ICustScoringDataService } from '../domain/services/custScoringDataService.interface';
import { ICustTelcoService } from '../domain/services/custTelcoService.interface';
import { ICustToLOSService } from '../domain/services/custToLOSService.interface';
import { IExperianService } from '../domain/services/experian-service.interface';
import { ITelcoService } from '../domain/services/telcoService.interface';
import { generateMockCreditScoreDto } from '../infrastructure/controllers/customers/dtos/creditScore.dto.spec';
import { generateMockCreditScoreServiceDto } from '../infrastructure/controllers/customers/dtos/creditScoreService.dto.spec';
import { CustScoringData } from '../infrastructure/entities/custScoringData.entity';
import { ContentService } from '../infrastructure/services/content.service';
import { ExperianService } from '../infrastructure/services/experian.service';
import { MockData } from '../infrastructure/services/mockData';
import { NotificationServiceClient } from '../infrastructure/services/notifiction-service-client/notifications-service-client.service';
import { PushNotificationService } from '../infrastructure/services/push-notification-service';
import { TelcoService } from '../infrastructure/services/telco.service';
import {
  CustScoringDataService,
  CustScoringDataStatusEnum,
} from './custScoringData.service';
import { mockCustToLOSService } from './custToLOS.service.spec';

const generateMockCustScoringData = () => {
  const creditScoreDto = generateMockCreditScoreDto();
  return new CustScoringData(
    creditScoreDto.leadId,
    creditScoreDto.employmentType,
    creditScoreDto.monthlyGrossIncome,
    creditScoreDto.activeBankAccount,
    creditScoreDto.yearsInCurrentPlace,
    creditScoreDto.maritalStatus,
    creditScoreDto.numberOfSchoolKids,
  );
};

describe('CustScoringDataService', () => {
  let service: ICustScoringDataService;

  const mockCustScoringData: ICustScoringData = {
    id: '1234',
    leadId: '123',
    employmentNature: '',
    monthlyGrossIncome: '',
    activeBankAccount: '',
    yearsInCurrentPlace: '',
    maritalStatus: '',
    numberOfSchoolKids: '',
    creditScore: 0,
    prequalifiedAmount: '',
    createdAt: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
    updatedAt: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
  };

  const mockCustScoringDataRepository: ICustScoringDataRepository = {
    findByLeadId: function (leadId: string): Promise<ICustScoringData> {
      if (leadId === '123') return Promise.resolve(mockCustScoringData);
      return null;
    },
    save: function (
      custScoringData: ICustScoringData,
    ): Promise<ICustScoringData> {
      return null;
    },
  };

  const mockCustTelcoService: ICustTelcoService = {
    findCustTelco: function (leadId: string): Promise<ICustTelco> {
      if (leadId === '12' || leadId === '123' || leadId === '12345')
        return Promise.resolve(mockCustTelco);
      else if (leadId === '1234')
        return Promise.resolve(mockCustTelcoNotMatched);
      return null;
    },
    save: function (custTelco: ICustTelco): Promise<ICustTelco> {
      return Promise.resolve(mockCustTelco);
    },
  };

  const mockCustRefinitivService: ICustRefinitivService = {
    findCustRefinitiv: function (leadId: string): Promise<ICustRefinitiv> {
      if (leadId === '123')
        return Promise.resolve(MockData.mockRefinitiveEnityData);
      else if (leadId === '12345') {
        const data = MockData.mockRefinitiveEnityData;
        data.sanctionStatus = MatchStatus.NOT_MATCHED;
        return Promise.resolve(data);
      }

      return null;
    },
    save: function (custRefinitiv: ICustRefinitiv): Promise<ICustRefinitiv> {
      return Promise.resolve(MockData.mockRefinitiveEnityData);
    },
    findAndSaveRefinitiveData: function (
      isLead: boolean,
      idValue: string,
      name: string,
      gender: string,
      dob: string,
      countryName: string,
    ) {
      throw new Error('Function not implemented.');
    },
  };

  const mockCustOTP: ICustOtp = mockCustOtp;

  const mockCustOTPRepository: ICustOtpRepository = {
    create: function (otp: ICustOtp): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    getById: function (id: string): Promise<ICustOtp> {
      return Promise.resolve(mockCustOTP);
    },
    getByMsisdn: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    update: function (otp: ICustOtp): Promise<ICustOtp> {
      return Promise.resolve(mockCustOTP);
    },
    findLeadByNinMsisdnEmail: function (
      nationalIdNumber: string,
      msisdnCountryCode: string,
      msisdn: string,
      email: string,
    ): Promise<ICustOtp[]> {
      throw new Error('Function not implemented.');
    },
    findLeadByFullMsisdnConcat: function (
      fullMsisdn: string,
    ): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    findLeadByExReqIdApprovalIdFullMsisdn: function (
      mtnOptInReqId: string,
      mtnApprovalId: string,
      fullMsisdn: string,
    ): Promise<ICustOtp> {
      return Promise.resolve(mockCustOTP);
    },
    findNonOnboardedLead: function (): Promise<ICustOtp[]> {
      return Promise.resolve(null);
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

  const mockExperianDataRepository: IExperianDataRepository = {
    getById: function (id: string): Promise<IExperianData> {
      throw new Error('Function not implemented.');
    },
    getByIdTypeIdValueAndIsActive: function (
      idType: IdType,
      idValue: string,
    ): Promise<IExperianData> {
      return Promise.resolve(mockExperianData);
    },
    create: function (experianRequest: IExperianData): Promise<IExperianData> {
      throw new Error('Function not implemented.');
    },
    update: function (experianRequest: IExperianData): Promise<IExperianData> {
      throw new Error('Function not implemented.');
    },
  };

  const mockCustTelcoTransactionRepo: ICustTelcoTransactionRepository = {
    findByLeadId: function (leadId: string): Promise<ICustTelcoTransaction> {
      return Promise.resolve(MockData.mockCustTelcoTransactionEntityData);
    },
    save: function (
      custTelcoTransaction: ICustTelcoTransaction,
    ): Promise<ICustTelcoTransaction> {
      return Promise.resolve(MockData.mockCustTelcoTransactionEntityData);
    },
    update: function (
      custTelcoTransaction: ICustTelcoTransaction,
    ): Promise<ICustTelcoTransaction> {
      return Promise.resolve(MockData.mockCustTelcoTransactionEntityData);
    },
  };

  const mockTelcoService = createMock<TelcoService>();
  mockTelcoService.findTelcoTransaction.mockResolvedValue(null);
  const mockExperianService = createMock<ExperianService>();
  mockExperianService.kycEnquiry.mockResolvedValue(null);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ICustScoringDataService, useClass: CustScoringDataService },
        {
          provide: ICustScoringDataRepository,
          useValue: mockCustScoringDataRepository,
        },
        { provide: ICustRefinitivService, useValue: mockCustRefinitivService },
        { provide: ICustTelcoService, useValue: mockCustTelcoService },
        { provide: ICustToLOSService, useValue: mockCustToLOSService },
        { provide: ICustOtpRepository, useValue: mockCustOTPRepository },
        {
          provide: NotificationServiceClient,
          useValue: createMock<NotificationServiceClient>(),
        },
        {
          provide: IExperianDataRepository,
          useValue: mockExperianDataRepository,
        },
        {
          provide: ICustTelcoTransactionRepository,
          useValue: mockCustTelcoTransactionRepo,
        },
        {
          provide: ITelcoService,
          useValue: mockTelcoService,
        },
        {
          provide: IExperianService,
          useValue: mockExperianService,
        },
        { provide: IContentService, useValue: createMock<ContentService>() },
        {
          provide: NotificationServiceClient,
          useValue: createMock<NotificationServiceClient>(),
        },
        {
          provide: PushNotificationService,
          useValue: createMock<PushNotificationService>(),
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<ICustScoringDataService>(ICustScoringDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findCustScoringData,failure, refinitiv matched', async () => {
    const result = await service.findCustScoringData(
      '123',
      generateMockCustScoringData(),
    );
    expect(result).toEqual(
      generateMockCreditScoreServiceDto(
        '123',
        CustScoringDataStatusEnum.SANCTION_SCREENING_FAILED,
        'Refinitiv sanction has a match',
        true,
        true,
      ),
    );
  });

  it('should call findCustScoringData,failure refinitv null', async () => {
    const result = await service.findCustScoringData(
      '12',
      generateMockCustScoringData(),
    );
    expect(result).toEqual(
      generateMockCreditScoreServiceDto(
        '12',
        CustScoringDataStatusEnum.NO_SANCTION_SCREENING_DATA,
        'Sanction screening response not yet received',
        // 'Refinitiv sanction has a match',
        true,
        null,
      ),
    );
  });

  it('should call findCustScoringData,SUCCESS', async () => {
    jest.spyOn(mockCustOTPRepository, 'getById').mockResolvedValueOnce({
      ...mockCustOtp,
      leadCurrentStatus: LeadStatus.LEAD_VERIFIED,
    });
    const result = await service.findCustScoringData(
      '12345',
      generateMockCustScoringData(),
    );
    expect(result).toEqual(
      generateMockCreditScoreServiceDto(
        '12345',
        CustScoringDataStatusEnum.SUCCESS,
        'Both Telco NIN comparison and Refinitiv sanction checks passed',
        true,
        false,
      ),
    );
  });

  it('should call findCustScoringData,failure,telco null', async () => {
    const result = await service.findCustScoringData(
      '1',
      generateMockCustScoringData(),
    );
    expect(result).toEqual(
      generateMockCreditScoreServiceDto(
        '1',
        CustScoringDataStatusEnum.NO_TELCO_KYC_DATA,
        'Telco KYC response not yet received',
        null,
        null,
      ),
    );
  });

  it('should call findCustScoringData,failure,telco not macthed', async () => {
    const result = await service.findCustScoringData(
      '1234',
      generateMockCustScoringData(),
    );
    expect(result).toEqual(
      generateMockCreditScoreServiceDto(
        '1234',
        CustScoringDataStatusEnum.TELCO_KYC_FAILED,
        'Telco NIN comparison failed',
        false,
        null,
      ),
    );
  });
});
