import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientStatus } from '../domain/enum/clientStatus.enum';
import { IdCardStatus } from '../domain/enum/id-card-status.enum';
import { LeadStatus } from '../domain/enum/leadStatus.enum';
import { ICustFsRegistration } from '../domain/model/custFsRegistration.interface';
import { ICustIdCardDetails } from '../domain/model/custIdCardDetails.interface';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { ICustTicketDetails } from '../domain/model/custTicketDetails.interface';
import { mockCustOtp, mockCustOtp3 } from '../domain/model/mocks/cust-otp.mock';
import { mockCustPrimaryDetails } from '../domain/model/mocks/cust-primary-details.mock';
import { ICustFsRegistrationRepository } from '../domain/repository/custFsRegistrationRepository.interface';
import { ICustIdCardDetailsRepository } from '../domain/repository/custIdCardDetailsRepository.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { ICustTelcoRepository } from '../domain/repository/custTelcoRepository.interface';
import { ICustTicketDetailsRepository } from '../domain/repository/custTicketDetailsRepository.interface';
import { ICustToLMSService } from '../domain/services/custToLMSService.interface';
import { ICustToLOSService } from '../domain/services/custToLOSService.interface';
import { IFSService } from '../domain/services/fsService.interface';
import { ISanctionService } from '../domain/services/sanctionService.interface';
import { FSCreateTicketDTO } from '../infrastructure/controllers/customers/dtos/fsCreateTicket.dto';
import { FSCreateTicketResponseDTO } from '../infrastructure/controllers/customers/dtos/fsCreateTicketResponse.dto';
import { generateMockFSCreateTicketResponseDTO } from '../infrastructure/controllers/customers/dtos/fsCreateTicketResponse.dto.spec';
import { generateMockDashBoardDetailsPresenter } from '../infrastructure/controllers/customers/presenters/dashBoard.presenter.spec';
import { generateMockFSResponsePresenter } from '../infrastructure/controllers/customers/presenters/fsResponse.presenter.spec';
import { CustOtp } from '../infrastructure/entities/custOtp.entity';
import { CustPrimaryDetails } from '../infrastructure/entities/custPrimaryDetails.entity';
import { AuthServiceClient } from '../infrastructure/services/auth-service-client/auth-service-client.service';
import { MockData } from '../infrastructure/services/mockData';
import { mockCustToLOSService } from './custToLOS.service.spec';
import { CustomersService } from './customers.service';
import { parseDate } from './helpers';
import { PushNotificationService } from '../infrastructure/services/push-notification-service';
import { NotificationServiceClient } from '../infrastructure/services/notifiction-service-client/notifications-service-client.service';
import { IContentService } from '../domain/services/content.service.interface';
import { ContentService } from '../infrastructure/services/content.service';
import { generateMockProfilePersonalDataPresenter } from '../infrastructure/controllers/customers/presenters/profilePersonalData.presenter.spec';
import { IWhitelistedSchoolRepository } from '../domain/repository/whitelistedSchoolRepository.interface';
import { IWhitelistedSchool } from '../domain/model/whitelistedSchool.interface';
import { generateMockWhitelistedSchoolPresenter } from '../infrastructure/controllers/customers/presenters/whitelistedSchool.presenter.spec';

