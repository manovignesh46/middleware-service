jest.mock('fs'); //hoisted to top for mocking fs.unlinkSync
jest.mock('puppeteer');
import { Test, TestingModule } from '@nestjs/testing';
import { IRequestService } from '../domain/service/request-service.interface';
import { RequestService } from './request.service';
import { ICustLoansAppliedRepository } from '../domain/repository/cust-loans-applied-respository.interface';
import { ICustLoansApplied } from '../domain/model/cust-loans-applied.interface';
import { ICustomerServiceClient } from '../domain/service/customer-service-client.service.interface';
import { CustomerIdCardDetailsDTO } from '../infrastructure/controllers/requests/dtos/customerIdCardDetails.dto';
import { OfferDetailsDTO } from '../infrastructure/controllers/requests/dtos/offerDetails.dto';
import { SelfieLivenessDTO } from '../infrastructure/controllers/requests/dtos/selfieLiveness.dto';
import { StudentDetailsDTO } from '../infrastructure/controllers/requests/dtos/studentDetails.dto';
import { generateMockCustomerIdCardDetails } from '../infrastructure/controllers/requests/dtos/CustomerIdCardDetails.dto.spec';
import { generateMockSelfieLivenessDTO } from '../infrastructure/controllers/requests/dtos/selfieLiveness.dto.spec';
import { generateMockOfferDetailsDTO } from '../infrastructure/controllers/requests/dtos/offerDetails.dto.spec';
import { generateMockStudentDetailsDTO } from '../infrastructure/controllers/requests/dtos/studentDetails.dto.spec';
import { IRequestToLOSService } from '../domain/service/requestToLOSService.interface';
import { ApplyLoansPresenter } from '../infrastructure/controllers/requests/presenters/apply-loans.presenter';
import { generateMockApplyLoansDTO } from '../infrastructure/controllers/requests/dtos/applyLoans.dto.spec';
import { ApplyLoansDTO } from '../infrastructure/controllers/requests/dtos/applyLoans.dto';
import { generateMockApplyLoansPresenter } from '../infrastructure/controllers/requests/presenters/apply-loans.presenter.spec';
import { SubmitLoansDTO } from '../infrastructure/controllers/requests/dtos/submitLoans.dto';
import { generateMockSubmitLoansDTO } from '../infrastructure/controllers/requests/dtos/submitLoans.dto.spec';
import { generateMockSubmitLoansPresenter } from '../infrastructure/controllers/requests/presenters/submit-loans.presenter.spec';
import { IRequestToLMSService } from '../domain/service/requestToLMSService.interface';
import { LoanStatementPresenter } from '../infrastructure/controllers/requests/presenters/loanStatement.presenter';
import { generateMockLoansStatementPresenter } from '../infrastructure/controllers/requests/presenters/loanStatement.presenter.spec';
import { createMock } from '@golevelup/ts-jest';
import { NotificationServiceClient } from '../infrastructure/service/notification-service-client/notifications-service-client.service';
import { LoanCalculatorDTO } from '../infrastructure/controllers/requests/dtos/loanCalculator.dto';
import { LMSLoanCalculatorRespDTO } from '../infrastructure/controllers/requests/dtos/LMSLoanCalculatorResp.dto';
import { IContentService } from '../domain/content.service.interface';
import { ContentService } from '../infrastructure/service/content.service';
import { LoanDetailsStatementPresenter } from '../infrastructure/controllers/requests/presenters/loanDetailStatement.presenter';
import { generateMockLoanDetailsStatmentPresenter } from '../infrastructure/controllers/requests/presenters/loanDetailStatement.presenter.spec';
import { generateMockLMSLoanCalculatorRespDTO } from '../infrastructure/controllers/requests/dtos/LMSLoanCalculatorResp.dto.spec';
import { IFAQRepository } from '../domain/repository/faqRepository.interface';
import { FAQ } from '../infrastructure/entities/faq.entity';
import { MockData } from '../infrastructure/service/mockData';
import { generateMockFAQPresenter } from '../infrastructure/controllers/requests/presenters/faq.presenter.spec';
import { generateMockLoanCalculatorDTO } from '../infrastructure/controllers/requests/dtos/loanCalculator.dto.spec';
import { generateMockLoanCalculatorPresneter } from '../infrastructure/controllers/requests/presenters/loanCalculator.presenter.spec';
import { ConfigService } from '@nestjs/config';
import { IRequestOperationRepository } from '../domain/repository/requestOperationsRepository.interface';
import { IRequestOperation } from '../domain/model/requestOperation.interface';
import { IS3ClientService } from '../domain/service/s3-client-service.interface';
import { S3ClientService } from '../infrastructure/service/s3-client.service';
import { LMSFormData } from '../infrastructure/controllers/requests/dtos/lmsFormData.dto';
import { DownloadPresenter } from '../infrastructure/controllers/requests/presenters/download.presenter';
import { IFormDataRepository } from '../domain/repository/form-data.repository.interface';
import { mockFormDataRepository } from '../infrastructure/repository/mocks/form-data.repostitory.mock';
import { mockFormData } from '../domain/model/mocks/form-data.mock';
import { FormType } from '../domain/enum/form-type.enum';
import { IPDFRenderService } from '../domain/service/IPDFRender.service';

