import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LeadStatus } from '../domain/enum/leadStatus.enum';
import { OtpType } from '../domain/enum/otpType.enum';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustRefinitiv } from '../domain/model/custRefinitiv.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { ICustTelcoTransaction } from '../domain/model/custTelcoTransaction.interface';
import { mockCustOtp } from '../domain/model/mocks/cust-otp.mock';
import { IStudentDetails } from '../domain/model/studentDetails.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustTelcoRepository } from '../domain/repository/custTelcoRepository.interface';
import { IContentService } from '../domain/services/content.service.interface';
import { ICustRefinitivService } from '../domain/services/custRefinitivService.interface';
import { ICustTelcoService } from '../domain/services/custTelcoService.interface';
import { ICustToLMSService } from '../domain/services/custToLMSService.interface';
import { ICustToLOSService } from '../domain/services/custToLOSService.interface';
import {
  IExperianService,
  KycEnquiryDto,
} from '../domain/services/experian-service.interface';
import { ITelcoService } from '../domain/services/telcoService.interface';
import { OtpLockedError } from '../infrastructure/controllers/common/errors/otpLocked.error';
import { VerifyOtpServiceDto } from '../infrastructure/controllers/customers/dtos/verifyOtpService.dto';
import { ConfirmStudentDetailsPresenter } from '../infrastructure/controllers/customers/presenters/confirmStudentDetails.presenter';
import { DashBoardPresenter } from '../infrastructure/controllers/customers/presenters/dashBoard.presenter';
import { CustScoringData } from '../infrastructure/entities/custScoringData.entity';
import { CustTelco } from '../infrastructure/entities/custTelco.entity';
import { mockCustTelcoRepository } from '../infrastructure/repository/mocks/cust-telco.repository.mock';
import { ContentService } from '../infrastructure/services/content.service';
import { MockData } from '../infrastructure/services/mockData';
import { NotificationServiceClient } from '../infrastructure/services/notifiction-service-client/notifications-service-client.service';
import { PushNotificationService } from '../infrastructure/services/push-notification-service';
import { CustToLMSService } from './custToLMS.service';
import { VerifyOtpService } from './verifyOtp.service';