describe('CustomersService', () => {
  let service: CustomersService;

  const mockSanctionService: ISanctionService = {
    getSanctionDetails: function (name: string) {
      return {
        id: 'ajakshdashdasda',
        firstName: 'Sumit',
        lastName: 'Kumar',
        status: 'ACTIVE',
        createdAt: '12/01/2023',
        updatedAt: '12/02/2023',
      };
    },
  };

  const mockCustPrimaryDetailsRepository: ICustPrimaryDetailsRepository = {
    create: function (
      custPrimaryDetails: ICustPrimaryDetails,
    ): Promise<ICustPrimaryDetails> {
      return Promise.resolve(custPrimaryDetails);
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
      return Promise.resolve(null);
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
      return Promise.resolve(mockCustPrimaryDetails);
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
      return Promise.resolve(mockCustPrimaryDetails);
    },
    getByEmail: function (
      email: string,
      custId: string,
    ): Promise<ICustPrimaryDetails> {
      return Promise.resolve(null);
      // return Promise.resolve(mockCustPrimaryDetails);
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

  const mockCustOtpRepository: ICustOtpRepository = {
    create: function (otp: ICustOtp): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    getById: function (id: string): Promise<ICustOtp> {
      return Promise.resolve(mockCustOtp3);
    },
    getByMsisdn: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustOtp> {
      return Promise.resolve({
        ...mockCustOtp3,
        leadCurrentStatus: LeadStatus.LEAD_ENHANCED,
        msisdnCountryCode,
        msisdn,
      });
    },
    update: function (otp: ICustOtp): Promise<ICustOtp> {
      return Promise.resolve(otp);
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

  const mockCustIdCardDetailsRepo: ICustIdCardDetailsRepository = {
    findByCustId: function (custId: string): Promise<ICustIdCardDetails> {
      throw new Error('Function not implemented.');
    },
    findByCustIdOrFail: function (custId: string): Promise<ICustIdCardDetails> {
      throw new Error('Function not implemented.');
    },
    save: function (
      custIdCardDetails: ICustIdCardDetails,
    ): Promise<ICustIdCardDetails> {
      throw new Error('Function not implemented.');
    },
  };

  const mockCustTelcoRepository: ICustTelcoRepository = {
    findByLeadId: function (leadId: string): Promise<ICustTelco> {
      return Promise.resolve(MockData.mockCustTelcoEnitytData);
    },
    save: function (custTelco: ICustTelco): Promise<ICustTelco> {
      throw new Error('Function not implemented.');
    },
    findByFullMsisdnAndLeadId: function (
      msisdnCountryCode: string,
      msisdn: string,
      leadId: string,
    ): Promise<ICustTelco> {
      throw new Error('Function not implemented.');
    },
    findByLeadIdList: function (leadIdList: string[]): Promise<ICustTelco[]> {
      throw new Error('Function not implemented.');
    },
    updateCustTelcoList: function (
      custTelco: ICustTelco[],
    ): Promise<ICustTelco[]> {
      throw new Error('Function not implemented.');
    },
  };

  const mockCustFsRegistrationRepository: ICustFsRegistrationRepository = {
    getByCustId: function (custId: string): Promise<ICustFsRegistration> {
      return Promise.resolve(MockData.mockCustFSRegistration);
    },
    getByRequesterId: function (
      fsRequesterId: number,
    ): Promise<ICustFsRegistration> {
      // return Promise.resolve(MockData.mockCustFSRegistration);
      return Promise.resolve(null);
    },
    save: function (
      custFsReg: ICustFsRegistration,
    ): Promise<ICustFsRegistration> {
      return Promise.resolve(MockData.mockCustFSRegistration);
    },
  };

  const mockWhitelistedSchoolRepository: IWhitelistedSchoolRepository = {
    findAll: function (): Promise<IWhitelistedSchool[]> {
      return Promise.resolve([MockData.mockWhitelistedSchool]);
    },
    findByName: function (schoolName: string): Promise<IWhitelistedSchool> {
      return Promise.resolve(MockData.mockWhitelistedSchool);
    },
  };

  const mockCustTicketDetailsRepository: ICustTicketDetailsRepository = {
    save: function (
      custTicketDetails: ICustTicketDetails,
    ): Promise<ICustTicketDetails> {
      return Promise.resolve(MockData.mockCustTicketDetailsEntity);
    },
  };

  const mockFSService: IFSService = {
    createTicket: function (
      files: Express.Multer.File[],
      hasAttachments: boolean,
      fsCreateTicketDTO: FSCreateTicketDTO,
    ): Promise<FSCreateTicketResponseDTO> {
      return Promise.resolve(generateMockFSCreateTicketResponseDTO()[0]);
    },
    getTicketList: function (
      requester_id: number,
    ): Promise<FSCreateTicketResponseDTO[]> {
      return Promise.resolve(generateMockFSCreateTicketResponseDTO());
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: ICustOtpRepository, useValue: mockCustOtpRepository },
        { provide: ISanctionService, useValue: mockSanctionService },
        {
          provide: ICustPrimaryDetailsRepository,
          useValue: mockCustPrimaryDetailsRepository,
        },
        {
          provide: ICustIdCardDetailsRepository,
          useValue: mockCustIdCardDetailsRepo,
        },
        { provide: ICustTelcoRepository, useValue: mockCustTelcoRepository },
        { provide: ICustToLOSService, useValue: mockCustToLOSService },
        {
          provide: ICustToLMSService,
          useValue: createMock<ICustToLMSService>(),
        },
        {
          provide: AuthServiceClient,
          useValue: createMock<AuthServiceClient>(),
        },
        {
          provide: ICustFsRegistrationRepository,
          useValue: mockCustFsRegistrationRepository,
        },
        {
          provide: ICustTicketDetailsRepository,
          useValue: mockCustTicketDetailsRepository,
        },
        {
          provide: IFSService,
          useValue: mockFSService,
        },
        {
          provide: PushNotificationService,
          useValue: createMock<PushNotificationService>(),
        },
        {
          provide: NotificationServiceClient,
          useValue: createMock<NotificationServiceClient>(),
        },
        {
          provide: IContentService,
          useValue: createMock<ContentService>(),
        },
        {
          provide: IWhitelistedSchoolRepository,
          useValue: mockWhitelistedSchoolRepository,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('user getSanction', async () => {
    const result = await service.getSanction('name');
    expect(result).toEqual({
      id: 'ajakshdashdasda',
      firstName: 'Sumit',
      lastName: 'Kumar',
      status: 'ACTIVE',
      createdAt: '12/01/2023',
      updatedAt: '12/02/2023',
    });
  });

  it('getWhitelistedSchoolList', async () => {
    const result = await service.getWhitelistedSchoolList();
    expect(result).toEqual(generateMockWhitelistedSchoolPresenter());
  });

  it('Create Customer from Enhanced lead should return one custPrimaryDetails Object', async () => {
    const msisdnCountryCode = '+256';
    const msisdn = '9999999999';
    const result: ICustPrimaryDetails =
      await service.createCustomerFromEnhancedLead(msisdnCountryCode, msisdn);
    expect(result).toEqual({
      msisdnCountryCode,
      msisdn,
      email: mockCustOtp3.email,
      leadId: mockCustOtp3.leadId,
      nationalIdNumber: mockCustOtp3.nationalIdNumber,
      dateOfBirth: parseDate(MockData.mockCustTelcoEnitytData.dob).toDate(),
      dateOfExpiry: MockData.mockCustTelcoEnitytData.idExpiry,
      gender: MockData.mockCustTelcoEnitytData.gender,
      givenName: MockData.mockCustTelcoEnitytData.givenName,
      idExpiryDays: expect.any(Number),
      idStatus: IdCardStatus.ACTIVE,
      nationality: MockData.mockCustTelcoEnitytData.nationality,
      preferredName: mockCustOtp3.preferredName,
      surname: null,
      clientStatus: ClientStatus.ACTIVE,
    });
  });
  it('Create Customer from Enhanced lead should throw error if lead is not LEAD_ENHANCED', async () => {
    const msisdnCountryCode = '+256';
    const msisdn = '9999999999';
    jest.spyOn(mockCustOtpRepository, 'getByMsisdn').mockResolvedValueOnce(
      Promise.resolve({
        ...mockCustOtp3,
        leadCurrentStatus: LeadStatus.OTP_GENERATED,
        msisdnCountryCode,
        msisdn,
      }),
    );
    const result = service.createCustomerFromEnhancedLead(
      msisdnCountryCode,
      msisdn,
    );
    await expect(result).rejects.toThrowError();
  });

  it('delete customer should call the customerPrimaryDetails repository with correct arguments', async () => {
    const customerId = '123';
    const custPriRepoDeleteCustomerSpy = jest
      .spyOn(mockCustPrimaryDetailsRepository, 'deleteCustomer')
      .mockResolvedValueOnce({ ...new CustPrimaryDetails(), id: customerId });
    const result = await service.deleteCustomer(customerId);
    expect(custPriRepoDeleteCustomerSpy).toHaveBeenCalledWith(customerId);
  });

  it('DashboardDetails of a customer should', async () => {
    const customerId = '1234';
    const result = await service.dashBoardDetails(customerId);
    const expectedResult = await generateMockDashBoardDetailsPresenter();
    expect(expectedResult).toEqual(expect.objectContaining(result));
  });

  it('AllSupportTicket of a customer should', async () => {
    const customerId = '1234';
    const result = await service.getAllSupportTicketForCustId(customerId);
    const expectedResult = generateMockFSResponsePresenter();
    expect(expectedResult).toEqual(result);
  });

  it('submitSupportTicket of a customer should', async () => {
    const customerId = '1234';
    const result = await service.submitSupportTicket(
      null,
      customerId,
      MockData.mockSubmitFSTicketDTO,
    );
    expect(2000).toEqual(result);
  });

  it('getMsisdn of a customer should', async () => {
    const result = await service.getMsisdn('123456789');
    expect(result).toEqual({
      msisdn: '999999999',
      msisdnCountryCode: '+256',
      preferredName: 'John',
      availableCreditLimit: 1100,
    });
  });

  it('getMsisdn of a customer should', async () => {
    const result = await service.getProfilePersonalData('123456789');
    expect(result).toEqual(generateMockProfilePersonalDataPresenter());
  });

  it('getTargetApiUuid should return targetApiUuid if exists', async () => {
    const customerId = 'xyz-123';
    const leadId = '123';
    const targetApiUUID = 'abc';
    jest
      .spyOn(service['custPriDetailsRepository'], 'getByCustomerId')
      .mockResolvedValueOnce({ leadId } as CustPrimaryDetails);
    jest
      .spyOn(service['custOtpRepository'], 'getById')
      .mockResolvedValueOnce({ targetApiUUID } as CustOtp);

    const result = await service.getTargetApiUuid(customerId);
    expect(result).toEqual(targetApiUUID);
  });
  it('getTargetApiUuid should return null if targetApiUuid not exists', async () => {
    const customerId = 'xyz-123';
    const leadId = '123';
    const targetApiUUID = null;
    jest
      .spyOn(service['custPriDetailsRepository'], 'getByCustomerId')
      .mockResolvedValueOnce({ leadId } as CustPrimaryDetails);
    jest
      .spyOn(service['custOtpRepository'], 'getById')
      .mockResolvedValueOnce({ targetApiUUID } as CustOtp);

    const result = await service.getTargetApiUuid(customerId);
    expect(result).toEqual(targetApiUUID);
  });
  it('getCustFromFullMsisdn', async () => {
    const leadId = 'lead123';

    jest
      .spyOn(service['custPriDetailsRepository'], 'getCustomerByLeadId')
      .mockResolvedValueOnce({
        ...mockCustPrimaryDetails,
        leadId,
        id: 'customer123',
      });

    jest
      .spyOn(service['custOtpRepository'], 'findLeadByFullMsisdnConcat')
      .mockResolvedValueOnce({ ...mockCustOtp, leadId });

    const result = await service.getCustFromFullMsisdn('+123');
    expect(result).toEqual({
      customerId: 'customer123',
      cognitoId: 'cognitoId123',
      email: 'abx@mgail.com',
      leadId: 'lead123',
      msisdn: '7991140000',
      msisdnCountryCode: '+91',
      preferredName: 'Xyz',
      clientStatus: 'ACTIVE',
    });
  });
  it('updateCustomer', async () => {
    const customerId = 'customer123';
    const cognitoId = 'myNewValue123';
    const getByCustIdSpy = jest
      .spyOn(mockCustPrimaryDetailsRepository, 'getByCustomerId')
      .mockResolvedValueOnce(mockCustPrimaryDetails);
    const updateCustSpy = jest
      .spyOn(mockCustPrimaryDetailsRepository, 'updateCustomer')
      .mockResolvedValueOnce(mockCustPrimaryDetails);
    await service.updateCustomer(customerId, cognitoId);
    expect(getByCustIdSpy).toBeCalledWith(customerId);
    expect(updateCustSpy).toBeCalledWith({
      ...mockCustPrimaryDetails,
      cognitoId,
    });
  });
});
