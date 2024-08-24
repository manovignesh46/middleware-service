import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LeadStatus } from '../domain/enum/leadStatus.enum';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { mockCustPrimaryDetails } from '../domain/model/mocks/cust-primary-details.mock';
import { mockWhitelistedStudentDetails } from '../domain/model/mocks/whitelisted-student-details.mock';
import { IOfferConfig } from '../domain/model/offerConfig.interface';
import { IStudentDetails } from '../domain/model/studentDetails.interface';
import { IWhitelistedStudentDetails } from '../domain/model/whitelistedStudentDetails.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { IOfferConfigRepository } from '../domain/repository/offerConfigRepository.interface';
import { IStudentDetailsRepository } from '../domain/repository/studentDetailsRepository.interface';
import { IWhitelistedStudentDetailsRepository } from '../domain/repository/whitelistedStudentDetailsRepository.interface';
import { ICustToLOSService } from '../domain/services/custToLOSService.interface';
import { ISchoolAggregatorService } from '../domain/services/schoolAggregatorService.interface';
import { IStudentDetailsService } from '../domain/services/studentDetailsService.interface';
import { generateMockStatusPresenter } from '../infrastructure/controllers/common/statusMessage.presenter';
import { ConfirmStudentDetailsDto } from '../infrastructure/controllers/customers/dtos/confirmStudentDetails.dto';
import { generateMockConfirmStudentDetailsDto } from '../infrastructure/controllers/customers/dtos/confirmStudentDetails.dto.spec';
import { DeleteStudentDetailsDTO } from '../infrastructure/controllers/customers/dtos/deleteStudentDetails.dto';
import { generateMockDeleteStudentDetailsDTO } from '../infrastructure/controllers/customers/dtos/deleteStudentDetails.dto.spec';
import {
  RetrieveStudentDetailsDto,
  SchoolAggregatorGetStudentDetailsRequestDto,
} from '../infrastructure/controllers/customers/dtos/retrieveStudentDetails.dto';
import { genertaeMockRetrieveStudentDetailsDto } from '../infrastructure/controllers/customers/dtos/retrieveStudentDetails.dto.spec';
import { ConfirmStudentDetailsPresenter } from '../infrastructure/controllers/customers/presenters/confirmStudentDetails.presenter';
import { generateMockConfirmStudentDetailsPresenter } from '../infrastructure/controllers/customers/presenters/confirmStudentDetails.presenter.spec';
import { DashBoardPresenter } from '../infrastructure/controllers/customers/presenters/dashBoard.presenter';
import { RetrieveStudentDetailsPresenter } from '../infrastructure/controllers/customers/presenters/retrieveStudentDetails.presenter';
import { genertaeMockRetrieveStudentDetailsPresenter } from '../infrastructure/controllers/customers/presenters/retrieveStudentDetails.presenter.spec';
import { CustScoringData } from '../infrastructure/entities/custScoringData.entity';
import { PegPaySchoolAggregator } from '../infrastructure/services/pegpay-school-aggregator.service';
import { SchoolPaySchoolAggregatorService } from '../infrastructure/services/schoolpay-school-aggregator.service';
import { StudentDetailsService } from './studentDetails.service';
import { mockStudentDetails } from '../domain/model/mocks/student-details.mock';
import { generateMockAddStudentDetailsDto } from '../infrastructure/controllers/customers/dtos/addStudentDetails.dto.spec';
import { IntegratorErrorMappingService } from '../modules/error-mapping/integrator-error-mapping.service';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { CustOtpRepository } from '../infrastructure/repository/custOtp.repository';
import { AggregatorWhiteListingService } from '../infrastructure/services/aggregatorWhitelisting.service';