describe('RequestService', () => {
  let service: IRequestService;

  const formCreateSpy = jest.spyOn(mockFormDataRepository, 'create');
  const formUpdateSpy = jest
    .spyOn(mockFormDataRepository, 'update')
    .mockImplementation((form) => {
      return Promise.resolve(form);
    });

  const mockCustLoansApplied: ICustLoansApplied = {
    applicationId: 'ce1c7e9f-88bd-40b6-b160-c1096211b7fc',
    custId: '2f1eb760-6755-4a05-bd80-a597078d438c',
    offerId: '1685361055160',
    PCOId: '647626593c80aa0684242856',
    losLoansBoundaries: '{"minLoanAmount":72000,"maxLoanAmount":90000}',
    loanTotalAmount: null,
    loanTenureInstallments: null,
    loanFees: null,
    loanStatus: 'Loan Applied',
    loanInterestAmount: null,
    loanTotalAmountPayable: null,
    loanRepayFrequecy: null,
    loanRepayAmount: null,
    loanPreferedPaymentOn: null,
    loanLastPaymentDate: null,
    createdAt: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
    updatedAt: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
    isTerminated: false,
  };

  const mockCustLoansAppliedRepository: ICustLoansAppliedRepository = {
    findByPCOId: function (
      PCOId: string,
      custId: string,
    ): Promise<ICustLoansApplied> {
      return Promise.resolve(mockCustLoansApplied);
    },
    save: function (
      custLoansApplied: ICustLoansApplied,
    ): Promise<ICustLoansApplied> {
      return Promise.resolve(mockCustLoansApplied);
    },
    findByCustId: function (custId: string): Promise<ICustLoansApplied[]> {
      throw new Error('Function not implemented.');
    },
  };

  const mockCustomerServiceClient: ICustomerServiceClient = {
    getMsisdn: function (customerId: string) {
      return Promise.resolve({
        msisdnCountryCode: '+256',
        msisdn: '12345678',
        preferredName: 'John',
        platformApplicationEndpoint: 'endpointArn1',
        availableCreditLimit: 10000,
      });
    },
    getTargetApiUUID: function (customerId: string): Promise<string> {
      return Promise.resolve('1234');
    },
    getIdCardDetails: function (
      customerId: string,
    ): Promise<CustomerIdCardDetailsDTO> {
      return Promise.resolve(generateMockCustomerIdCardDetails());
    },
    getCustomerSelfieLiveness: function (
      customerId: string,
    ): Promise<SelfieLivenessDTO> {
      return Promise.resolve(generateMockSelfieLivenessDTO());
    },
    getOfferDetails: function (offerId: string): Promise<OfferDetailsDTO> {
      return Promise.resolve(generateMockOfferDetailsDTO());
    },
    getStudentDetails: function (
      studentPCOId: string,
    ): Promise<StudentDetailsDTO> {
      return Promise.resolve(generateMockStudentDetailsDTO());
    },
    terminateOngoingLoan: function (custId: string): Promise<boolean> {
      throw new Error('Function not implemented.');
    },
  };

  const mockRequestToLOSService: IRequestToLOSService = {
    getLoanBoundaries: function (
      targetUUID: string,
    ): Promise<ApplyLoansPresenter> {
      return Promise.resolve(generateMockApplyLoansPresenter());
    },
    applyLoans: function (
      targetUUID: string,
      idCardDetailsDTO: CustomerIdCardDetailsDTO,
      selfieLivenessDTO: SelfieLivenessDTO,
    ): Promise<boolean> {
      return Promise.resolve(true);
    },
    submitLoans: function (
      targetUUID: string,
      loanAmount: number,
      stundetPCOId: string,
      offerId: string,
      tenor: number,
      repaymentFreq: string,
      customerId: string,
    ): Promise<boolean> {
      return Promise.resolve(true);
    },
  };

  const mockRequestToLMSService: IRequestToLMSService = {
    getloanStatement: function (
      optId: string,
      msisdn: string,
      custId: string,
    ): Promise<LoanStatementPresenter> {
      return Promise.resolve(generateMockLoansStatementPresenter('1'));
    },
    repayLoan: function (
      requestId: string,
      customerId: string,
      fullMsisdn: string,
      productType: string,
      amount: number,
      instrumentId: string,
      variantId: string,
      externalReceiptId?: string,
    ): Promise<any> {
      throw new Error('Function not implemented.');
    },
    loanCalculator: function (
      msisdn: string,
      loanCalculatorDTO: LoanCalculatorDTO,
    ): Promise<LMSLoanCalculatorRespDTO> {
      return Promise.resolve(generateMockLMSLoanCalculatorRespDTO());
    },
    loanStatementDetails: function (
      fullMsisdn: string,
      typeId: string,
      loanId: string,
      custId: string,
    ): Promise<LoanDetailsStatementPresenter> {
      return Promise.resolve(generateMockLoanDetailsStatmentPresenter());
    },
    applicationFormData: function (
      loanId: string,
      fullMsisdn: string,
    ): Promise<LMSFormData> {
      return Promise.resolve(JSON.parse(mockFormData.formData));
    },
  };

  const mockNotificationServiceClient = createMock<NotificationServiceClient>();

  const mockS3ClientService = createMock<S3ClientService>();

  const mockPDFRender = {
    createLoanStatement: jest.fn(() => Promise.resolve('loanStatment')),
    createLoanApplicationForm: jest.fn(() =>
      Promise.resolve('loanApplicationForm'),
    ),
  };

  const mockFAQRepository: IFAQRepository = {
    getAllFAQs: function (): Promise<FAQ[]> {
      return Promise.resolve(MockData.mockFAQEntityData);
    },
  };

  const mockRequestOperationRepo: IRequestOperationRepository = {
    save: function (
      requestOperation: IRequestOperation,
    ): Promise<IRequestOperation> {
      return Promise.resolve(MockData.mockRequestOperationEntity);
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: IRequestService, useClass: RequestService },
        { provide: IContentService, useValue: createMock<ContentService>() },
        {
          provide: ICustLoansAppliedRepository,
          useValue: mockCustLoansAppliedRepository,
        },
        {
          provide: ICustomerServiceClient,
          useValue: mockCustomerServiceClient,
        },
        { provide: IRequestToLOSService, useValue: mockRequestToLOSService },
        { provide: IRequestToLMSService, useValue: mockRequestToLMSService },
        {
          provide: NotificationServiceClient,
          useValue: mockNotificationServiceClient,
        },
        { provide: IFAQRepository, useValue: mockFAQRepository },
        {
          provide: IRequestOperationRepository,
          useValue: mockRequestOperationRepo,
        },
        { provide: IS3ClientService, useValue: mockS3ClientService },
        ConfigService,
        { provide: IPDFRenderService, useValue: mockPDFRender },
        { provide: IFormDataRepository, useValue: mockFormDataRepository },
      ],
    }).compile();
    jest
      .spyOn(mockNotificationServiceClient, 'sendNotification')
      .mockImplementation(() => null);

    service = module.get<IRequestService>(IRequestService);

    mockPDFRender.createLoanApplicationForm.mockResolvedValue(
      './path/to/file.pdf',
    );

    mockS3ClientService.pushObjecttoS3.mockResolvedValue(true);
    mockS3ClientService.getObjectPresignedUrl.mockResolvedValue(
      'your-presigned-url',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('RequestService applyLoans', async () => {
    const dto: ApplyLoansDTO = generateMockApplyLoansDTO();
    const result = await service.applyLoans('1234', dto);
    expect(result).toEqual(generateMockApplyLoansPresenter());
  });

  it('RequestService submitLoans', async () => {
    const dto: SubmitLoansDTO = generateMockSubmitLoansDTO();
    const result = await service.submitLoans('1234', dto);
    expect(result).toEqual(generateMockSubmitLoansPresenter());
  });

  it('RequestService loanStatements', async () => {
    const result = await service.loanStatements('12345678', '1');
    expect(result).toEqual(generateMockLoansStatementPresenter('1'));
  });

  it('RequestService loanDetailsStatement', async () => {
    const result = await service.loanDetailsStatement('12345678', '1', '200');
    expect(result).toEqual(generateMockLoanDetailsStatmentPresenter());
  });

  it('RequestService downloadLoanStatements', async () => {
    const expectedResult = new DownloadPresenter();
    expectedResult.loanId = '200';
    expectedResult.statementLink = 'presignedUrl';
    mockS3ClientService.getObjectPresignedUrl.mockResolvedValueOnce(
      expectedResult.statementLink,
    );

    mockPDFRender.createLoanStatement.mockResolvedValueOnce('path/to/pdf.pdf');
    const result = await service.downloadLoanStatements(
      '12345678',
      '1',
      expectedResult.loanId,
    );
    expect(result).toEqual(expectedResult);
  });

  it('RequestService getAllFAQs', async () => {
    const result = await service.getAllFAQs();
    expect(result).toEqual(generateMockFAQPresenter());
  });

  it('RequestService loanCalculator', async () => {
    const result = await service.loanCalculator(
      '1234',
      generateMockLoanCalculatorDTO(),
    );
    expect(result).toEqual(generateMockLoanCalculatorPresneter());
  });
  it('RequestService downloadLoanApplication should create db entry if not exists', async () => {
    const customerId = 'customer123';
    const typeId = '1'; //ACTIVE LOAN
    const loanId = '123';
    const formCreateSpy = jest.spyOn(mockFormDataRepository, 'create');
    jest
      .spyOn(mockFormDataRepository, 'getByCustIdLoanIdAndTypeId')
      .mockClear()
      .mockResolvedValueOnce(null);
    const res = await service.downloadLoanApplication(
      customerId,
      typeId,
      loanId,
    );

    expect(formCreateSpy).toBeCalledTimes(1);
    expect(formCreateSpy).toBeCalledWith(
      expect.objectContaining({
        customerId,
        typeId: 'ACTIVE',
        loanId,
        s3DocPath: `${customerId}/file.pdf`,
        formData: JSON.stringify(JSON.parse(mockFormData.formData)),
        formType: FormType.LOAN_APPLICATION_FORM,
        requestCount: 1,
      }),
    );

    expect(res).toEqual({
      loanId: '123',
      statementLink: 'your-presigned-url',
    } as DownloadPresenter);
  });
  it('RequestService downloadLoanApplication should not create db entry if it does exist', async () => {
    const customerId = 'customer123';
    const typeId = '1'; //ACTIVE LOAN
    const loanId = '123';
    await service.downloadLoanApplication(customerId, typeId, loanId);
    expect(formCreateSpy).toBeCalledTimes(0);
  });
  it('RequestService downloadLoanApplication should generate s3URl if last link was created 6 days ago', async () => {
    const customerId = 'customer123';
    const typeId = '1'; //ACTIVE LOAN
    const loanId = '123';
    const presignedUrlSpy = jest
      .spyOn(mockS3ClientService, 'getObjectPresignedUrl')
      .mockResolvedValueOnce('new-url');
    jest
      .spyOn(mockFormDataRepository, 'getByCustIdLoanIdAndTypeId')
      .mockResolvedValueOnce({
        ...mockFormData,
        s3PresignedUrl: 'old-url',
        s3UrlUpdatedAt: new Date(Date.now() - 1000 * 3600 * 24 * 6 - 1), //6 days ago
      });
    await service.downloadLoanApplication(customerId, typeId, loanId);

    expect(presignedUrlSpy).toBeCalledTimes(1);
    expect(formUpdateSpy).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ s3PresignedUrl: 'new-url' }),
    );
  });
  it('RequestService downloadLoanApplication should still generate s3 url if not expired (1 day ago)', async () => {
    const customerId = 'customer123';
    const typeId = '1'; //ACTIVE LOAN
    const loanId = '123';
    const presignedUrlSpy = jest
      .spyOn(mockS3ClientService, 'getObjectPresignedUrl')
      .mockResolvedValueOnce('new-url');
    jest
      .spyOn(mockFormDataRepository, 'getByCustIdLoanIdAndTypeId')
      .mockResolvedValueOnce({
        ...mockFormData,
        s3PresignedUrl: 'old-url',
        s3UrlUpdatedAt: new Date(Date.now() - 1000 * 3600 * 24 * 1), // 1 day ago
      });
    await service.downloadLoanApplication(customerId, typeId, loanId);

    expect(presignedUrlSpy).toBeCalledTimes(1);
    expect(formUpdateSpy).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ s3PresignedUrl: 'new-url' }),
    );
  });
});
