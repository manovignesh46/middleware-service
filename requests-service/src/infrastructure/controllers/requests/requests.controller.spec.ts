import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { LoanRepaymentMode } from '../../../domain/enum/loan-repayment-mode.enum';
import { LoanRepaymentType } from '../../../domain/enum/loan-repayment-type.enum';
import { IRepayLoanService } from '../../../domain/service/repay-loan.service.interface';
import { IRequestService } from '../../../domain/service/request-service.interface';
import { IpBlacklistingInterceptor } from '../../../interceptors/ip-blacklisting.interceptor';
import { PolicyDocsService } from '../../../usecases/policy-docs.service';
import { MockData } from '../../service/mockData';
import { ApplyLoansDTO } from './dtos/applyLoans.dto';
import { generateMockApplyLoansDTO } from './dtos/applyLoans.dto.spec';
import { RepayLoanDto } from './dtos/repay-loan.dto';
import { SubmitLoansDTO } from './dtos/submitLoans.dto';
import { generateMockSubmitLoansDTO } from './dtos/submitLoans.dto.spec';
import { generateMockReoayLoanPresenter } from './presenters/repay-loan.presenter.spec';
import { StatusMessagePresenter } from './presenters/statusMessage.presenter';
import { RequestsController } from './requests.controller';

describe('RequestController', () => {
  let controller: RequestsController;
  const mockRepayLoanService: DeepMocked<IRepayLoanService> =
    createMock<IRepayLoanService>();
  mockRepayLoanService.repayLoan.mockResolvedValue(
    generateMockReoayLoanPresenter(),
  );

  const generateRepayLoanDto = () => {
    const repayLoanDto = new RepayLoanDto();
    repayLoanDto.currentOutstandingAmount = 100;
    repayLoanDto.loanAccountNumber = 'loanAcNumHere';
    repayLoanDto.offerId = 'offerIdHere';
    repayLoanDto.paymentAmount = 100;
    repayLoanDto.paymentMethod = LoanRepaymentMode.AIRTEL_WALLET;
    repayLoanDto.paymentType = LoanRepaymentType.FULL_PAYMENT;
    repayLoanDto.studentPCOId = 'studentPcoIdHere';
    return repayLoanDto;
  };

  const mockRequestService: DeepMocked<IRequestService> =
    createMock<IRequestService>();

  const mockIpBlacklistingInterceptor = createMock<IpBlacklistingInterceptor>();
  mockIpBlacklistingInterceptor.intercept.mockImplementation(
    (context, next) => {
      return Promise.resolve(next.handle());
    },
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [
        { provide: IRepayLoanService, useValue: mockRepayLoanService },
        { provide: IRequestService, useValue: mockRequestService },
        {
          provide: PolicyDocsService,
          useValue: createMock<PolicyDocsService>(),
        },
      ],
    })
      .overrideInterceptor(IpBlacklistingInterceptor)
      .useValue(mockIpBlacklistingInterceptor)
      .compile();

    controller = module.get<RequestsController>(RequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('repay loan endpoint should call repayLoan and should return StatusMessagePresenter with correct values', async () => {
    const customerId = 'abc123';
    const fullMsisdn = '+256999999999';
    const repayLoanDto = generateRepayLoanDto();
    const repayLoanSpy = jest.spyOn(
      controller['repayLoanService'],
      'repayLoan',
    );

    const response = await controller.repayLoan(
      customerId,
      fullMsisdn,
      repayLoanDto,
    );
    expect(repayLoanSpy).toBeCalledTimes(1);
    expect(repayLoanSpy).toBeCalledWith(customerId, fullMsisdn, repayLoanDto);
    expect(response).toBeInstanceOf(StatusMessagePresenter);

    expect(response.data.requestId).toEqual(
      MockData.mockLMSLoanRepayResponse.data.request_id,
    );
    expect(response.data.transactionId).toEqual(
      MockData.mockLMSLoanRepayResponse.data.transaction_id.toString(),
    );
    expect(response.data.externalTransactionId).toEqual(
      MockData.mockLMSLoanRepayResponse.data.external_transaction_id.toString(),
    );
    expect(response.data.referenceId).toEqual(
      MockData.mockLMSLoanRepayResponse.data.reference_id.toString(),
    );
  });

  it('apply loans return StatusMessagePresenter', async () => {
    const dto: ApplyLoansDTO = generateMockApplyLoansDTO();
    const result = await controller.applyLoans('1234', dto);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });

  it('submit loans return StatusMessagePresenter', async () => {
    const dto: SubmitLoansDTO = generateMockSubmitLoansDTO();
    const result = await controller.submitLoans('1234', dto);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });
  it('downloadStatement return StatusMessagePresenter', async () => {
    const result = await controller.downloadStatement('1234', '1', '1');
    expect(result).toBeInstanceOf(StatusMessagePresenter);
  });
});
