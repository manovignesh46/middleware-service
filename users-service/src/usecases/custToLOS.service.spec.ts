import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LeadStatus } from '../domain/enum/leadStatus.enum';
import { LOSStatus } from '../domain/enum/losStatus.enum';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustRefinitiv } from '../domain/model/custRefinitiv.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { ICustToLOS } from '../domain/model/custToLOS.interface';
import { mockCustOtp } from '../domain/model/mocks/cust-otp.mock';
import {
  mockCustTelco,
  mockCustTelcoNotMatched,
} from '../domain/model/mocks/cust-telco.mock';
import { IOfferConfig } from '../domain/model/offerConfig.interface';
import { IStudentDetails } from '../domain/model/studentDetails.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { ICustToLOSRepository } from '../domain/repository/custToLOSRepository.interface';
import { IOfferConfigRepository } from '../domain/repository/offerConfigRepository.interface';
import { IWhitelistedStudentDetailsRepository } from '../domain/repository/whitelistedStudentDetailsRepository.interface';
import { ICustRefinitivService } from '../domain/services/custRefinitivService.interface';
import { ICustTelcoService } from '../domain/services/custTelcoService.interface';
import { ICustToLOSService } from '../domain/services/custToLOSService.interface';
import { ILOSService } from '../domain/services/losService.interface';
import { IRequestServiceClient } from '../domain/services/requestServiceClient.service';
import { CreditScoreDto } from '../infrastructure/controllers/customers/dtos/creditScore.dto';
import { generateMockCreditScoreDto } from '../infrastructure/controllers/customers/dtos/creditScore.dto.spec';
import { LOSOutcomeDTO } from '../infrastructure/controllers/customers/dtos/losOutcome.dto';
import { RunWorkFlowDTO } from '../infrastructure/controllers/customers/dtos/runApiLOSOutcome.dto';
import { ConfirmStudentDetailsPresenter } from '../infrastructure/controllers/customers/presenters/confirmStudentDetails.presenter';
import { DashBoardPresenter } from '../infrastructure/controllers/customers/presenters/dashBoard.presenter';
import { generateMockDashBoardDetailsPresenter } from '../infrastructure/controllers/customers/presenters/dashBoard.presenter.spec';
import { CustScoringData } from '../infrastructure/entities/custScoringData.entity';
import { CustPrimaryDetailsRepository } from '../infrastructure/repository/custPrimaryDetails.repository';
import { mockWhitelistedStudentDetailsRepository } from '../infrastructure/repository/mocks/whitelisted-student-details.repository.mock';
import { MockData } from '../infrastructure/services/mockData';
import { RifinitiveService } from '../infrastructure/services/refinitive.service';
import { RequestServiceClient } from '../infrastructure/services/requestServiceClient.service';
import { CustToLOSService } from './custToLOS.service';
import { ExperianData } from './experianData';