describe('studentDetailsService', () => {
  let service: IStudentDetailsService;

  const mockRetrieveStudentDetailsDto: RetrieveStudentDetailsDto =
    genertaeMockRetrieveStudentDetailsDto();

  const mockRetrieveStudentDetailsPresenter: RetrieveStudentDetailsPresenter =
    genertaeMockRetrieveStudentDetailsPresenter();

  const mockConfirmStudentDetailsDto: ConfirmStudentDetailsDto =
    generateMockConfirmStudentDetailsDto();

  const mockConfirmStudentDetailsPresenter: ConfirmStudentDetailsPresenter =
    generateMockConfirmStudentDetailsPresenter();

  const mockSchoolAggregatorService: ISchoolAggregatorService = {
    retrieveStudentDetails: function (
      schoolAggregatorGetStudentDetailsRequestDto: SchoolAggregatorGetStudentDetailsRequestDto,
    ): Promise<IStudentDetails> {
      return Promise.resolve({
        ...mockStudentDetails,
        responseStatusCode: '0',
      });
    },
  };

  const mockStudentDetailsRepository: IStudentDetailsRepository = {
    save: function (studentDetails: IStudentDetails): Promise<IStudentDetails> {
      return Promise.resolve(studentDetails);
    },

    findByStudentIdCustId: function (
      studentId: string,
      studentAssociatedWith: string,
    ): Promise<IStudentDetails> {
      return null;
    },

    findStudentByCustId: function (
      studentAssociatedWith: string,
    ): Promise<IStudentDetails[]> {
      return Promise.resolve([
        { ...mockStudentDetails, aggregatorId: 'PEGPAY' },
      ]);
    },
    findByStudentIdCustIdRegID: function (
      studentId: string,
      studentAssociatedWith: string,
      studentSchoolRegnNumber: string,
    ): Promise<IStudentDetails> {
      return Promise.resolve(mockStudentDetails);
    },
    findBySchoolCodeCustIdRegId: function (
      studentSchoolCode: string,
      studentAssociatedWith: string,
      studentSchoolRegnNumber: string,
    ): Promise<IStudentDetails> {
      return Promise.resolve(mockStudentDetails);
    },
    countByAggregatorId: function (aggregatorId: string): Promise<number> {
      return Promise.resolve(1);
    },
    countByCustomerIdAggregatorId: function (
      custId: string,
      aggregatorId: string,
    ): Promise<number> {
      return Promise.resolve(1);
    },
    findByStudentUUID: function (studentId: any): Promise<IStudentDetails> {
      return Promise.resolve(mockStudentDetails);
    },
    findByPCOIdAndCustId: function (
      studentPCOId: string,
      associatedCustomerId: string,
    ): Promise<IStudentDetails> {
      return Promise.resolve({
        ...mockStudentDetails,
        studentPCOId,
        associatedCustomerId,
        aggregatorId: 'PEGPAY',
      });
    },
  };

  const mockCustToLOSService: ICustToLOSService = {
    leadCreationInLOS: function (
      leadId: string,
      leadCurrentStatus: LeadStatus,
    ): Promise<any> {
      throw new Error('Function not implemented.');
    },
    leadVerifiedInLOS: function (leadId: string): Promise<any> {
      throw new Error('Function not implemented.');
    },
    leadEnhancedInLOS: function (
      leadId: string,
      custScoringData: CustScoringData,
    ): Promise<any> {
      throw new Error('Function not implemented.');
    },
    getCustomerLoansFromLOS: function (
      custId: string,
      custloanStatus: boolean,
      offset: number,
      limit: number,
      startDate: string,
      endDate: string,
    ): Promise<any> {
      throw new Error('Function not implemented.');
    },
    dashBoardDetails: function (
      targetApiUUID: string,
    ): Promise<DashBoardPresenter> {
      throw new Error('Function not implemented.');
    },
    updateStudentDetails: function (
      leadId: string,
      studentDetails: IStudentDetails,
      schoolAggregatoreName: string,
    ): Promise<ConfirmStudentDetailsPresenter> {
      return Promise.resolve(generateMockConfirmStudentDetailsPresenter());
    },
    createRepeatWorkflow: function (
      leadId: string,
      msisdn: string,
    ): Promise<any> {
      return;
    },
    terminateOngoingLoans: function (custId: string): Promise<boolean> {
      throw new Error('Function not implemented.');
    },
    cancelLoanWorkflow: function (
      custId: string,
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<any> {
      return;
    },
    cancelOnboardingWorkflow: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<any> {
      throw new Error('Function not implemented.');
    },
    pinCreationInLOS: function (
      leadId: string,
      pinCreated: boolean,
    ): Promise<any> {
      throw new Error('Function not implemented.');
    },
    checkForRejection: function (leadId: string): Promise<any> {
      throw new Error('Function not implemented.');
    },
  };

  const mockCustPrimaryDetailsRepository: ICustPrimaryDetailsRepository = {
    create: function (
      custPrimaryDetails: ICustPrimaryDetails,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    findByNinMsisdnEmail: function (
      nationalIdNumber: string,
      msisdnCountryCode: string,
      msisdn: string,
      email: string,
    ): Promise<ICustPrimaryDetails[]> {
      throw new Error('Function not implemented.');
    },
    getCustomerByLeadId: function (
      leadId: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    deleteCustomer: function (
      customerId: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    getCustomerByCustomerId: function (
      id: string,
    ): Promise<ICustPrimaryDetails> {
      return Promise.resolve(mockCustPrimaryDetails);
    },
    getByCustomerId: function (
      customerId: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    findByNinMsisdn: function (
      nationalIdNumber: string,
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    updateCustomer: function (
      customer: ICustPrimaryDetails,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    getByEmail: function (
      email: string,
      custId: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    getZeroLoansCust: function (): Promise<ICustPrimaryDetails[]> {
      return Promise.resolve(null);
    },
    findByMsisdn: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    decrementIdExpiryDays: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
    getCustomersByIdExpiryDaysList: function (): Promise<
      ICustPrimaryDetails[]
    > {
      throw new Error('Function not implemented.');
    },
    setExpiredIdStatus: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
  };

  const mockOfferConfig: IOfferConfig = {
    offerId: '1674033014999',
    offerName: 'NewInstallment',
    offerDescription: 'Installment',
    offerImage: '',
    offerProvider: '',
    activeStatus: 'Active',
    tenure: 90,
    roi: '0.005',
    noOfInstallment: '',
    repaymentFrequency: 'monthly',
    offerLimit: 180000,
    applicationFee: '100',
    createdAt: undefined,
    updatedAt: undefined,
  };

  const mockOfferConfigRespository: IOfferConfigRepository = {
    findOfferId: function (offerId: string): Promise<IOfferConfig> {
      return Promise.resolve(mockOfferConfig);
    },
    save: function (offerConfig: IOfferConfig): Promise<IOfferConfig> {
      return null;
    },
  };

  const mockCustOtpRepository: ICustOtpRepository =
    createMock<CustOtpRepository>();

  const mockWhitelistedStudentDetailsRepository: IWhitelistedStudentDetailsRepository =
    {
      save: function (
        whitelistStudentDetails: IWhitelistedStudentDetails,
      ): Promise<IWhitelistedStudentDetails> {
        return Promise.resolve(mockWhitelistedStudentDetails);
      },
      findAllStudentsByLeadId: function (
        leadId: string,
      ): Promise<IWhitelistedStudentDetails[]> {
        return Promise.resolve([mockWhitelistedStudentDetails]);
      },
      removeStudentDetails: function (
        whitelistedStudentDetails: IWhitelistedStudentDetails,
      ): Promise<IWhitelistedStudentDetails> {
        return Promise.resolve(mockWhitelistedStudentDetails);
      },
      findStudentByLeadIdAndStudentId: function (
        leadId: string,
        studentId: string,
      ): Promise<IWhitelistedStudentDetails> {
        return Promise.resolve(mockWhitelistedStudentDetails);
      },
      findStudentByLeadIdAndStudentRegNumberAndSchoolCode: function (
        leadId: string,
        studentSchoolRegnNumber: string,
        studentSchoolCode: string,
      ): Promise<IWhitelistedStudentDetails> {
        return Promise.resolve(mockWhitelistedStudentDetails);
      },
      findByPaymentCodeInRegNumber: function (
        leadId: string,
        paymentCode: string,
      ): Promise<IWhitelistedStudentDetails> {
        return Promise.resolve(mockWhitelistedStudentDetails);
      },
      findByRegNumberInPaymentCode: function (
        leadId: string,
        regNumber: string,
      ): Promise<IWhitelistedStudentDetails> {
        return Promise.resolve(mockWhitelistedStudentDetails);
      },
    };

  const mockAggregatorWhitelistingService =
    createMock<AggregatorWhiteListingService>();

  const mockConfigService: DeepMocked<ConfigService> =
    createMock<ConfigService>();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: IStudentDetailsService, useClass: StudentDetailsService },
        {
          provide: IStudentDetailsRepository,
          useValue: mockStudentDetailsRepository,
        },
        {
          provide: PegPaySchoolAggregator,
          useValue: mockSchoolAggregatorService,
        },
        {
          provide: SchoolPaySchoolAggregatorService,
          useValue: mockSchoolAggregatorService,
        },
        { provide: ICustToLOSService, useValue: mockCustToLOSService },
        {
          provide: ICustPrimaryDetailsRepository,
          useValue: mockCustPrimaryDetailsRepository,
        },
        {
          provide: IOfferConfigRepository,
          useValue: mockOfferConfigRespository,
        },
        {
          provide: IWhitelistedStudentDetailsRepository,
          useValue: mockWhitelistedStudentDetailsRepository,
        },
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: IntegratorErrorMappingService,
          useValue: createMock<IntegratorErrorMappingService>(),
        },
        {
          provide: ICustOtpRepository,
          useValue: mockCustOtpRepository,
        },
        {
          provide: AggregatorWhiteListingService,
          useValue: mockAggregatorWhitelistingService,
        },
      ],
    }).compile();

    service = module.get<IStudentDetailsService>(IStudentDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call the retrieveStudentDetails', async () => {
    const spy = jest
      .spyOn(service, 'retrieveStudentDetails')
      .mockImplementation();
    await service.retrieveStudentDetails(mockRetrieveStudentDetailsDto, '123');
    expect(spy).toHaveBeenCalled();
  });

  it('should call the confirmStudentDetails', async () => {
    const spy = jest
      .spyOn(service, 'confirmStudentDetails')
      .mockImplementation();
    await service.confirmStudentDetails('1234', mockConfirmStudentDetailsDto);
    expect(spy).toHaveBeenCalled();
  });

  it('StudentDetails retrieveStudentDetails ', async () => {
    const result = await service.retrieveStudentDetails(
      { ...mockRetrieveStudentDetailsDto, aggregatorId: 'SCHOOL_PAY' },
      '123',
    );
    expect(result).toEqual({
      ...mockRetrieveStudentDetailsPresenter,
      aggregatorId: 'SCHOOL_PAY',
    });
  });
  it('StudentDetails retrieveStudentDetails ', async () => {
    const result = await service.retrieveStudentDetails(
      { ...mockRetrieveStudentDetailsDto, aggregatorId: 'PEGPAY' },
      '123',
    );
    expect(result).toEqual(mockRetrieveStudentDetailsPresenter);
  });

  it('StudentDetails retrieveStudentDetails ', async () => {
    const result = service.retrieveStudentDetails(
      { ...mockRetrieveStudentDetailsDto, aggregatorId: 'UNKNOWN_AGGREGATOR' },
      '123',
    );
    await expect(result).rejects.toThrowError();
  });
  it('StudentDetails confirmStudentDetails ', async () => {
    const result = await service.confirmStudentDetails(
      '1234',
      mockConfirmStudentDetailsDto,
    );
    expect(result).toEqual(mockConfirmStudentDetailsPresenter);
  });

  it('StudentDetails getAllStudent ', async () => {
    const result = await service.getAllStudent('1234');
    expect(result).toEqual([mockRetrieveStudentDetailsPresenter]);
  });

  it('StudentDetails deleteStudent ', async () => {
    const dto: DeleteStudentDetailsDTO = generateMockDeleteStudentDetailsDTO();
    const result = await service.deleteStudent('1234', dto);
    expect(result).toEqual(
      generateMockStatusPresenter(2000, 'Deleted successfully', undefined),
    );
  });

  it('StudentDetails getWhiteListedStudent ', async () => {
    const dto: DeleteStudentDetailsDTO = generateMockDeleteStudentDetailsDTO();
    const result = await service.getWhiteListedStudent('1234');
    expect(result).toEqual([mockRetrieveStudentDetailsPresenter]);
  });

  it('StudentDetails deleteWhitelistedStudentDetails ', async () => {
    const result = await service.deleteWhitelistedStudentDetails(
      '1234',
      '56789',
    );
    expect(result).toEqual(true);
  });

  it('StudentDetails addWhitelistedStudentDetails ', async () => {
    const result = await service.addWhitelistedStudentDetails(
      '1234',
      generateMockAddStudentDetailsDto(),
    );
    expect(result).toEqual(false);
  });
});
