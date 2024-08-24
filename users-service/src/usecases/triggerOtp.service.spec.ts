import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DedupStatus } from '../domain/enum/dedupStatus.enum';
import { LeadStatus } from '../domain/enum/leadStatus.enum';
import { OtpType } from '../domain/enum/otpType.enum';
import { TelcoOpType } from '../domain/enum/telcoOp.enum';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { mockCustOtp, mockCustOtp3 } from '../domain/model/mocks/cust-otp.mock';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustTelcoRepository } from '../domain/repository/custTelcoRepository.interface';
import { IWhitelistedStudentDetailsRepository } from '../domain/repository/whitelistedStudentDetailsRepository.interface';
import { ICustDedupService } from '../domain/services/custDedupService.interface';
import { ICustToLMSService } from '../domain/services/custToLMSService.interface';
import { IMtnService } from '../domain/services/mtn.service.interface';
import { INotificationService } from '../domain/services/notificationsService.interface';
import { DashboardResponseDTO } from '../infrastructure/controllers/customers/dtos/dashboardResponse.dto';
import { generateMockMTNApprovalPollingDTO } from '../infrastructure/controllers/customers/dtos/mtnApprovalPolling.dto.spec';
import { generateMockMTNApprovalServiceDTO } from '../infrastructure/controllers/customers/dtos/mtnApprovalService.dto.spec';
import { TriggerOtpDto } from '../infrastructure/controllers/customers/dtos/triggerOtp.dto';
import { generateMockTriggerOtpDto } from '../infrastructure/controllers/customers/dtos/triggerOtp.dto.spec';
import { TriggerOtpServiceDto } from '../infrastructure/controllers/customers/dtos/triggerOtpService.dto';
import { EKycPresenter } from '../infrastructure/controllers/customers/presenters/ekyc.presenter';
import { CustOtp } from '../infrastructure/entities/custOtp.entity';
import { mockWhitelistedStudentDetailsRepository } from '../infrastructure/repository/mocks/whitelisted-student-details.repository.mock';
import { AggregatorWhiteListingService } from '../infrastructure/services/aggregatorWhitelisting.service';
import { MockData } from '../infrastructure/services/mockData';
import { MtnService } from '../infrastructure/services/mtn.service';
import { PushNotificationService } from '../infrastructure/services/push-notification-service';
import { TriggerOtpService } from './triggerOtp.service';
import { IWhitelistedSchoolRepository } from '../domain/repository/whitelistedSchoolRepository.interface';
import { IWhitelistedSchool } from '../domain/model/whitelistedSchool.interface';
import { WhitelistedSchool } from '../infrastructure/entities/whitelistedSchool.entity';