export const mockCustToLOSService: ICustToLOSService = {
  leadCreationInLOS: function (
    leadId: string,
    leadCurrentStatus: LeadStatus,
  ): Promise<any> {
    return null;
  },
  leadVerifiedInLOS: function (leadId: string): Promise<any> {
    return null;
  },
  leadEnhancedInLOS: function (
    leadId: string,
    custScoringData: CustScoringData,
  ): Promise<any> {
    return null;
  },
  getCustomerLoansFromLOS: function (
    custId: string,
    custloanStatus: boolean,
    offset: number,
    limit: number,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    return null;
  },
  dashBoardDetails: function (
    targetApiUUID: string,
  ): Promise<DashBoardPresenter> {
    return null;
  },
  updateStudentDetails: function (
    leadId: string,
    studentDetails: IStudentDetails,
    schoolAggregatoreName: string,
  ): Promise<ConfirmStudentDetailsPresenter> {
    return null;
  },
  createRepeatWorkflow: function (
    leadId: string,
    msisdn: string,
  ): Promise<any> {
    throw new Error('Function not implemented.');
  },
  terminateOngoingLoans: function (custId: string): Promise<boolean> {
    throw new Error('Function not implemented.');
  },
  cancelLoanWorkflow: function (
    custId: string,
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<any> {
    throw new Error('Function not implemented.');
  },
  cancelOnboardingWorkflow: function (
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<any> {
    return Promise.resolve();
  },
  pinCreationInLOS: function (
    leadId: string,
    pinCreated: boolean,
  ): Promise<any> {
    return Promise.resolve(true);
  },
  checkForRejection: function (leadId: string): Promise<any> {
    return Promise.resolve(null);
  },
};

describe('CustToLOSService', () => {
  let service: ICustToLOSService;

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

  const mockCustToLOSRepository: ICustToLOSRepository = {
    createUpdate: function (custToLOS: ICustToLOS): Promise<ICustToLOS> {
      return Promise.resolve(custToLOS);
    },
  };

  const mockLOSService: ILOSService = {
    getCustomerLoans: function (dataToCRM: any): Promise<any> {
      return Promise.resolve({
        summary: [
          {
            productType: 'EDUCATION',
            studentName: 'Albert John',
            dueDate: '12/06/2023',
            loanAmount: '22000',
          },
          {
            productType: 'EDUCATION',
            studentName: 'Albert John',
            dueDate: '12/07/2023',
            loanAmount: '22000',
          },
          {
            productType: 'EDUCATION',
            studentName: 'Albert John',
            dueDate: '12/08/2023',
            loanAmount: '22000',
          },
        ],
        limit: 3,
        offset: 1,
        totalCount: 3,
        loanId: '5a8a78a0-d43e-11ed-afa1-0242ac120002',
        customerId: '926e32b8-2704-428e-9649-5b31757772ea',
        lastTransactionDate: '12/03/2023',
        status: 'ACTIVE',
        updatedAt: '2023-02-06T05:47:34.963Z',
        createdAt: '2023-02-06T05:47:34.963Z',
      });
    },

    runWorkFlow: function (runWorkFlowDto: RunWorkFlowDTO): Promise<any> {
      return Promise.resolve(ExperianData.mockLOSResponse);
    },
    interactionOutcome: function (
      secondaryUUID: string,
      losOutcomeDTO: LOSOutcomeDTO,
    ): Promise<any> {
      return Promise.resolve(true);
    },
    interactionTarget: function (uuid: string): Promise<any> {
      return Promise.resolve(ExperianData.mockLOSResponse);
    },
    cancelWorkflow: function (fullMsisdn: string): Promise<any> {
      throw new Error('Function not implemented.');
    },
  };

  const mockCustOTPRepository: ICustOtpRepository = {
    create: function (otp: ICustOtp): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    getById: function (id: string): Promise<ICustOtp> {
      return Promise.resolve(mockCustOtp);
    },
    getByMsisdn: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    update: function (otp: ICustOtp): Promise<ICustOtp> {
      return Promise.resolve(mockCustOtp);
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
      throw new Error('Function not implemented.');
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

  const mockConfigService: DeepMocked<ConfigService> =
    createMock<ConfigService>();

  const mockOfferConfigRepository: IOfferConfigRepository = {
    findOfferId: function (offerId: string): Promise<IOfferConfig> {
      return null;
    },
    save: function (offerConfig: IOfferConfig): Promise<IOfferConfig> {
      return null;
    },
  };

  const mockCustRefinitiveService: ICustRefinitivService = {
    findAndSaveRefinitiveData: function (
      isLead: boolean,
      idValue: string,
      name: string,
      gender: string,
      dob: string,
      countryName: string,
    ) {
      return null;
    },
    findCustRefinitiv: function (leadId: string): Promise<ICustRefinitiv> {
      return Promise.resolve(MockData.mockCustRefinitiveEntityData);
    },
    save: function (custRefinitiv: ICustRefinitiv): Promise<ICustRefinitiv> {
      return Promise.resolve(MockData.mockCustRefinitiveEntityData);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ICustToLOSService, useClass: CustToLOSService },
        { provide: ICustToLOSRepository, useValue: mockCustToLOSRepository },
        { provide: ILOSService, useValue: mockLOSService },
        { provide: ICustOtpRepository, useValue: mockCustOTPRepository },
        { provide: ICustTelcoService, useValue: mockCustTelcoService },
        {
          provide: IOfferConfigRepository,
          useValue: mockOfferConfigRepository,
        },
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: ICustRefinitivService,
          useValue: createMock<RifinitiveService>(),
        },
        {
          provide: IRequestServiceClient,
          useValue: createMock<RequestServiceClient>(),
        },
        {
          provide: ICustPrimaryDetailsRepository,
          useValue: createMock<CustPrimaryDetailsRepository>(),
        },
        {
          provide: IWhitelistedStudentDetailsRepository,
          useValue: mockWhitelistedStudentDetailsRepository,
        },
      ],
    }).compile();

    service = module.get<ICustToLOSService>(ICustToLOSService);
    jest
      .spyOn(mockConfigService, 'get')
      .mockReturnValueOnce('SAMPLE_LOS_PARTNER_CODE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call the CustToLOSService service', async () => {
    const leadId = '1234';
    const leadStatus: LeadStatus = LeadStatus.DEDUPE_SUCCESS;
    const spy = jest.spyOn(service, 'leadCreationInLOS').mockImplementation();
    await service.leadCreationInLOS(leadId, leadStatus);
    expect(spy).toHaveBeenCalled();
  });

  it('LOS leadCreationInLOS', async () => {
    const leadId = '1234';
    const leadStatus: LeadStatus = LeadStatus.DEDUPE_SUCCESS;

    const result = await service.leadCreationInLOS(leadId, leadStatus);
    expect(result).toEqual(null);
  });

  it('LOS leadVerifiedInLOS', async () => {
    jest.spyOn(mockLOSService, 'interactionTarget').mockResolvedValueOnce({
      actions: [
        {
          uuid: '374fbcbe-e804-472e-83b9-adc40b54b326',
          action: LOSStatus.LEAD_VERIFIED,
        },
      ],
    });
    const leadId = '1234';
    const result = await service.leadVerifiedInLOS(leadId);
    expect(result).toEqual(true);
  });

  it('LOS leadEnhancedInLOS', async () => {
    jest.spyOn(mockLOSService, 'interactionTarget').mockResolvedValueOnce({
      actions: [
        {
          uuid: '374fbcbe-e804-472e-83b9-adc40b54b326',
          action: LOSStatus.LEAD_ENHANCED,
        },
      ],
    });
    const creditScoreDto: CreditScoreDto = generateMockCreditScoreDto();
    const leadId = '1234';
    const result = await service.leadEnhancedInLOS(
      leadId,
      new CustScoringData(
        creditScoreDto.leadId,
        creditScoreDto.employmentType,
        creditScoreDto.monthlyGrossIncome,
        creditScoreDto.activeBankAccount,
        creditScoreDto.yearsInCurrentPlace,
        creditScoreDto.maritalStatus,
        creditScoreDto.numberOfSchoolKids,
      ),
      ExperianData.experian,
      MockData.mockTelcoTransactionData,
    );
    expect(result).toEqual(true);
  });

  it('should call the getCustomerLoansFromLOS service', async () => {
    const custId = '1234';
    const custloanStatus = true;
    const offset = 1;
    const limit = 3;
    const startDate = '22/02/2023';
    const endDate = '22/03/2023';
    const spy = jest
      .spyOn(service, 'getCustomerLoansFromLOS')
      .mockImplementation();
    await service.getCustomerLoansFromLOS(
      custId,
      custloanStatus,
      offset,
      limit,
      startDate,
      endDate,
    );
    expect(spy).toHaveBeenCalled();
  });

  it('LOS dashBoardDetails', async () => {
    const result: DashBoardPresenter = await service.dashBoardDetails(
      'basdasd',
    );
    const expected: DashBoardPresenter =
      await generateMockDashBoardDetailsPresenter();
    // expected.studentsDetails = undefined;
    expect(result).toEqual(expected);
  });
});
