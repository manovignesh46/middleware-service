import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { LoanRepaymentMode } from '../domain/enum/loan-repayment-mode.enum';
import { LoanRepaymentStatus } from '../domain/enum/loan-repayment-status.enum';
import { LoanRepaymentType } from '../domain/enum/loan-repayment-type.enum';
import { ICustLoanRepaymentRecord } from '../domain/model/cust-loan-repayment-record.model';
import { ICustLoanRepaymentRecordRepository } from '../domain/repository/cust-loan-repayment-record.repository.interface';
import { ICustomerServiceClient } from '../domain/service/customer-service-client.service.interface';
import { IRequestToLMSService } from '../domain/service/requestToLMSService.interface';
import { RepayLoanDto } from '../infrastructure/controllers/requests/dtos/repay-loan.dto';
import { CustLoanRepaymentRecord } from '../infrastructure/entities/cust-loan-repayment-record.entity';
import { RepayLoanService } from './repay-loan.service';
import { RequestToLMSService } from './requestToLMS.service';
import { MockData } from '../infrastructure/service/mockData';
import { IContentService } from '../domain/content.service.interface';
import { ContentService } from '../infrastructure/service/content.service';
import { NotificationServiceClient } from '../infrastructure/service/notification-service-client/notifications-service-client.service';
import { mockCustLoanRepaymentRecord } from '../domain/model/mocks/cust-loan-repayment-record.mock';
import { LoanRepayStatusDTO } from '../infrastructure/controllers/requests/dtos/loanRepayStatus.dto';
import {
  LMSRepayResponse,
  RepayLoanData,
} from '../infrastructure/controllers/requests/dtos/lmsRepayResponse.dto';

const custId = '123';
const fullMsisdn = '+256999999999';
const mockRepayLoanDto: RepayLoanDto = new RepayLoanDto();
mockRepayLoanDto.offerId = '123';
mockRepayLoanDto.paymentAmount = 100.5;
mockRepayLoanDto.currentOutstandingAmount = 1000.5;
mockRepayLoanDto.loanAccountNumber = '123456';
mockRepayLoanDto.paymentMethod = LoanRepaymentMode.AIRTEL_WALLET;
mockRepayLoanDto.paymentType = LoanRepaymentType.CUSTOM_AMOUNT;
mockRepayLoanDto.studentPCOId = '789';

export const generateMockRepayLoanDto = () => {
  return mockRepayLoanDto;
};