describe('VerifyOtpService', () => {
  let service: VerifyOtpService;
  let configService: ConfigService;

  const mockLead: ICustOtp = {
    ...mockCustOtp,
    phoneStatus: true,
    emailStatus: true,
    otp: 'ABC-123123',
    failedAttempts: 0,
    otpType: OtpType.BOTH,
    otpExpiry: new Date(Date.now() + 59 * 1000),
    leadCurrentStatus: LeadStatus.OTP_GENERATED,
  };

  const mockCustOtpRepository: ICustOtpRepository = {
    create: function (otp: ICustOtp): Promise<ICustOtp> {
      return Promise.resolve(otp);
    },
    getById: function (id: string): Promise<ICustOtp> {
      return Promise.resolve({ ...mockLead, id });
    },
    getByMsisdn: function (
      msisdn: string,
      msisdnCountryCode: string,
    ): Promise<ICustOtp> {
      return Promise.resolve({ ...mockLead, msisdn, msisdnCountryCode });
    },
    update: function (lead: ICustOtp): Promise<ICustOtp> {
      return Promise.resolve({ ...mockLead, ...lead });
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
      return Promise.resolve(mockCustOtp);
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

  // const mockNotificationsService: INotificationService = {
  //   sendOTPSms: function (
  //     otp: string,
  //     otpType: OtpType,
  //     msisdnCountryCode: string,
  //     msisdn: string,
  //   ) {
  //     return;
  //   },
  //   sendOTPEmail: function (
  //     otp: string,
  //     otpType: string,
  //     recipientEmail: string,
  //   ) {
  //     return;
  //   },
  // };
  const mockCustToLOSService: ICustToLOSService = {
    leadCreationInLOS: jest.fn(function (
      leadId: string,
      leadCurrentStatus: LeadStatus,
    ): Promise<any> {
      return Promise.resolve();
    }),
    getCustomerLoansFromLOS: jest.fn(function (
      custId: string,
      custloanStatus: boolean,
      offset: number,
      limit: number,
      startDate: string,
      endDate: string,
    ): Promise<any> {
      return Promise.resolve();
    }),
    leadVerifiedInLOS: function (leadId: string): Promise<any> {
      return Promise.resolve();
    },
    leadEnhancedInLOS: function (
      leadId: string,
      custScoringData: CustScoringData,
    ): Promise<any> {
      return Promise.resolve();
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
      throw new Error('Function not implemented.');
    },
    checkForRejection: function (leadId: string): Promise<any> {
      throw new Error('Function not implemented.');
    },
  };

  const mockCustTelcoService: ICustTelcoService = {
    findCustTelco: function (leadId: string): Promise<ICustTelco> {
      let mock = new CustTelco();
      mock = MockData.mockCustTelcoEnitytData;
      return Promise.resolve(mock);
    },
    save: function (custTelco: ICustTelco): Promise<ICustTelco> {
      return Promise.resolve(MockData.mockCustTelcoEnitytData);
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
      return Promise.resolve(null);
    },
    findCustRefinitiv: function (leadId: string): Promise<ICustRefinitiv> {
      throw new Error('Function not implemented.');
    },
    save: function (custRefinitiv: ICustRefinitiv): Promise<ICustRefinitiv> {
      throw new Error('Function not implemented.');
    },
  };

  const mockExperianService: IExperianService = {
    kycEnquiry: function (kycEnquiryDto: KycEnquiryDto): Promise<void> {
      return Promise.resolve();
    },
  };

  const mockTelcoService: ITelcoService = {
    findTelcoKYC: function (
      leadId: string,
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustTelco> {
      return Promise.resolve(MockData.mockCustTelcoEnitytData);
    },
    findTelcoTransaction: function (
      leadId: string,
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustTelcoTransaction> {
      return Promise.resolve(MockData.mockCustTelcoTransactionEntityData);
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyOtpService,
        { provide: ICustToLOSService, useValue: mockCustToLOSService },
        { provide: ICustOtpRepository, useValue: mockCustOtpRepository },
        { provide: ICustTelcoService, useValue: mockCustTelcoService },
        { provide: ICustRefinitivService, useValue: mockCustRefinitiveService },
        { provide: IExperianService, useValue: mockExperianService },
        { provide: ITelcoService, useValue: mockTelcoService },
        { provide: ICustTelcoRepository, useValue: mockCustTelcoRepository },
        { provide: IContentService, useValue: createMock<ContentService>() },
        {
          provide: NotificationServiceClient,
          useValue: createMock<NotificationServiceClient>(),
        },
        {
          provide: ICustToLMSService,
          useValue: createMock<CustToLMSService>(),
        },
        {
          provide: PushNotificationService,
          useValue: createMock<PushNotificationService>(),
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<VerifyOtpService>(VerifyOtpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return verifyOtpServiceDto', async () => {
    const otp = 'ABC-123123';
    const result = await service.verifyOtp(
      mockLead.msisdnCountryCode,
      mockLead.msisdn,
      otp,
    );
    expect(result).toBeInstanceOf(VerifyOtpServiceDto);
  });
  it('should return presenter.verified = true when otp if correct', async () => {
    const otp = 'ABC-123123';
    const result = await service.verifyOtp(
      mockLead.msisdnCountryCode,
      mockLead.msisdn,
      otp,
    );
    expect(result.verified).toEqual(true);
    expect(result.otpCount).toEqual(0);
  });
  it('should return presenter.verified = false when otp if wrong, and increment otpCount', async () => {
    const otp = 'XYZ-789789';
    const result = await service.verifyOtp(
      mockLead.msisdnCountryCode,
      mockLead.msisdn,
      otp,
    );
    expect(result.verified).toEqual(false);
    expect(result.otpCount).toEqual(1);
  });
  it('should increment otpCount when failed', async () => {
    const otp = 'XYZ-789789';
    jest
      .spyOn(service['leadsRepository'], 'getByMsisdn')
      .mockReturnValueOnce(Promise.resolve({ ...mockLead, failedAttempts: 0 }))
      .mockReturnValueOnce(Promise.resolve({ ...mockLead, failedAttempts: 1 }))
      .mockReturnValueOnce(Promise.resolve({ ...mockLead, failedAttempts: 2 }));

    const result1 = await service.verifyOtp(
      mockLead.msisdnCountryCode,
      mockLead.msisdn,
      otp,
    );
    expect(result1.verified).toEqual(false);
    expect(result1.otpCount).toEqual(1);
    const result2 = await service.verifyOtp(
      mockLead.msisdnCountryCode,
      mockLead.msisdn,
      otp,
    );
    expect(result2.verified).toEqual(false);
    expect(result2.otpCount).toEqual(2);
    const result3 = await service.verifyOtp(
      mockLead.msisdnCountryCode,
      mockLead.msisdn,
      otp,
    );
    expect(result3.verified).toEqual(false);
    expect(result3.otpCount).toEqual(3);
  });
  it('should throw error if failed attempts is x and otpStatusAt is within within the cooloff period', async () => {
    const otp = 'XYZ-789789';
    const otpMaxRetries = configService.get<number>('REGISTER_OTP_MAX_RETRIES');
    jest.spyOn(service['leadsRepository'], 'getByMsisdn').mockReturnValueOnce(
      Promise.resolve({
        ...mockLead,
        failedAttempts: otpMaxRetries, // locked
        lockedAt: new Date(), //locked
      }),
    );
    const result = service.verifyOtp(
      mockLead.msisdnCountryCode,
      mockLead.msisdn,
      otp,
    );
    await expect(result).rejects.toBeInstanceOf(OtpLockedError);
  });
  it('should return verified = true if otp is correct on the last attempt', async () => {
    const otp = 'ABC-123123';
    const otpMaxRetries = configService.get<number>('REGISTER_OTP_MAX_RETRIES');
    jest.spyOn(service['leadsRepository'], 'getByMsisdn').mockReturnValueOnce(
      Promise.resolve({
        ...mockLead,
        failedAttempts: otpMaxRetries - 1,
      }),
    );
    jest
      .spyOn(service['leadsRepository'], 'getById')
      .mockReturnValueOnce(
        Promise.resolve({
          ...mockLead,
          failedAttempts: otpMaxRetries - 1,
        }),
      )
      .mockReturnValueOnce(
        Promise.resolve({
          ...mockLead,
          failedAttempts: otpMaxRetries - 1,
        }),
      )
      .mockReturnValueOnce(
        Promise.resolve({
          ...mockLead,
          failedAttempts: otpMaxRetries - 1,
        }),
      );
    const result: VerifyOtpServiceDto = await service.verifyOtp(
      mockLead.msisdnCountryCode,
      mockLead.msisdn,
      otp,
    );
    expect(result.verified).toEqual(true);
    expect(result.otpCount).toEqual(otpMaxRetries - 1);
  });
});
