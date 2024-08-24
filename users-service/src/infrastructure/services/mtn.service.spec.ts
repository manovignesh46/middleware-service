import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { ICustOtpRepository } from '../../domain/repository/custOtpRepository.interface';
import { IMtnService } from '../../domain/services/mtn.service.interface';
import { CustOtpRepository } from '../repository/custOtp.repository';
import { MtnService } from './mtn.service';
import { SoapService } from './soap-client.service';

describe('MtnService', () => {
  let service: IMtnService;

  const mockSoapService: DeepMocked<SoapService> = createMock<SoapService>();
  const mockCustOtpRepo = createMock<CustOtpRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: IMtnService, useClass: MtnService },
        { provide: ICustOtpRepository, useValue: mockCustOtpRepo },
        { provide: SoapService, useValue: mockSoapService },
      ],
    }).compile();

    service = module.get<IMtnService>(IMtnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call appropriate methods and return proper response', async () => {
    const repoSpy = jest.spyOn(mockCustOtpRepo, 'update');
    jest.spyOn(mockSoapService, 'mtnOptIn').mockResolvedValueOnce({
      approvalid: 'appr123',
      externalRequestId: 'ext123',
    });
    const res = await service.optIn('+256', '777777777');
    expect(repoSpy).toBeCalledTimes(1);
    expect(res).toEqual({
      approvalid: 'appr123',
      externalRequestId: 'ext123',
    });
  });
  it('should call throw errors from soapService', async () => {
    const thrownErr = new Error({ errorCode: 'ACCOUNT_NOT_FOUND' }?.toString());
    jest.spyOn(mockSoapService, 'mtnOptIn').mockRejectedValueOnce(thrownErr);
    const res = service.optIn('+256', '777777777');
    await expect(res).rejects.toThrow(thrownErr);
  });
});