describe('triggerOtp', () => {
  let service: TriggerOtpService;
  let checkWIPDedupSpy: jest.SpyInstance<any, unknown[]>;
  let sendAndSaveOtpSpy: jest.SpyInstance<any, unknown[]>;
  // let checkWIPDedupSpy: jest.SpyInstance<any, unknown[]>;
  const mockTriggerOtpDto: TriggerOtpDto = generateMockTriggerOtpDto();

  const mockCustomerOtpRepository: ICustOtpRepository = {
    create: function (otp: ICustOtp): Promise<ICustOtp> {
      return Promise.resolve(otp);
    },
    getById: function (id: string): Promise<ICustOtp> {
      return Promise.resolve({ ...mockCustOtp3, ...mockTriggerOtpDto, id });
    },
    getByMsisdn: function (
      msisdn: string,
      msisdnCountryCode: string,
    ): Promise<ICustOtp> {
      return Promise.resolve({
        ...mockCustOtp3,
        ...mockTriggerOtpDto,
        msisdn,
        msisdnCountryCode,
      });
    },
    update: function (lead: ICustOtp): Promise<ICustOtp> {
      return Promise.resolve({ ...mockTriggerOtpDto, ...lead });
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
      return Promise.resolve(mockCustOtp);
    },
    findLeadForPurging: function (purgingHour: number): Promise<ICustOtp[]> {
      throw new Error('Function not implemented.');
    },
    updateCustOtpList: function (custOtpList: ICustOtp[]): Promise<ICustOtp[]> {
      throw new Error('Function not implemented.');
    },
  };

  const mockNotificationsService: INotificationService = {
    sendOTPSms: function (
      otp: string,
      otpType: OtpType,
      msisdnCountryCode: string,
      msisdn: string,
    ) {
      return;
    },
    sendOTPEmail: function (
      otp: string,
      otpType: string,
      recipientEmail: string,
    ) {
      return;
    },
  };
  const mockWhitelistedSchoolRepository: IWhitelistedSchoolRepository = {
    findAll: function (): Promise<IWhitelistedSchool[]> {
      return Promise.resolve([mockwWitelistedSchoolEntity]);
    },
    findByName: function (schoolName: string): Promise<IWhitelistedSchool> {
      return Promise.resolve(mockwWitelistedSchoolEntity);
    },
  };

  const mockCustDedupService: ICustDedupService = {
    checkWIPDedup: function (
      nationalIdNumber: string,
      msisdnCountryCode: string,
      msisdn: string,
      email: string,
    ): Promise<{ responseStatus: DedupStatus; custOtp: ICustOtp }> {
      return Promise.resolve({
        responseStatus: DedupStatus.DEDUP_NO_MATCH,
        custOtp: null,
      });
    },
    checkDedupInternal: function (
      leadId: string,
      nationalIdNumber: string,
      msisdnCountryCode: string,
      msisdn: string,
      email: string,
    ): Promise<DedupStatus> {
      throw new Error('Function not implemented.');
    },
  };

  const mockCustTelcoRepo: ICustTelcoRepository = {
    findByLeadId: function (leadId: string): Promise<ICustTelco> {
      throw new Error('Function not implemented.');
    },
    save: function (custTelco: ICustTelco): Promise<ICustTelco> {
      throw new Error('Function not implemented.');
    },
    findByFullMsisdnAndLeadId: function (
      msisdnCountryCode: string,
      msisdn: string,
      leadId: string,
    ): Promise<ICustTelco> {
      return Promise.resolve(MockData.mockCustTelcoEnitytData);
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

  const mockCustToLMSService: ICustToLMSService = {
    getDashboardDetails: function (
      custPrimaryDetails: ICustPrimaryDetails,
    ): Promise<DashboardResponseDTO> {
      throw new Error('Function not implemented.');
    },
    getEKycState: function (custId: string): Promise<EKycPresenter> {
      throw new Error('Function not implemented.');
    },
    getTelcoData: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustTelco> {
      return Promise.resolve(MockData.mockCustTelcoEnitytData);
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

  const mockwWitelistedSchoolEntity: IWhitelistedSchool =
    new WhitelistedSchool();
  mockwWitelistedSchoolEntity.id = '123';
  mockwWitelistedSchoolEntity.countryCode = '+256';
  mockwWitelistedSchoolEntity.createdAt = new Date('9999-12-30');
  mockwWitelistedSchoolEntity.district = 'district';
  mockwWitelistedSchoolEntity.emisCode = 1;
  mockwWitelistedSchoolEntity.schoolName = 'school';
  mockwWitelistedSchoolEntity.updatedAt = new Date('9999-12-30');

  const mockMtnService = createMock<MtnService>();

  const mockAggregatorWhitelistingService =
    createMock<AggregatorWhiteListingService>();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TriggerOtpService,
        { provide: ICustOtpRepository, useValue: mockCustomerOtpRepository },
        { provide: INotificationService, useValue: mockNotificationsService },
        {
          provide: ICustDedupService,
          useValue: mockCustDedupService,
        },
        {
          provide: AggregatorWhiteListingService,
          useValue: mockAggregatorWhitelistingService,
        },
        {
          provide: IWhitelistedStudentDetailsRepository,
          useValue: mockWhitelistedStudentDetailsRepository,
        },
        { provide: IMtnService, useValue: mockMtnService },
        {
          provide: PushNotificationService,
          useValue: createMock<PushNotificationService>(),
        },
        {
          provide: IWhitelistedSchoolRepository,
          useValue: mockWhitelistedSchoolRepository,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<TriggerOtpService>(TriggerOtpService);
    const custDedupService = module.get<ICustDedupService>(ICustDedupService);
    checkWIPDedupSpy = jest.spyOn(custDedupService, 'checkWIPDedup');
    sendAndSaveOtpSpy = jest.spyOn(
      TriggerOtpService.prototype as any,
      'sendAndSaveOtp',
    );
  });
  it('customers service triggerOTP should return IOtp object', async () => {
    let resend = false;
    const result = await service.triggerOtp(mockTriggerOtpDto);
    expect(result).toBeInstanceOf(TriggerOtpServiceDto);
    resend = true;
    const result_resend_true = await service.triggerOtp(mockTriggerOtpDto);
    expect(result_resend_true).toBeInstanceOf(TriggerOtpServiceDto);
  });
  // it('if otpType is SMS, phoneStatus should be true and emailStatus should be false', async () => {
  //   checkWIPDedupSpy.mockReturnValueOnce(
  //     Promise.resolve({
  //       responseStatus: DedupStatus.DEDUP_NO_MATCH,
  //       custOtp: null,
  //     }),
  //   );
  //   const result = await service.triggerOtp({
  //     ...mockLead,
  //     otpType: OtpType.SMS,
  //   });
  //   expect(result.lead.emailStatus).toBe(false);
  //   expect(result.lead.phoneStatus).toBe(true);
  // });
  // it('if otpType is BOTH, phoneStatus and emailStatus should be true', async () => {
  //   checkWIPDedupSpy.mockReturnValueOnce(
  //     Promise.resolve({
  //       responseStatus: DedupStatus.DEDUP_NO_MATCH,
  //       custOtp: null,
  //     }),
  //   );
  //   const result = await service.triggerOtp({
  //     ...mockLead,
  //     otpType: OtpType.BOTH,
  //   });
  //   expect(result.lead.emailStatus).toBe(true);
  //   expect(result.lead.phoneStatus).toBe(true);
  // });
  // it('if otpType is EMAIL, phoneStatus should be false and emailStatus should be true', async () => {
  //   checkWIPDedupSpy.mockReturnValueOnce(
  //     Promise.resolve({
  //       responseStatus: DedupStatus.DEDUP_NO_MATCH,
  //       custOtp: null,
  //     }),
  //   );
  //   const result = await service.triggerOtp({
  //     ...mockLead,
  //     otpType: OtpType.EMAIL,
  //   });
  //   expect(result.lead.emailStatus).toBe(true);
  //   expect(result.lead.phoneStatus).toBe(false);
  // });
  it('if dedupdeStatus is WIP and leadCurrentStatus is OTP_GENERATED, should send otp', async () => {
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp3,
          leadCurrentStatus: LeadStatus.OTP_GENERATED,
        },
      }),
    );
    const result = await service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    expect(sendAndSaveOtpSpy).toHaveBeenCalledTimes(1);
  });
  it('if dedupdeStatus is WIP and leadCurrentStatus is OTP_GENERATED, should send otp if it is expired and not locked', async () => {
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp3,
          leadCurrentStatus: LeadStatus.OTP_GENERATED,
          otpCount: 0, // not locked
          otpStatusAt: new Date(Date.now() - 10000 * 1000), //not locked
          otpExpiry: new Date(Date.now() - 100000 * 1000), // otp expired
        },
      }),
    );
    const result = await service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    expect(sendAndSaveOtpSpy).toHaveBeenCalledTimes(1);
  });
  it('if dedupdeStatus is WIP and leadCurrentStatus is OTP_GENERATED, should still send otp if it is not expired and not locked', async () => {
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp3,
          leadCurrentStatus: LeadStatus.OTP_GENERATED,
          otpCount: 0, // otp not locked
          otpExpiry: new Date(Date.now() + 100000 * 1000), //otp not expired
        },
      }),
    );
    const result = await service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    expect(sendAndSaveOtpSpy).toHaveBeenCalledTimes(1);
  });
  it('if dedupdeStatus is WIP and leadCurrentStatus is OTP_GENERATED, should not send otp if it is expired but locked', async () => {
    const otpMaxFails = parseInt(process.env.REGISTER_OTP_MAX_RETRIES);
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp3,
          leadCurrentStatus: LeadStatus.OTP_GENERATED,
          failedAttempts: otpMaxFails, // otp locked
          lockedAt: new Date(Date.now() + 100000 * 1000), //otp locked
          otpExpiry: new Date(Date.now() - 100000 * 1000), //otp expired
        },
      }),
    );
    const result = service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    await expect(result).rejects.toThrowError();
    expect(sendAndSaveOtpSpy).toHaveBeenCalledTimes(0);
  });
  it('if dedupdeStatus is WIP and leadCurrentStatus is OTP_FAILED, should send otp if it is expired and not locked', async () => {
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp3,
          leadCurrentStatus: LeadStatus.OTP_FAILED,
          otpCount: 0, // not locked
          otpStatusAt: new Date(Date.now() - 10000 * 1000), //not locked
          otpExpiry: new Date(Date.now() - 100000 * 1000), // otp expired
        },
      }),
    );
    const result = await service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    expect(sendAndSaveOtpSpy).toHaveBeenCalledTimes(1);
  });
  it('if dedupdeStatus is WIP and leadCurrentStatus is OTP_FAILED, should still send otp if it is not expired and not locked', async () => {
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp3,
          leadCurrentStatus: LeadStatus.OTP_FAILED,
          otpCount: 0, // otp not locked
          otpExpiry: new Date(Date.now() + 100000 * 1000), //otp not expired
        },
      }),
    );
    const result = await service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    expect(sendAndSaveOtpSpy).toHaveBeenCalledTimes(1);
  });
  it('if dedupdeStatus is WIP and leadCurrentStatus is OTP_FAILED, should still send otp if it is not expired and not locked', async () => {
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp3,
          leadCurrentStatus: LeadStatus.OTP_FAILED,
          otpCount: 0, // otp not locked
          otpExpiry: new Date(Date.now() + 100000 * 1000), //otp not expired
        },
      }),
    );
    const result = await service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    expect(sendAndSaveOtpSpy).toHaveBeenCalledTimes(1);
  });
  it('if dedupdeStatus is WIP and leadCurrentStatus is OTP_FAILED, should not send otp if it is expired but locked', async () => {
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp3,
          leadCurrentStatus: LeadStatus.OTP_FAILED,
          failedAttempts: 3, // otp locked
          lockedAt: new Date(Date.now()), //otp locked
          otpExpiry: new Date(Date.now() - 100000 * 1000), //otp expired
        },
      }),
    );
    const result = service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    await expect(result).rejects.toThrowError();
    expect(sendAndSaveOtpSpy).toHaveBeenCalledTimes(0);
  });
  it('if dedupdeStatus is WIP and leadCurrentStatus is OTP_GENERATED, should not send otp if otpSentCount exceeds max otp triggers', async () => {
    const otpMaxFails = parseInt(process.env.REGISTER_OTP_MAX_RETRIES);
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp3,
          leadCurrentStatus: LeadStatus.OTP_GENERATED,
          otpSentCount: otpMaxFails, // otp locked
          otpSentLockedAt: new Date(Date.now() + 100000 * 1000), //otp locked
          otpExpiry: new Date(Date.now() - 100000 * 1000), //otp expired
        },
      }),
    );
    const result = service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    await expect(result).rejects.toThrowError();
    expect(sendAndSaveOtpSpy).toHaveBeenCalledTimes(0);
  });
  it('if dedupdeStatus is WIP and leadCurrentStatus is LEAD_ONBOARDED, response should NOT contain phoneStatus, emailStatus, optSentAt, otpType and otp properties', async () => {
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp3,
          leadCurrentStatus: LeadStatus.LEAD_ONBOARDED,
        },
      }),
    );
    const result = await service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    expect(sendAndSaveOtpSpy).toHaveBeenCalledTimes(0);
    expect(result.lead.phoneStatus).toBeUndefined();
    expect(result.lead.emailStatus).toBeUndefined();
    expect(result.lead.otpType).toBeUndefined();
    expect(result.lead.otp).toBeUndefined();
    expect(result.lead.leadCurrentStatus).toEqual(LeadStatus.LEAD_ONBOARDED);
  });

  it('if dedupdeStatus is WIP and OTP_VERIFIED | LEAD_CREATED | LEAD_ONBOARDED | LEAD_ENHANCED, should send otp', async () => {
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp3,
          leadCurrentStatus: LeadStatus.OTP_VERIFIED,
        },
      }),
    );
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp3,
          leadCurrentStatus: LeadStatus.LEAD_CREATED,
        },
      }),
    );
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp3,
          leadCurrentStatus: LeadStatus.LEAD_ENHANCED,
        },
      }),
    );
    await service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    await service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    await service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    expect(sendAndSaveOtpSpy).toHaveBeenCalledTimes(3);
  });
  it('if dedupdeStatus is DEDUP_MATCH, should dto.lead should be undefined', async () => {
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.DEDUP_MATCH,
        custOtp: {
          ...mockCustOtp3,
        },
      }),
    );
    const result = await service.triggerOtp({
      ...mockTriggerOtpDto,
    });
    expect(result.lead).toEqual(new CustOtp());
  });

  it('expiry date should be the x seconds after created date as configured in ConfigService', async () => {
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: mockCustOtp3,
      }),
    );
    const otpValidSeconds: number = parseInt(process.env.OTP_VALID_SECONDS);

    const result = await service.triggerOtp(mockTriggerOtpDto);
    const diffInMilliseconds =
      result.lead.otpExpiry.getTime() - result.lead.otpCreatedAt.getTime();
    expect(diffInMilliseconds).toBe(otpValidSeconds * 1000);
  });
  it('otp should follow pattern ABC-123123', async () => {
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: mockCustOtp3,
      }),
    );

    const result = await service.triggerOtp(mockTriggerOtpDto);
    expect(result.lead.otp).toMatch(/^[A-Z]{3}-\d{6}$/);
  });

  it('otp should call mtnPolling api', async () => {
    const result = await service.mtnApprovalPolling(
      generateMockMTNApprovalPollingDTO(),
    );
    const mtnApprovalMock = await generateMockMTNApprovalServiceDTO();
    mtnApprovalMock.custOtp = result.custOtp;
    expect(result).toEqual(mtnApprovalMock);
  });
  //MTN Opt In
  it('MTN Opt-in flow when approvalId null', async () => {
    jest.spyOn(mockMtnService, 'optIn').mockResolvedValueOnce({
      approvalid: 'appr123',
      externalRequestId: 'ext123',
    });
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp,
          telcoOp: TelcoOpType.MTN_UG,
          leadCurrentStatus: LeadStatus.OTP_NOT_SENT,
          mtnApprovalId: null,
        },
      }),
    );
    const result = await service.triggerOtp(mockTriggerOtpDto);
    expect(result).toEqual(expect.objectContaining({ approvalId: 'appr123' }));
  });
  it('MTN Opt-in flow when mtnValidationStatus VALIDATION_FAILED', async () => {
    jest.spyOn(mockMtnService, 'optIn').mockResolvedValueOnce({
      approvalid: 'appr123',
      externalRequestId: 'ext123',
    });
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp,
          telcoOp: TelcoOpType.MTN_UG,
          leadCurrentStatus: LeadStatus.OTP_NOT_SENT,
          mtnApprovalId: 'appr000',
          mtnValidationStatus: 'VALIDATION_FAILED',
        },
      }),
    );
    const result = await service.triggerOtp(mockTriggerOtpDto);
    expect(result).toEqual(
      expect.objectContaining({
        isOnboardingTerminated: true,
        telcoNotFound: true,
      }),
    );
  });
  it('MTN Opt-in flow when mtnValidationStatus null', async () => {
    jest.spyOn(service['configService'], 'get').mockReturnValueOnce('true'); //TELCO-OPERATOR-CHECK = true
    jest.spyOn(mockMtnService, 'optIn').mockResolvedValueOnce({
      approvalid: 'appr123',
      externalRequestId: 'ext123',
    });
    checkWIPDedupSpy.mockReturnValueOnce(
      Promise.resolve({
        responseStatus: DedupStatus.WIP,
        custOtp: {
          ...mockCustOtp,
          telcoOp: TelcoOpType.MTN_UG,
          leadCurrentStatus: LeadStatus.OTP_NOT_SENT,
          mtnApprovalId: 'appr000',
          mtnValidationStatus: null,
        },
      }),
    );
    const result = await service.triggerOtp(mockTriggerOtpDto);
    expect(result).toEqual(expect.objectContaining({ approvalId: 'appr123' }));
  });
  it('otp should call mtnPolling api', async () => {
    const result = await service.mtnApprovalPolling(
      generateMockMTNApprovalPollingDTO(),
    );
    const mtnApprovalMock = await generateMockMTNApprovalServiceDTO();
    mtnApprovalMock.custOtp = result.custOtp;
    expect(result).toEqual(mtnApprovalMock);
  });
});
