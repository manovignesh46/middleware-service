import { Test, TestingModule } from '@nestjs/testing';
import { ILMSService } from '../domain/service/lmsService.interface';
import { IRequestToLMSService } from '../domain/service/requestToLMSService.interface';
import { LMSLoanCalculatorDTO } from '../infrastructure/controllers/requests/dtos/LMSLoanCalculator.dto';
import { LOSRepayLoanDto } from '../infrastructure/controllers/requests/dtos/repay-loan.dto';
import { generateMockLoansStatementPresenter } from '../infrastructure/controllers/requests/presenters/loanStatement.presenter.spec';
import { MockData } from '../infrastructure/service/mockData';
import { RequestToLMSService } from './requestToLMS.service';
import { generateMockLoanCalculatorDTO } from '../infrastructure/controllers/requests/dtos/loanCalculator.dto.spec';
import { IRequestToLOSRepository } from '../domain/repository/request-to-los.repository.interface';
import { mockRequestToLOSRepository } from '../infrastructure/repository/mocks/request-to-los.repository.mock';
import { LMSFormData } from '../infrastructure/controllers/requests/dtos/lmsFormData.dto';

describe('RequestToLMSService', () => {
  let service: IRequestToLMSService;

  const mockLMSService: ILMSService = {
    dashboard: function (productType: string, msisdn: string): Promise<any> {
      return Promise.resolve(MockData.mockLMSRespomse.data);
    },
    repayLoan: function (repayLoanDto: LOSRepayLoanDto): Promise<any> {
      return Promise.resolve(MockData.mockRepayLoanResponse);
    },
    loanCalculator: function (
      losLoanCalculatorDTO: LMSLoanCalculatorDTO,
    ): Promise<any> {
      return Promise.resolve(MockData.loanCalculatorResp);
    },
    loanDetailStatement: function (
      msisdn: string,
      loanId: string,
    ): Promise<any> {
      return Promise.resolve(MockData.mockLoanDetailsStatment);
    },
    applicationFormData: function (
      loanId: string,
      payload: any,
    ): Promise<LMSFormData> {
      throw new Error('Function not implemented.');
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: IRequestToLMSService, useClass: RequestToLMSService },
        { provide: ILMSService, useValue: mockLMSService },
        {
          provide: IRequestToLOSRepository,
          useValue: mockRequestToLOSRepository,
        },
      ],
    }).compile();
    service = module.get<IRequestToLMSService>(IRequestToLMSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('RequestService for optId 1 getloanStatementDetails', async () => {
    const result = await service.getloanStatement(
      '1',
      '7991141715',
      'custId123',
    );
    expect(result).toEqual(generateMockLoansStatementPresenter('1'));
  });

  it('RequestService for optId 2 getloanStatementDetails', async () => {
    const result = await service.getloanStatement(
      '2',
      '7991141715',
      'custId123',
    );
    expect(result).toEqual(generateMockLoansStatementPresenter('2'));
  });
  it('Request Service to forward response from LMS', async () => {
    const result = await service.repayLoan(
      'requestID1234',
      'customerId123',
      '123',
      'productType',
      10,
      'instrumentId',
      'variantId',
      'recieptId',
    );
    expect(result).toEqual(MockData.mockRepayLoanResponse);
  });

  it('Request Service to LMS loanCalculator', async () => {
    const result = await service.loanCalculator(
      '7834234324',
      generateMockLoanCalculatorDTO(),
    );
    expect(result).toEqual(MockData.loanCalculatorResp);
  });
});
