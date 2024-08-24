import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { OtpAction } from '../domain/enum/otp-action.enum';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { mockCustIdCardDetails } from '../domain/model/mocks/cust-id-card-details.mock';
import { mockCustPrimaryDetails } from '../domain/model/mocks/cust-primary-details.mock';
import { mockCustTelco } from '../domain/model/mocks/cust-telco.mock';
import { mockGeneralOtp } from '../domain/model/mocks/general-otp.mock';
import { ICustIdCardDetailsRepository } from '../domain/repository/custIdCardDetailsRepository.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { ICustTelcoRepository } from '../domain/repository/custTelcoRepository.interface';
import { IContentService } from '../domain/services/content.service.interface';
import { ForgotPinOtpTriggerDto } from '../infrastructure/controllers/customers/dtos/general-otp-trigger.dto';
import { mockCustIdCardDetailsRepository } from '../infrastructure/repository/mocks/cust-id-card-details.repository.mock';
import { mockCustTelcoRepository } from '../infrastructure/repository/mocks/cust-telco.repository.mock';
import { ContentService } from '../infrastructure/services/content.service';
import { GeneralOtpService } from '../infrastructure/services/general-otp.service';
import { NotificationServiceClient } from '../infrastructure/services/notifiction-service-client/notifications-service-client.service';
import { PushNotificationService } from '../infrastructure/services/push-notification-service';
import { ForgotPinService } from './forgot-pin-service';

let service: ForgotPinService;
const mockCustPrimaryDetailsRepository =
  createMock<ICustPrimaryDetailsRepository>();
jest
  .spyOn(mockCustPrimaryDetailsRepository, 'findByNinMsisdn')
  .mockImplementation((nationalIdNumber, msisdnCountryCode, msisdn) => {
    return Promise.resolve({
      ...mockCustPrimaryDetails,
      nationalIdNumber,
      msisdnCountryCode,
      msisdn,
    } as ICustPrimaryDetails);
  });

const mockGeneralOtpService = createMock<GeneralOtpService>();
jest
  .spyOn(mockGeneralOtpService, 'triggerOtp')
  .mockResolvedValue(mockGeneralOtp);

const dto: ForgotPinOtpTriggerDto = {
  nationalIdNumber: 'nin123',
  dateOfBirth: '1990-12-25',
  msisdnCountryCode: '+256',
  msisdn: '999999999',
  otpAction: OtpAction.FORGOT_PIN,
};
describe('ForgotPinService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(mockCustTelcoRepository, 'findByLeadId').mockResolvedValue(null);
    const module = await Test.createTestingModule({
      providers: [
        ForgotPinService,
        {
          provide: ICustPrimaryDetailsRepository,
          useValue: mockCustPrimaryDetailsRepository,
        },
        {
          provide: ICustIdCardDetailsRepository,
          useValue: mockCustIdCardDetailsRepository,
        },
        { provide: ICustTelcoRepository, useValue: mockCustTelcoRepository },
        { provide: GeneralOtpService, useValue: mockGeneralOtpService },
        { provide: IContentService, useValue: createMock<ContentService>() },
        {
          provide: NotificationServiceClient,
          useValue: createMock<NotificationServiceClient>(),
        },
        {
          provide: PushNotificationService,
          useValue: createMock<PushNotificationService>(),
        },
      ],
    }).compile();
    service = module.get<ForgotPinService>(ForgotPinService);
  });
  describe('Success', () => {
    it('Trigger Forgot Pin Otp should return customer if customer and cust id card found', async () => {
      new ForgotPinOtpTriggerDto();
      const res = await service.forgotPinOrRegisterNewDevice(dto);
      expect(res).not.toBeNull();
    });
    it('Trigger Forgot Pin Otp should return customer if customer found but no cust id card found', async () => {
      new ForgotPinOtpTriggerDto();
      jest
        .spyOn(mockCustIdCardDetailsRepository, 'findByCustId')
        .mockResolvedValueOnce(null);
      const res = await service.forgotPinOrRegisterNewDevice(dto);
      expect(res).not.toBeNull();
    });
    it('Trigger Forgot Pin Otp should return customer if customer found and no valid DOBs (all null)', async () => {
      new ForgotPinOtpTriggerDto();
      jest
        .spyOn(mockCustIdCardDetailsRepository, 'findByCustId')
        .mockResolvedValueOnce({
          ...mockCustIdCardDetails,
          mrzDOB: null,
          parsedOcrDOB: null,
        });
      const res = await service.forgotPinOrRegisterNewDevice(dto);
      expect(res).not.toBeNull();
    });
    it('Trigger Forgot Pin Otp should return customer if customer found and no valid DOBs (DOBs not matching)', async () => {
      new ForgotPinOtpTriggerDto();
      jest
        .spyOn(mockCustTelcoRepository, 'findByLeadId')
        .mockResolvedValueOnce(null);
      jest
        .spyOn(mockCustIdCardDetailsRepository, 'findByCustId')
        .mockResolvedValueOnce({
          ...mockCustIdCardDetails,
          mrzDOB: '1990-12-25' as any as Date,
          parsedOcrDOB: '1980-12-25' as any as Date,
        });
      const res = await service.forgotPinOrRegisterNewDevice(dto);
      expect(res).not.toBeNull();
    });
  });
  describe('Failure', () => {
    it('Trigger Forgot Pin Otp Should return null if no customer found', async () => {
      new ForgotPinOtpTriggerDto();
      jest
        .spyOn(mockCustPrimaryDetailsRepository, 'findByNinMsisdn')
        .mockResolvedValueOnce(null);
      const res = await service.forgotPinOrRegisterNewDevice(dto);
      expect(res).toBeNull();
    });
    it('Trigger Forgot Pin Otp Should return null if DOB mismatch found', async () => {
      new ForgotPinOtpTriggerDto();

      jest
        .spyOn(mockCustIdCardDetailsRepository, 'findByCustId')
        .mockResolvedValueOnce({
          ...mockCustIdCardDetails,
          editedDOB: '1980-12-25' as any as Date, // edited DOB mismatch
        });
      const res = await service.forgotPinOrRegisterNewDevice(dto);
      expect(res).toBeNull();
    });
    it('Trigger Forgot Pin Otp Should return customer if Telco DOB found and matches', async () => {
      new ForgotPinOtpTriggerDto();
      jest
        .spyOn(mockCustTelcoRepository, 'findByLeadId')
        .mockResolvedValueOnce({ ...mockCustTelco, dob: '25/12/1990' });
      const res = await service.forgotPinOrRegisterNewDevice(dto);
      expect(res).not.toBeNull();
    });
    it('Trigger Forgot Pin Otp Should return customer if Telco DOB found and matches even if custIdCard repo returns null', async () => {
      new ForgotPinOtpTriggerDto();
      jest
        .spyOn(mockCustTelcoRepository, 'findByLeadId')
        .mockResolvedValueOnce({ ...mockCustTelco, dob: '25/12/1990' });
      jest
        .spyOn(mockCustIdCardDetailsRepository, 'findByCustId')
        .mockResolvedValueOnce(null);
      const res = await service.forgotPinOrRegisterNewDevice(dto);
      expect(res).not.toBeNull();
    });
    it('Trigger Forgot Pin Otp Should return null if Telco DOB found but does not match', async () => {
      new ForgotPinOtpTriggerDto();
      jest
        .spyOn(mockCustTelcoRepository, 'findByLeadId')
        .mockResolvedValueOnce({ ...mockCustTelco, dob: '25/12/1800' });
      const res = await service.forgotPinOrRegisterNewDevice(dto);
      expect(res).toBeNull();
    });
  });
});
