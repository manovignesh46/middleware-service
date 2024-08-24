import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { OtpType } from '../../../domain/enum/otpType.enum';
import { ICustOtp } from '../../../domain/model/custOtp.interface';
import { ICustScoringData } from '../../../domain/model/custScoringData.interface';
import { ICustScoringDataService } from '../../../domain/services/custScoringDataService.interface';
import { ICustToLOSService } from '../../../domain/services/custToLOSService.interface';
import { ICustomersService } from '../../../domain/services/customersService.interface';
import { IStudentDetailsService } from '../../../domain/services/studentDetailsService.interface';
import { ITriggerOtpService } from '../../../domain/services/triggerOtp.interface';
import { IVerifyOtpService } from '../../../domain/services/verifyOtp.interface';
import { CustomersController } from './customers.controller';
import { ConfirmStudentDetailsDto } from './dtos/confirmStudentDetails.dto';
import { generateMockConfirmStudentDetailsDto } from './dtos/confirmStudentDetails.dto.spec';
import { CreditScoreDto } from './dtos/creditScore.dto';
import { generateMockCreditScoreDto } from './dtos/creditScore.dto.spec';
import { CreditScoreServiceDto } from './dtos/creditScoreService.dto';
import { generateMockCreditScoreServiceDto } from './dtos/creditScoreService.dto.spec';
import { RetrieveStudentDetailsDto } from './dtos/retrieveStudentDetails.dto';
import { genertaeMockRetrieveStudentDetailsDto } from './dtos/retrieveStudentDetails.dto.spec';
import { TriggerOtpDto } from './dtos/triggerOtp.dto';
import { generateMockTriggerOtpDto } from './dtos/triggerOtp.dto.spec';
import { TriggerOtpServiceDto } from './dtos/triggerOtpService.dto';
import { VerifyOtpServiceDto } from './dtos/verifyOtpService.dto';
import { ConfirmStudentDetailsPresenter } from './presenters/confirmStudentDetails.presenter';
import { generateMockConfirmStudentDetailsPresenter } from './presenters/confirmStudentDetails.presenter.spec';
import { CreditScorePresenter } from './presenters/creditScore.presenter';
import { RetrieveStudentDetailsPresenter } from './presenters/retrieveStudentDetails.presenter';
import { genertaeMockRetrieveStudentDetailsPresenter } from './presenters/retrieveStudentDetails.presenter.spec';
import { TriggerOtpPresenter } from './presenters/triggerOtp.presenter';

