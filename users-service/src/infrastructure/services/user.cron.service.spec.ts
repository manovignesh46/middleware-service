import { Test, TestingModule } from '@nestjs/testing';
import { UserCronService } from './user.cron.service';
import { ConfigService } from '@nestjs/config';
import { ICustPrimaryDetailsRepository } from '../../domain/repository/custPrimaryDetailsRepository.interface';
import { ICustPrimaryDetails } from '../../domain/model/custPrimaryDetails.interface';
import { ICustOtpRepository } from '../../domain/repository/custOtpRepository.interface';
import { ICustOtp } from '../../domain/model/custOtp.interface';
import { SchedulerRegistry } from '@nestjs/schedule';
import { createMock } from '@golevelup/ts-jest';
import { NotificationServiceClient } from './notifiction-service-client/notifications-service-client.service';
import { MockData } from './mockData';
import { mockCustOtp3 } from '../../domain/model/mocks/cust-otp.mock';
import { ICustRefinitivRepository } from '../../domain/repository/custRefinitivRepository.interface';
import { ICustRefinitiv } from '../../domain/model/custRefinitiv.interface';
import { IRefinitiveService } from '../../domain/services/refinitiveService.interface';
import { ICustTelcoRepository } from '../../domain/repository/custTelcoRepository.interface';
import { ICustTelco } from '../../domain/model/custTelco.interface';
import { ICustToLMSService } from '../../domain/services/custToLMSService.interface';
import { DashboardResponseDTO } from '../controllers/customers/dtos/dashboardResponse.dto';
import { EKycPresenter } from '../controllers/customers/presenters/ekyc.presenter';
import { PushNotificationService } from './push-notification-service';

describe('UserCronService', () => {
  let service: UserCronService;

  const mockCustPrimaryDetailsRepository: ICustPrimaryDetailsRepository = {
    getByCustomerId: function (
      customerId: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
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
    findByNinMsisdn: function (
      nationalIdNumber: string,
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustPrimaryDetails> {
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
      throw new Error('Function not implemented.');
    },
    updateCustomer: function (
      customer: ICustPrimaryDetails,
    ): Promise<ICustPrimaryDetails> {
      return Promise.resolve(MockData.mockCustPrimaryDetails);
    },
    getByEmail: function (
      email: string,
      custId: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    getZeroLoansCust: function (): Promise<ICustPrimaryDetails[]> {
      return Promise.resolve([MockData.mockCustPrimaryDetails]);
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
      throw new Error('Function not implemented.');
    },
    getByMsisdn: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    update: function (otp: ICustOtp): Promise<ICustOtp> {
      return Promise.resolve(mockCustOtp3);
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
      return Promise.resolve([mockCustOtp3]);
    },
    findLeadByExReqIdApprovalIdFullMsisdn: function (
      mtnOptInReqId: string,
      mtnApprovalId: string,
      fullMsisdn: string,
    ): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    findLeadByMsisdnApprovalId: function (
      msisdnCountryCode: string,
      msisdn: string,
      mtnApprovalId: string,
    ): Promise<ICustOtp> {
      throw new Error('Function not implemented.');
    },
    findLeadForPurging: function (purgingHour: number): Promise<ICustOtp[]> {
      return Promise.resolve([mockCustOtp3]);
    },
    updateCustOtpList: function (custOtpList: ICustOtp[]): Promise<ICustOtp[]> {
      return Promise.resolve([mockCustOtp3]);
    },
  };

  const mockCustRefinitiveRepo: ICustRefinitivRepository = {
    findByLeadId: function (leadId: string): Promise<ICustRefinitiv> {
      throw new Error('Function not implemented.');
    },
    save: function (custRefinitiv: ICustRefinitiv): Promise<ICustRefinitiv> {
      return Promise.resolve(MockData.mockRefinitiveEnityData);
    },
    findUnResolvedCase: function (): Promise<ICustRefinitiv[]> {
      return Promise.resolve([MockData.mockRefinitiveEnityData]);
    },
  };

  const mockCustTelcoRepository: ICustTelcoRepository = {
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
      throw new Error('Function not implemented.');
    },
    findByLeadIdList: function (leadIdList: string[]): Promise<ICustTelco[]> {
      return Promise.resolve([MockData.mockCustTelcoEnitytData]);
    },
    updateCustTelcoList: function (
      custTelco: ICustTelco[],
    ): Promise<ICustTelco[]> {
      return Promise.resolve([MockData.mockCustTelcoEnitytData]);
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
      throw new Error('Function not implemented.');
    },
    purgeCustomer: function (msisdnList: string[]): Promise<string[]> {
      return Promise.resolve([]);
    },
    optOutCustomer: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<number> {
      return Promise.resolve(2000);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ICustOtpRepository, useValue: mockCustOtpRepository },
        {
          provide: ICustPrimaryDetailsRepository,
          useValue: mockCustPrimaryDetailsRepository,
        },
        {
          provide: SchedulerRegistry,
          useValue: createMock<SchedulerRegistry>(),
        },
        {
          provide: NotificationServiceClient,
          useValue: createMock<NotificationServiceClient>(),
        },
        { provide: ICustRefinitivRepository, useValue: mockCustRefinitiveRepo },
        {
          provide: IRefinitiveService,
          useValue: createMock<IRefinitiveService>(),
        },
        {
          provide: ICustTelcoRepository,
          useValue: mockCustTelcoRepository,
        },
        {
          provide: ICustToLMSService,
          useValue: mockCustToLMSService,
        },
        {
          provide: PushNotificationService,
          useValue: createMock<PushNotificationService>(),
        },
        UserCronService,
        ConfigService,
      ],
    }).compile();

    service = module.get<UserCronService>(UserCronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call the onModuleInit', async () => {
    const result = await service.onModuleInit();
    expect(result).toBe(undefined);
  });

  it('should call the UserCronService doCustOnboardingReminder', async () => {
    const result = await service.doCustOnboardingReminder();
    expect(result).toBe(undefined);
  });

  it('should call the UserCronService doRefinitiveResolution', async () => {
    const result = await service.doRefinitiveResolution();
    expect(result).toBe(undefined);
  });

  it('should call the UserCronService doCustFirstLoanReminder', async () => {
    const result = await service.doCustFirstLoanReminder();
    expect(result).toBe(undefined);
  });

  it('should call the UserCronService doPIIPurging', async () => {
    const result = await service.doPIIPurging();
    expect(result).toBe(undefined);
  });
});
