import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { ILMSService } from '../../domain/service/lmsService.interface';
import { LOSRepayLoanDto } from '../controllers/requests/dtos/repay-loan.dto';
import { LMSService } from './lms.service';
import { MockData } from './mockData';

describe('LMSService', () => {
  let service: ILMSService;

  const mockHttpService = {
    get: jest
      .fn()
      .mockImplementation(() => of({ data: MockData.mockLMSRespomse })),
    post: jest
      .fn()
      .mockImplementation(() =>
        of({ data: MockData.mockRepayLoanResponse, status: 200 }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ILMSService, useClass: LMSService },
        { provide: HttpService, useValue: mockHttpService },
        ConfigService,
      ],
    }).compile();

    service = module.get<ILMSService>(ILMSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('LOS interactionTarget', async () => {
    jest
      .spyOn(mockHttpService, 'post')
      .mockImplementationOnce(() => of({ data: MockData.mockLMSRespomse }));
    const result = await service.dashboard('installment', '87687684');
    expect(result).toEqual(MockData.mockLMSRespomse.data);
  });

  it('LMS Mock RepayLoan Response', async () => {
    const mockRepayLoanDto = new LOSRepayLoanDto();
    const result = await service.repayLoan(mockRepayLoanDto);
    expect(result).toEqual(MockData.mockRepayLoanResponse);
  });
});