import { createMock } from '@golevelup/ts-jest';
import { LeadStatus } from '../../../domain/enum/leadStatus.enum';
import { ResponseStatusCode } from '../../../domain/enum/responseStatusCode.enum';
import { ICustIdCardDetails } from '../../../domain/model/custIdCardDetails.interface';
import { ICustPrimaryDetails } from '../../../domain/model/custPrimaryDetails.interface';
import { ICustScanCardSelfieCheckDetails } from '../../../domain/model/custScanCardSelfieCheckDetails.interface';
import { mockCustIdCardDetails } from '../../../domain/model/mocks/cust-id-card-details.mock';
import { mockCustOtp3 } from '../../../domain/model/mocks/cust-otp.mock';
import { IStudentDetails } from '../../../domain/model/studentDetails.interface';
import { ISNSService } from '../../../domain/services/aws-sns-service.interface';
import { ICustIdCardDetailsService } from '../../../domain/services/custIdCardDetailsService.interface';
import { ICustToLMSService } from '../../../domain/services/custToLMSService.interface';
import {
  IExperianService,
  KycEnquiryDto,
} from '../../../domain/services/experian-service.interface';
import { ForgotPinService } from '../../../usecases/forgot-pin-service';
import { CustPrimaryDetails } from '../../entities/custPrimaryDetails.entity';
import { CustScoringData } from '../../entities/custScoringData.entity';
import { SNSService } from '../../services/aws-sns.service';
import { GeneralOtpService } from '../../services/general-otp.service';
import { SoapService } from '../../services/soap-client.service';
import { OtpExpiredError } from '../common/errors/otpExpired.error';
import {
  StatusMessagePresenter,
  generateMockStatusPresenter,
} from '../common/statusMessage.presenter';
import { CustIdCardDetailsServiceDto } from './dtos/cust-id-card-details-service.dto';
import { DeleteStudentDetailsDTO } from './dtos/deleteStudentDetails.dto';
import { generateMockDeleteStudentDetailsDTO } from './dtos/deleteStudentDetails.dto.spec';
import {
  EditIdCardScanDTO,
  IdCardScanDTO,
  MRZ,
  OCR,
} from './dtos/idCardScan.dto';
import { generateMockIdCardScanDto } from './dtos/idCardScan.dto.spec';
import { generateMockResumeActionDTO } from './dtos/resumeAction.dto.spec';
import { RetryUploadDTO } from './dtos/retryUpload.dto';
import { generateMockRetryUploadDTO } from './dtos/retryUpload.dto.spec';
import { SelfieCheckDTO } from './dtos/selfieCheck.dto';
import { VerifyOtpDto } from './dtos/verifyOtpDto';
import { CreateCustPrimaryDetailsPresenter } from './presenters/customer.presenter';
import { DashBoardPresenter } from './presenters/dashBoard.presenter';
import { generateMockDashBoardDetailsPresenter } from './presenters/dashBoard.presenter.spec';
import { EKycPresenter } from './presenters/ekyc.presenter';
import { GetCustomerFromFullMsisdnPresenter } from './presenters/get-customer-from-full-msisdn.presenter';
import { ScannedDetails } from './presenters/idCardScan.presenter';
import { RetryUploadPresenter } from './presenters/retryUpload.presenter';
import { generateMockRetryUploadPresenter } from './presenters/retryUpload.presenter.spec';
import { VerifyOtpPresenter } from './presenters/verifyOtp.presenter';
import { ConfigService } from '@nestjs/config';
import { generateMockEKYCPresenter } from './presenters/ekyc.presenter.spec';
import { DashboardResponseDTO } from './dtos/dashboardResponse.dto';
import { AggregatorWhiteListingService } from '../../services/aggregatorWhitelisting.service';
import {
  GetAddressResponseDto,
  mockGetAddressResponseDto,
} from './dtos/get-address-response.dto';
import { ResponseMessage } from '../../../domain/enum/responseMessage.enum';
import { EntityNotFoundError } from 'typeorm';
import { ProfilePersonalDataPresenter } from './presenters/profilePersonalData.presenter';
import { generateMockProfilePersonalDataPresenter } from './presenters/profilePersonalData.presenter.spec';
import { AddStudentDetailsDTO } from './dtos/addStudentDetails.dto';
import { AuthServiceClient } from '../../services/auth-service-client/auth-service-client.service';
import { IpWhitelistingInterceptor } from '../../../interceptors/ip-whitelisting.interceptor';
import { ICustTelco } from '../../../domain/model/custTelco.interface';
import { SubmitTicketDTO } from './dtos/submitTicket.dto';
import { FSResponsePresenter } from './presenters/fsResponse.presenter';
import { ICustOtpService } from '../../../domain/services/custOtpService.interface';
import { MTNConsentStatusDTO } from './dtos/mtnConsentStatus.dto';
import { generateMockMTNConsentStatusDTO } from './dtos/mtnConsentStatus.dto.spec';
import { MTNApprovalPollingDTO } from './dtos/mtnApprovalPolling.dto';
import { MTNApprovalServiceDTO } from './dtos/mtnApprovalService.dto';
import { generateMockMTNApprovalServiceDTO } from './dtos/mtnApprovalService.dto.spec';
import { generateMockMTNApprovalPollingDTO } from './dtos/mtnApprovalPolling.dto.spec';
import { PushNotificationService } from '../../services/push-notification-service';
import { generateMockDeviceDetailsDTO } from './dtos/deviceDetails.dto.spec';
import { ClientStatus } from '../../../domain/enum/clientStatus.enum';
import { MTNOptOutDTO } from './dtos/mtnOptOut.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { VerifyOtpVerifiedKeyDto } from './dtos/verify-otp-verification-key.dto';
import { OtpAction } from '../../../domain/enum/otp-action.enum';
import { CustScanCardSelfieCheckDetails } from '../../entities/custScanCardSelfieCheckDetails.entity';
import { WhitelistedSchoolPresenter } from './presenters/whitelistedSchool.presenter';
import { generateMockWhitelistedSchoolPresenter } from './presenters/whitelistedSchool.presenter.spec';