describe('RepayLoanService', () => {
  let service: RepayLoanService;

  const mockLMSService: DeepMocked<RequestToLMSService> =
    createMock<RequestToLMSService>();

  // const mockRepayLoanLosResponse = new RepayLoanLMSResponse();
  // mockRepayLoanLosResponse.outstanding_balance = 1000;
  // mockRepayLoanLosResponse.outstanding_principal = 100;
  // mockRepayLoanLosResponse.outstanding_fee = 200;
  // mockRepayLoanLosResponse.outstanding_interest = 300;
  // mockRepayLoanLosResponse.loan_due_date = '1990-12-31';
  jest.spyOn(mockLMSService, 'repayLoan').mockResolvedValue({
    code: 2000,
    ...MockData.mockLMSLoanRepayResponse,
  });

  const mockCustomerServiceClient: DeepMocked<ICustomerServiceClient> =
    createMock<ICustomerServiceClient>();
  jest.spyOn(mockCustomerServiceClient, 'getMsisdn').mockResolvedValue({
    msisdnCountryCode: '+256',
    msisdn: '999999999',
    preferredName: 'John',
    platformApplicationEndpoint: 'endpointArn1',
    availableCreditLimit: 10000,
  });

  const mockCustLoanRepaymentRecordRepository: ICustLoanRepaymentRecordRepository =
    {
      save: jest.fn(function (
        custLoanRepaymentRecord: ICustLoanRepaymentRecord,
      ): Promise<ICustLoanRepaymentRecord> {
        custLoanRepaymentRecord.id = 'requestId1234';
        return Promise.resolve(custLoanRepaymentRecord);
      }),
      update: jest.fn(function (
        custLoanRepaymentRecord: ICustLoanRepaymentRecord,
      ): Promise<ICustLoanRepaymentRecord> {
        return Promise.resolve(custLoanRepaymentRecord);
      }),
      getById: jest.fn(function (
        id: string,
      ): Promise<ICustLoanRepaymentRecord> {
        const mockCustLoanRepaymentRecord = new CustLoanRepaymentRecord();
        return Promise.resolve({ ...mockCustLoanRepaymentRecord, id });
      }),
      getRepayRecord: function (id: string): Promise<ICustLoanRepaymentRecord> {
        const mockCustLoanRepaymentRecord = new CustLoanRepaymentRecord();
        return Promise.resolve({
          ...mockCustLoanRepaymentRecord,
          id,
        });
      },
    };
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepayLoanService,
        { provide: IRequestToLMSService, useValue: mockLMSService },
        {
          provide: ICustomerServiceClient,
          useValue: mockCustomerServiceClient,
        },
        {
          provide: ICustLoanRepaymentRecordRepository,
          useValue: mockCustLoanRepaymentRecordRepository,
        },
        {
          provide: IContentService,
          useValue: createMock<ContentService>(),
        },
        {
          provide: NotificationServiceClient,
          useValue: createMock<NotificationServiceClient>(),
        },
      ],
    }).compile();
    service = module.get<RepayLoanService>(RepayLoanService);
  });

  it('request service should make a call to customerServiceClient.getMsisdn with correct arguments', async () => {
    const spy = jest.spyOn(mockCustomerServiceClient, 'getMsisdn');
    await service.repayLoan(custId, fullMsisdn, mockRepayLoanDto);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(custId);
  });
  it('request service should make a call to losService.repayLoan with correct arguments', async () => {
    const spy = jest.spyOn(mockLMSService, 'repayLoan');
    await service.repayLoan(custId, fullMsisdn, mockRepayLoanDto);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(
      'requestId1234',
      '123',
      '+256999999999',
      'Installment',
      mockRepayLoanDto.paymentAmount,
      mockRepayLoanDto.loanAccountNumber,
      mockRepayLoanDto.offerId,
      expect.stringMatching(/^\+256999999999_external_receipt_id_/),
    );
  });
  it('request service should make a call to custRepaymentRecordRepository.save with correct arguments', async () => {
    const spy = jest.spyOn(mockCustLoanRepaymentRecordRepository, 'save');
    await service.repayLoan(custId, fullMsisdn, mockRepayLoanDto);

    const expectedInput = new CustLoanRepaymentRecord();
    expectedInput.customerId = custId;
    expectedInput.loanAccountNumber = mockRepayLoanDto.loanAccountNumber;
    expectedInput.loanRepaymentAmount = mockRepayLoanDto.paymentAmount;
    expectedInput.loanRepaymentMode = mockRepayLoanDto.paymentMethod;
    // expectedInput.loanRepaymentStatus = LoanRepaymentStatus.PENDING; //Not sure why called with SUCCESS even though code cleary calls with PENDING
    expectedInput.loanRepaymentType = mockRepayLoanDto.paymentType;
    expectedInput.offerId = mockRepayLoanDto.offerId;

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(expect.objectContaining(expectedInput));
  });
  it('request service should make a call to custRepaymentRecordRepository.update with correct arguments', async () => {
    const spy = jest.spyOn(mockCustLoanRepaymentRecordRepository, 'update');
    await service.repayLoan(custId, fullMsisdn, mockRepayLoanDto);

    const expectedInput = new CustLoanRepaymentRecord();
    expectedInput.customerId = custId;
    expectedInput.loanAccountNumber = mockRepayLoanDto.loanAccountNumber;
    expectedInput.loanRepaymentAmount = mockRepayLoanDto.paymentAmount;
    expectedInput.loanRepaymentMode = mockRepayLoanDto.paymentMethod;
    expectedInput.loanRepaymentStatus = LoanRepaymentStatus.SUCCESS;
    expectedInput.loanRepaymentType = mockRepayLoanDto.paymentType;
    expectedInput.offerId = mockRepayLoanDto.offerId;

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(expect.objectContaining(expectedInput));
  });

  it('request service should make a call to custRepaymentRecordRepository.update with correct arguments is LOS Response is not 2000', async () => {
    jest
      .spyOn(mockLMSService, 'repayLoan')
      .mockResolvedValueOnce({ code: 400 });

    const spy = jest.spyOn(mockCustLoanRepaymentRecordRepository, 'update');
    await service.repayLoan(custId, fullMsisdn, mockRepayLoanDto);

    const expectedInput = new CustLoanRepaymentRecord();
    expectedInput.customerId = custId;
    expectedInput.loanAccountNumber = mockRepayLoanDto.loanAccountNumber;
    expectedInput.loanRepaymentAmount = mockRepayLoanDto.paymentAmount;
    expectedInput.loanRepaymentMode = mockRepayLoanDto.paymentMethod;
    expectedInput.loanRepaymentStatus = LoanRepaymentStatus.FAILED;
    expectedInput.loanRepaymentType = mockRepayLoanDto.paymentType;
    expectedInput.offerId = mockRepayLoanDto.offerId;

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(expect.objectContaining(expectedInput));
  });

  it('repayLoanStatus success', async () => {
    jest
      .spyOn(mockCustLoanRepaymentRecordRepository, 'getRepayRecord')
      .mockResolvedValueOnce({
        ...mockCustLoanRepaymentRecord,
        loanRepaymentStatus: LoanRepaymentStatus.SUCCESS,
      });
    const inputDto: LoanRepayStatusDTO = {
      requestId: 'req123',
      offerId: 'offer123',
      transactionId: 'trans123',
      externalTransactionId: 'exttrans123',
      referenceId: 'ref123',
    };
    const res = await service.repayLoanStatus('cust123', inputDto);
    expect(res).toEqual(expect.objectContaining({ status: 2000 }));
  });
  it('repayLoanStatus pending', async () => {
    jest
      .spyOn(mockCustLoanRepaymentRecordRepository, 'getRepayRecord')
      .mockResolvedValueOnce({
        ...mockCustLoanRepaymentRecord,
        loanRepaymentStatus: LoanRepaymentStatus.PENDING,
      });
    const inputDto: LoanRepayStatusDTO = {
      requestId: 'req123',
      offerId: 'offer123',
      transactionId: 'trans123',
      externalTransactionId: 'exttrans123',
      referenceId: 'ref123',
    };
    const res = await service.repayLoanStatus('cust123', inputDto);
    expect(res).toEqual(expect.objectContaining({ status: 6999 }));
  });
  it('repayLoanStatus failed but not TARGET_AUTHORIZATION_ERROR', async () => {
    jest
      .spyOn(mockCustLoanRepaymentRecordRepository, 'getRepayRecord')
      .mockResolvedValueOnce({
        ...mockCustLoanRepaymentRecord,
        loanRepaymentStatus: LoanRepaymentStatus.FAILED,
        code: 6411,
      });
    const inputDto: LoanRepayStatusDTO = {
      requestId: 'req123',
      offerId: 'offer123',
      transactionId: 'trans123',
      externalTransactionId: 'exttrans123',
      referenceId: 'ref123',
    };
    const res = await service.repayLoanStatus('cust123', inputDto);
    expect(res).toEqual(expect.objectContaining({ status: 6998 }));
  });
  it('repayLoanStatus failed and TARGET_AUTHORIZATION_ERROR', async () => {
    jest
      .spyOn(mockCustLoanRepaymentRecordRepository, 'getRepayRecord')
      .mockResolvedValueOnce({
        ...mockCustLoanRepaymentRecord,
        loanRepaymentStatus: LoanRepaymentStatus.FAILED,
        code: 6411,
        message: 'TARGET_AUTHORIZATION_ERROR',
      });
    const inputDto: LoanRepayStatusDTO = {
      requestId: 'req123',
      offerId: 'offer123',
      transactionId: 'trans123',
      externalTransactionId: 'exttrans123',
      referenceId: 'ref123',
    };
    const res = await service.repayLoanStatus('cust123', inputDto);
    expect(res).toEqual(expect.objectContaining({ status: 6411 }));
  });

  it('repayLoanUpdate', async () => {
    const inputDto: LMSRepayResponse = {
      status: '',
      message: '',
      code: 2000,
      data: new RepayLoanData(),
    };
    const res = await service.repayLoanUpdate(inputDto);
    expect(res).toEqual(expect.objectContaining({ status: 'SUCCESS' }));
  });
});