describe('CustomersController', () => {
  let controller: CustomersController;
  const mockCustomer: ICustOtp = {
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
    leadId: randomUUID(),
    msisdnCountryCode: '' + 256,
    msisdn: '999999999',
    preferredName: 'John',
    nationalIdNumber: '999999999999',
    email: 'john@doe.com',
    otpType: OtpType.SMS,
    phoneStatus: false,
    emailStatus: false,
    otp: 'ABC-123123',
    otpCreatedAt: new Date(Date.now()),
    lockedAt: new Date(Date.now()),
    otpSentAt: new Date(Date.now()),
    otpExpiry: new Date(Date.now()),
    leadCurrentStatus: LeadStatus.OTP_GENERATED,
    failedAttempts: 0,
    targetApiUUID: '',
    outcomeApiUUID: '',
    isTerminated: false,
    terminationReason: null,
    whitelisted: '',
    whitelistedJSON: '',
    telcoOp: '',
    telcoUssdCode: '',
    telcoWallet: '',
    smsNextHours: 0,
    mtnOptInReqId: 'MtnRequestId123',
    mtnApprovalId: 'MtnApprovalId123',
    mtnValidationStatus: 'PENDING',
    otpSentCount: 0,
    otpSentLockedAt: null,
    whitelistCriteria: '',
  };

  const mockCustIdCardDetailsServiceDto: CustIdCardDetailsServiceDto = {
    backsideImagePresignedUrl: 'backsidePresignedUrl',
    frontsideImagePresignedUrl: 'frontsidePresignedUrl',
    faceImagePresignedUrl: 'faceImagePresignedUrl',
    scannedDetails: new ScannedDetails(
      generateMockIdCardScanDto().ocr,
      generateMockIdCardScanDto().mrz,
    ),
    isNINMatched: false,
  };

  const resend = true;

  const mockCustomersService: ICustomersService = {
    getSanction: function (name: string) {
      throw new Error('Function not implemented.');
    },
    createCustomerFromEnhancedLead: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustPrimaryDetails> {
      return Promise.resolve({
        ...mockCustomer,
        msisdnCountryCode,
        msisdn,
      } as unknown as ICustPrimaryDetails);
    },
    deleteCustomer: function (
      customerId: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    dashBoardDetails: async function (
      customerId: string,
    ): Promise<DashboardResponseDTO> {
      const presenter = await generateMockDashBoardDetailsPresenter();
      const dto: DashboardResponseDTO = {
        dashBoardPresenter: presenter,
        rejectionReason: '',
        applicationStatus: '',
        rejectionCode: 0,
      };
      return dto;
    },
    getTargetApiUuid: function (customerId: string): Promise<string> {
      throw new Error('Function not implemented.');
    },
    getMsisdn: function (customerId: string): Promise<{
      msisdnCountryCode: string;
      msisdn: string;
      preferredName: string;
      availableCreditLimit: number;
    }> {
      return Promise.resolve({
        msisdnCountryCode: '+256',
        msisdn: '999999999',
        preferredName: 'John',
        availableCreditLimit: 100000,
      });
    },
    getCustFromFullMsisdn: function (
      fullMsisdn: string,
    ): Promise<GetCustomerFromFullMsisdnPresenter> {
      const res: GetCustomerFromFullMsisdnPresenter = {
        msisdnCountryCode: '+256',
        msisdn: '999999999',
        preferredName: 'John',
        email: 'john@abc.com',
        customerId: 'customer123',
        leadId: 'lead123',
        cognitoId: 'cognitoId123',
        clientStatus: ClientStatus.ACTIVE,
      };
      return Promise.resolve(res);
    },
    getCustId: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<string> {
      throw new Error('Function not implemented.');
    },
    updateCustomer: function (
      customerId: string,
      cognitoId: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    getProfilePersonalData: function (
      custId: string,
    ): Promise<ProfilePersonalDataPresenter> {
      return Promise.resolve(generateMockProfilePersonalDataPresenter());
    },
    submitSupportTicket: function (
      files: Express.Multer.File[],
      custId: string,
      submitTicketDTO: SubmitTicketDTO,
    ): Promise<number> {
      throw new Error('Function not implemented.');
    },
    getAllSupportTicketForCustId: function (
      custId: string,
    ): Promise<FSResponsePresenter[]> {
      throw new Error('Function not implemented.');
    },
    optOutCustomers: function (mtnOptOutDTO: MTNOptOutDTO): Promise<number> {
      return Promise.resolve(2000);
    },
    getWhitelistedSchoolList: function (): Promise<WhitelistedSchoolPresenter> {
      return Promise.resolve(generateMockWhitelistedSchoolPresenter());
    },
  };

  const mockTriggerOtpService: ITriggerOtpService = {
    triggerOtp: function (
      triggerOtpDto: TriggerOtpDto,
    ): Promise<TriggerOtpServiceDto> {
      const outputOtp: ICustOtp = mockCustOtp3;
      const isOtpExpired = false;

      //Todo add logic for resend
      const dto = new TriggerOtpServiceDto(
        outputOtp,
        'WIP',
        isOtpExpired,
        null,
        null,
        false,
        null,
        null,
        null,
      );

      return Promise.resolve(dto);
    },
    resumeAction: function (
      msisdn: string,
      msisdnCountryCode: string,
    ): Promise<TriggerOtpServiceDto> {
      const outputOtp: ICustOtp = mockCustOtp3;
      const isOtpExpired = false;

      //Todo add logic for resend
      const dto = new TriggerOtpServiceDto(
        outputOtp,
        'WIP',
        isOtpExpired,
        null,
        null,
        false,
        null,
        null,
        null,
      );

      return Promise.resolve(dto);
    },
    mtnApprovalPolling: function (
      mtnApporvalPollingDTO: MTNApprovalPollingDTO,
    ): Promise<MTNApprovalServiceDTO> {
      return Promise.resolve(generateMockMTNApprovalServiceDTO());
    },
  };

  const mockCustScoringDataService: ICustScoringDataService = {
    findCustScoringData: function (
      leadId: string,
      custScoringData: ICustScoringData,
    ): Promise<CreditScoreServiceDto> {
      const isTelcoKycMatch = true;
      const isSanctionStatusMatch = false;
      return Promise.resolve(
        generateMockCreditScoreServiceDto(
          '123',
          'FAILURE',
          'Telco NIN comparison failed',
          isTelcoKycMatch,
          isSanctionStatusMatch,
        ),
      );
    },
  };

  const mockIpWhitelistingInterceptor = createMock<IpWhitelistingInterceptor>();
  mockIpWhitelistingInterceptor.intercept.mockImplementation(
    (context, next) => {
      return Promise.resolve(next.handle());
    },
  );

  const mockCustToLOSService: ICustToLOSService = {
    leadCreationInLOS(
      leadId: string,
      leadCurrentStatus: LeadStatus,
    ): Promise<any> {
      return Promise.resolve({
        id: 'ajakshdashdasda',
        firstName: 'Abhishek',
        lastName: 'Kumar',
        status: 'CREATED',
        createdAt: '12/01/2023',
        updatedAt: '12/02/2023',
      });
    },
    getCustomerLoansFromLOS(
      custId: string,
      custloanStatus: boolean,
      offset: number,
      limit: number,
      startDate: string,
      endDate: string,
    ): Promise<any> {
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
    leadVerifiedInLOS: function (leadId: string): Promise<any> {
      return Promise.resolve(true);
    },
    leadEnhancedInLOS: function (
      leadId: string,
      custScoringData: CustScoringData,
    ): Promise<any> {
      return Promise.resolve(true);
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
      return null;
    },
    terminateOngoingLoans: function (custId: string): Promise<boolean> {
      return Promise.resolve(true);
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
  const mockVerifyOtpService: IVerifyOtpService = {
    verifyOtp: function (
      msisdnCountryCode: string,
      msisdn: string,
      otp: string,
    ): Promise<VerifyOtpServiceDto> {
      throw new Error('Function not implemented.');
    },
  };

  const mockStudentDetailsService: IStudentDetailsService = {
    retrieveStudentDetails: function (
      retrieveStudentDetailsDto: RetrieveStudentDetailsDto,
    ): Promise<RetrieveStudentDetailsPresenter> {
      return Promise.resolve(genertaeMockRetrieveStudentDetailsPresenter());
    },

    confirmStudentDetails: function (
      custId: string,
      confirmStudentDetailsDto: ConfirmStudentDetailsDto,
    ): Promise<ConfirmStudentDetailsPresenter> {
      return Promise.resolve(generateMockConfirmStudentDetailsPresenter());
    },

    getAllStudent: function (
      custId: string,
    ): Promise<RetrieveStudentDetailsPresenter[]> {
      const presenterList: RetrieveStudentDetailsPresenter[] = [];
      return Promise.resolve(presenterList);
    },

    deleteStudent: function (
      custId: string,
      deleteStudentDetailsDTO: DeleteStudentDetailsDTO,
    ): Promise<StatusMessagePresenter<null>> {
      const presenterList = generateMockStatusPresenter(
        2000,
        'Student Deleted successfully',
        undefined,
      );
      return Promise.resolve(presenterList);
    },
    getStudentOfferDetails: function (offerId: string) {
      return Promise.resolve(null);
    },
    getStudentDetails: function (
      studentPCOId: string,
    ): Promise<IStudentDetails> {
      return Promise.resolve(null);
    },
    getWhiteListedStudent: function (
      custId: string,
    ): Promise<RetrieveStudentDetailsPresenter[]> {
      return Promise.resolve([genertaeMockRetrieveStudentDetailsPresenter()]);
    },
    deleteWhitelistedStudentDetails: function (
      custId: string,
      studentId: string,
    ): Promise<boolean> {
      return Promise.resolve(true);
    },
    addWhitelistedStudentDetails: function (
      custId: string,
      addStudentDetailsDTO: AddStudentDetailsDTO,
    ): Promise<boolean> {
      return Promise.resolve(true);
    },
  };

  const mockCustIdCardDetailsService: ICustIdCardDetailsService = {
    selfieMatchDetails: function (
      custId: string,
      custIdScanCardDetails: SelfieCheckDTO,
    ): Promise<ICustScanCardSelfieCheckDetails> {
      throw new Error('Function not implemented.');
    },
    getIdCardDetails: function (
      customerId: string,
    ): Promise<ICustIdCardDetails> {
      return Promise.resolve(null);
    },
    getSelfieLiveness: function (
      customerId: string,
    ): Promise<ICustScanCardSelfieCheckDetails> {
      return Promise.resolve(null);
    },
    uploadIdCardDetails: function (
      custId: string,
      ocr: OCR,
      mrz: MRZ,
      custIdCardFrontImageFileName: string,
      custIdCardBackImageFileName: string,
      custFaceImageFileName: string,
    ): Promise<CustIdCardDetailsServiceDto> {
      return Promise.resolve(mockCustIdCardDetailsServiceDto);
    },
    editIdCardDetails: function (
      custId: string,
      editIdCardScanDTO: EditIdCardScanDTO,
    ): Promise<ICustIdCardDetails> {
      return Promise.resolve(mockCustIdCardDetails);
    },
    retryUpload: function (
      custId: string,
      retryUploadDTO: RetryUploadDTO[],
    ): Promise<RetryUploadPresenter> {
      return Promise.resolve(generateMockRetryUploadPresenter());
    },
    getAddress: function (customerId: string): Promise<GetAddressResponseDto> {
      return Promise.resolve(mockGetAddressResponseDto);
    },
  };

  const mockCustToLMSService: ICustToLMSService = {
    getDashboardDetails: async function (
      custPrimaryDetails: ICustPrimaryDetails,
    ): Promise<DashboardResponseDTO> {
      const presenter = await generateMockDashBoardDetailsPresenter();
      const dto: DashboardResponseDTO = {
        dashBoardPresenter: presenter,
        rejectionReason: '',
        applicationStatus: '',
        rejectionCode: 0,
      };
      return dto;
    },
    getEKycState: function (custId: string): Promise<EKycPresenter> {
      return Promise.resolve(generateMockEKYCPresenter());
    },
    getTelcoData: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustTelco> {
      throw new Error('Function not implemented.');
    },
    purgeCustomer: function (msisdnList: string[]): Promise<string[]> {
      throw new Error('Function not implemented.');
    },
    optOutCustomer: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<number> {
      return Promise.resolve(2000);
    },
  };

  const mockExperianService: IExperianService = {
    kycEnquiry: function (kycEnquiryDto: KycEnquiryDto): Promise<void> {
      return Promise.resolve();
    },
  };

  const mockAggregatorWhitelistingService =
    createMock<AggregatorWhiteListingService>();

  const mockCustOtpService: ICustOtpService = {
    findCustOTP: function (
      nationalIdNumber: string,
      msisdnCountryCode: string,
      msisdn: string,
      email: string,
    ): Promise<ICustOtp[]> {
      throw new Error('Function not implemented.');
    },
    mtnConsentStatus: function (
      mtnConsentStatusDTO: MTNConsentStatusDTO,
    ): Promise<boolean> {
      return Promise.resolve(true);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        { provide: ICustomersService, useValue: mockCustomersService },
        { provide: ITriggerOtpService, useValue: mockTriggerOtpService },
        {
          provide: ICustScoringDataService,
          useValue: mockCustScoringDataService,
        },
        { provide: IVerifyOtpService, useValue: mockVerifyOtpService },
        {
          provide: IStudentDetailsService,
          useValue: mockStudentDetailsService,
        },
        { provide: ICustToLOSService, useValue: mockCustToLOSService },
        { provide: ICustToLMSService, useValue: mockCustToLMSService },
        {
          provide: ICustIdCardDetailsService,
          useValue: mockCustIdCardDetailsService,
        },
        { provide: IExperianService, useValue: mockExperianService },
        {
          provide: ForgotPinService,
          useValue: createMock<ForgotPinService>(),
        },
        {
          provide: GeneralOtpService,
          useValue: createMock<GeneralOtpService>(),
        },
        {
          provide: SoapService,
          useValue: createMock<SoapService>(),
        },
        {
          provide: ISNSService,
          useValue: createMock<SNSService>(),
        },
        {
          provide: AggregatorWhiteListingService,
          useValue: mockAggregatorWhitelistingService,
        },
        ConfigService,
        {
          provide: AuthServiceClient,
          useValue: createMock<AuthServiceClient>(),
        },
        {
          provide: ICustOtpService,
          useValue: mockCustOtpService,
        },
        {
          provide: PushNotificationService,
          useValue: createMock<PushNotificationService>(),
        },
      ],
    })
      .overrideInterceptor(IpWhitelistingInterceptor)
      .useValue(mockIpWhitelistingInterceptor)
      .compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //generate-otp
  it('generate otp should return StatusMessagePresenter<TriggerOtpPresenter>', async () => {
    const dto: TriggerOtpDto = generateMockTriggerOtpDto();
    const result = await controller.triggerOtp(dto);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.data).toBeInstanceOf(TriggerOtpPresenter);
  });
  it('generate otp should throw error if service throws error', async () => {
    const dto: TriggerOtpDto = generateMockTriggerOtpDto();
    jest
      .spyOn(mockTriggerOtpService, 'triggerOtp')
      .mockRejectedValueOnce(new Error('some error occured'));
    const result = controller.triggerOtp(dto);
    await expect(result).rejects.toThrowError(Error);
  });
  //verify-otp
  it('generate otp should return StatusMessagePresenter<VerifyOtpPresenter>', async () => {
    const dto: VerifyOtpDto = new VerifyOtpDto();
    dto.msisdn = '+256';
    dto.msisdnCountryCode = '999999999';
    dto.otp = 'ABC-123456';
    const leadId = randomUUID();
    const leadStatus = LeadStatus.OTP_VERIFIED;
    const preferredName = 'John';
    const verified = true;
    const otpCount = 1;
    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());
    const verifyOtpServiceDto = new VerifyOtpServiceDto(
      leadId,
      leadStatus,
      true,
      preferredName,
      verified,
      otpCount,
      createdAt,
      updatedAt,
    );
    jest
      .spyOn(mockVerifyOtpService, 'verifyOtp')
      .mockResolvedValueOnce(verifyOtpServiceDto);

    const result = await controller.verifyOtp(dto);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.data).toBeInstanceOf(VerifyOtpPresenter);
  });
  it('verify otp should throw error if service throws error', async () => {
    const dto: VerifyOtpDto = new VerifyOtpDto();
    jest
      .spyOn(mockVerifyOtpService, 'verifyOtp')
      .mockRejectedValueOnce(new OtpExpiredError('some error'));

    const result = controller.verifyOtp(dto);
    await expect(result).rejects.toThrowError(OtpExpiredError);
  });

  //createCustomerFromEnhancedLead
  it('get customer by msisdn shoudl return GetCustByMsisdnPresenter', async () => {
    const msisdnCountryCode = '+256';
    const msisdn = '999999999';
    const result = await controller.createCustomerFromEnhancedLead({
      msisdnCountryCode,
      msisdn,
    });
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result?.data).toBeInstanceOf(CreateCustPrimaryDetailsPresenter);
  });

  //deletecustomer
  it('delete customer should return status message presenter', async () => {
    const customerId = '123';
    jest
      .spyOn(mockCustomersService, 'deleteCustomer')
      .mockResolvedValueOnce({ ...new CustPrimaryDetails(), id: customerId });
    const result = await controller.deleteCustomerNotOnboardedInCognito(
      customerId,
    );
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.status).toEqual(ResponseStatusCode.SUCCESS);
  });

  //delete customer should throw an error if an error is thrown by custService
  it('delete customer should return status message presenter', async () => {
    const customerId = '123';
    jest
      .spyOn(mockCustomersService, 'deleteCustomer')
      .mockRejectedValueOnce(
        new Error('some error occured while deleting customer'),
      );
    const result = controller.deleteCustomerNotOnboardedInCognito(customerId);
    await expect(result).rejects.toThrowError();
  });

  //updateCustomer
  it('updateCustomer success', async () => {
    const dto: UpdateCustomerDto = {
      customerId: 'customer123',
      cognitoId: 'cognito123',
    };
    jest
      .spyOn(mockCustomersService, 'updateCustomer')
      .mockResolvedValueOnce(new CustPrimaryDetails()); //not null
    const res = await controller.updateCustomer(dto);
    expect(res).toEqual(
      new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.UPDATE_CUSTOMER_SUCCESS,
      ),
    );
  });

  it('updateCustomer fail', async () => {
    const dto: UpdateCustomerDto = {
      customerId: 'customer123',
      cognitoId: 'cognito123',
    };
    jest
      .spyOn(mockCustomersService, 'updateCustomer')
      .mockResolvedValueOnce(null); //not null
    const res = await controller.updateCustomer(dto);
    expect(res).toEqual(
      new StatusMessagePresenter(ResponseStatusCode.FAIL, ResponseMessage.FAIL),
    );
  });

  it('verifyOtpVerifiedKey success', async () => {
    jest
      .spyOn(controller['generalOtpService'], 'verifyOtpVerfiedKey')
      .mockResolvedValueOnce(new CustPrimaryDetails()); // not null
    const dto: VerifyOtpVerifiedKeyDto = {
      customerId: 'customer123',
      otpVerifiedKey: '123',
      otpAction: OtpAction.FORGOT_PIN,
    };
    const res = await controller.verifyOtpVerifiedKey(dto);
    expect(res).toEqual(
      expect.objectContaining({ message: 'Success', status: 2000 }),
    );
  });

  it('verifyOtpVerifiedKey fail', async () => {
    jest
      .spyOn(controller['generalOtpService'], 'verifyOtpVerfiedKey')
      .mockResolvedValueOnce(null);
    const dto: VerifyOtpVerifiedKeyDto = {
      customerId: 'customer123',
      otpVerifiedKey: '123',
      otpAction: OtpAction.FORGOT_PIN,
    };
    const res = await controller.verifyOtpVerifiedKey(dto);
    expect(res).toEqual(
      expect.objectContaining({
        message: 'Verification failed, key is either wrong or expired',
        status: 4000,
      }),
    );
  });

  it('update Cust Id card Details should return IdCardDetailsPresenter', async () => {
    const dto: IdCardScanDTO = generateMockIdCardScanDto();
    const customerId = '123';
    const result = await controller.idCardScanner(customerId, dto);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });
  it('Edit Cust Id card Details should return StatusMessagePresenter', async () => {
    const dto: EditIdCardScanDTO = new EditIdCardScanDTO();
    dto.edited = {
      dob: '31.12.1990',
      givenName: 'John',
      nin: '123123',
      surname: 'Doe',
      ninExpiryDate: '30.11.2090',
    };
    const customerId = '123';
    const result = await controller.editIdScanDetails(customerId, dto);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('generate otp should return StatusMessagePresenter containing CreditScorePresenter', async () => {
    const dto: CreditScoreDto = generateMockCreditScoreDto();
    const result = await controller.creditScore(dto);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result?.data).toBeInstanceOf(CreditScorePresenter);
  });

  it('retrieve student details return RetreiveStudentDetailsPresenter', async () => {
    const dto: RetrieveStudentDetailsDto =
      genertaeMockRetrieveStudentDetailsDto();
    const result = await controller.retrieveStudentDetails(dto, '123');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('confirm student details return ConfirmStudentDetailsPresenter', async () => {
    const dto: ConfirmStudentDetailsDto =
      generateMockConfirmStudentDetailsDto();
    const result = await controller.confirmStudentDetails('12345', dto);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('Dashboard Details return DashboardDetailsPresenter', async () => {
    const result = await controller.getDashBoardDetails('12345');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('selfieCheck success', async () => {
    jest
      .spyOn(mockCustIdCardDetailsService, 'selfieMatchDetails')
      .mockResolvedValueOnce(new CustScanCardSelfieCheckDetails()); //not null
    const res = await controller.selfieCheck('cust123', new SelfieCheckDTO());
    expect(res).toEqual(
      expect.objectContaining({
        message: 'Selfie Check Done Successfully.',
        status: 2000,
      }),
    );
  });

  it('getTargetApiUuid return STatusMessagePresenter with targetApiUuid', async () => {
    const mockTargetApiUuid = 'abc-123';
    const mockCustomerId = 'xyz-456';
    jest
      .spyOn(controller['customersService'], 'getTargetApiUuid')
      .mockResolvedValueOnce(mockTargetApiUuid);

    const result = await controller.getTargetApiUuid(mockCustomerId);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.status).toEqual(ResponseStatusCode.SUCCESS);
    expect(result.data).toEqual({ targetApiUuid: mockTargetApiUuid });
  });
  it('getTargetApiUuid return appropriate error if no targetApiUuid found', async () => {
    const mockCustomerId = 'xyz-456';
    jest
      .spyOn(controller['customersService'], 'getTargetApiUuid')
      .mockResolvedValueOnce(null);

    const result = await controller.getTargetApiUuid(mockCustomerId);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.status).toEqual(ResponseStatusCode.FAIL);
  });
  it('getTargetApiUuid should forward any errors thrown', async () => {
    const mockCustomerId = 'xyz-456';
    jest
      .spyOn(controller['customersService'], 'getTargetApiUuid')
      .mockRejectedValueOnce(new Error('some random error occurred'));

    const result = controller.getTargetApiUuid(mockCustomerId);
    await expect(result).rejects.toThrowError();
  });

  it('getSelfieLiveness return StatusMessagePresenter ', async () => {
    const result = await controller.getSelfieLiveness('1234');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('getIdCardDetails return StatusMessagePresenter ', async () => {
    const result = await controller.getIdCardDetails('1234');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('getOfferDetails return StatusMessagePresenter ', async () => {
    const result = await controller.getOfferDetails('1234');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('getStudentDetails return StatusMessagePresenter ', async () => {
    const result = await controller.getStudentDetails('123', '1234');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('retryUpload return StatusMessagePresenter ', async () => {
    const result = await controller.retryUpload('1234', [
      generateMockRetryUploadDTO(),
    ]);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('resumeAction return StatusMessagePresenter ', async () => {
    const result = await controller.resumeAction(generateMockResumeActionDTO());
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('experian return StatusMessagePresenter ', async () => {
    const result = await controller.experian();
    expect(result).toEqual('ok');
  });

  it('getEKycState return StatusMessagePresenter ', async () => {
    const result = await controller.getEKycState('1234');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('getCustFromFullMsisdn return StatusMessagePresenter ', async () => {
    const result = await controller.getCustFromFullMsisdn('+256981237123');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('terminateLoans return StatusMessagePresenter ', async () => {
    const result = await controller.terminateLoans('1234');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('getProfilePersonalData return StatusMessagePresenter ', async () => {
    const result = await controller.getProfilePersonalData('1234');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('get Address Success ', async () => {
    const result = await controller.getAddress('customerId123');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result).toEqual(
      new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.GET_ADDRESS_SUCCESS,
        mockGetAddressResponseDto,
      ),
    );
  });
  it('get Address EntityNotFoundError ', async () => {
    jest
      .spyOn(mockCustIdCardDetailsService, 'getAddress')
      .mockRejectedValueOnce(new EntityNotFoundError(null, null));
    const result = await controller.getAddress('customerId123');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result).toEqual(
      new StatusMessagePresenter(
        ResponseStatusCode.ADDRESS_NOT_AVAILABLE,
        ResponseMessage.ADDRESS_NOT_AVAILABLE,
      ),
    );
  });

  it('applyNowLoans return StatusMessagePresenter ', async () => {
    const result = await controller.applyNowLoans('1234');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('mtnConsentStatus return StatusMessagePresenter ', async () => {
    const result = await controller.mtnConsentStatus(
      generateMockMTNConsentStatusDTO(),
    );
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });
  it('mtnApporvalPolling return StatusMessagePresenter ', async () => {
    const result = await controller.mtnApporvalPolling(
      generateMockMTNApprovalPollingDTO(),
    );
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('getWhitelistedSchoolList return StatusMessagePresenter ', async () => {
    const result = await controller.getWhitelistedSchoolList();
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('RegisterToken return StatusMessagePresenter ', async () => {
    const result = await controller.registerToken(
      generateMockDeviceDetailsDTO(),
    );
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });
  it('optOutCustomers return StatusMessagePresenter 2000', async () => {
    jest
      .spyOn(controller['customersService'], 'optOutCustomers')
      .mockResolvedValueOnce(2000);
    const result = await controller.optOutCustomers('customerId', {
      countryCode: '+256',
      msisdn: '999999999',
      optOutReason: 'Felt Like It',
      optOutFeedback: 'Good',
    });
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.status).toEqual(ResponseStatusCode.SUCCESS);
  });
  it('optOutCustomers return StatusMessagePresenter 3987', async () => {
    jest
      .spyOn(controller['customersService'], 'optOutCustomers')
      .mockResolvedValueOnce(3987);
    const result = await controller.optOutCustomers('customerId', {
      countryCode: '+256',
      msisdn: '999999999',
      optOutReason: 'Felt Like It',
      optOutFeedback: 'Good',
    });
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.status).toEqual(ResponseStatusCode.MTN_OPT_OUT_NON_MTN);
  });
  it('optOutCustomers return StatusMessagePresenter 3990', async () => {
    jest
      .spyOn(controller['customersService'], 'optOutCustomers')
      .mockResolvedValueOnce(3990);
    const result = await controller.optOutCustomers('customerId', {
      countryCode: '+256',
      msisdn: '999999999',
      optOutReason: 'Felt Like It',
      optOutFeedback: 'Good',
    });
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.status).toEqual(
      ResponseStatusCode.MTN_OPT_OUT_NETWORK_FAILURE,
    );
  });
  it('optOutCustomers return StatusMessagePresenter 3989', async () => {
    jest
      .spyOn(controller['customersService'], 'optOutCustomers')
      .mockResolvedValueOnce(3989);
    const result = await controller.optOutCustomers('customerId', {
      countryCode: '+256',
      msisdn: '999999999',
      optOutReason: 'Felt Like It',
      optOutFeedback: 'Good',
    });
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.status).toEqual(ResponseStatusCode.MTN_OPT_OUT_INVALID_USER);
  });
  it('optOutCustomers return StatusMessagePresenter 3991', async () => {
    jest
      .spyOn(controller['customersService'], 'optOutCustomers')
      .mockResolvedValueOnce(3991);
    const result = await controller.optOutCustomers('customerId', {
      countryCode: '+256',
      msisdn: '999999999',
      optOutReason: 'Felt Like It',
      optOutFeedback: 'Good',
    });
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.status).toEqual(ResponseStatusCode.MTN_OPT_OUT_PENDING);
  });
  it('optOutCustomers return StatusMessagePresenter 3989', async () => {
    jest
      .spyOn(controller['customersService'], 'optOutCustomers')
      .mockResolvedValueOnce(3989);
    const result = await controller.optOutCustomers('customerId', {
      countryCode: '+256',
      msisdn: '999999999',
      optOutReason: 'Felt Like It',
      optOutFeedback: 'Good',
    });
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.status).toEqual(ResponseStatusCode.MTN_OPT_OUT_INVALID_USER);
  });
  it('optOutCustomers return StatusMessagePresenter 3992', async () => {
    jest
      .spyOn(controller['customersService'], 'optOutCustomers')
      .mockResolvedValueOnce(3992);
    const result = await controller.optOutCustomers('customerId', {
      countryCode: '+256',
      msisdn: '999999999',
      optOutReason: 'Felt Like It',
      optOutFeedback: 'Good',
    });
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.status).toEqual(ResponseStatusCode.MTN_OPT_OUT_FAILURE);
  });
  it('optOutCustomers return StatusMessagePresenter 3993', async () => {
    jest
      .spyOn(controller['customersService'], 'optOutCustomers')
      .mockResolvedValueOnce(3993);
    const result = await controller.optOutCustomers('customerId', {
      countryCode: '+256',
      msisdn: '999999999',
      optOutReason: 'Felt Like It',
      optOutFeedback: 'Good',
    });
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.status).toEqual(ResponseStatusCode.MTN_OPT_OUT_LOANS_PRESENT);
  });
});
