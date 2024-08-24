import { Test, TestingModule } from '@nestjs/testing';
import { ICustIdCardDetailsRepository } from '../domain/repository/custIdCardDetailsRepository.interface';
import { ICustIdCardDetailsService } from '../domain/services/custIdCardDetailsService.interface';
import { CustIdCardDetailsService } from './custIdCardDetails.service';
import { generateMockIdCardScanDto } from '../infrastructure/controllers/customers/dtos/idCardScan.dto.spec';
import { ICustScanCardSelfieCheckDetailsRepository } from '../domain/repository/custScanCardSelfieCheckDetailsRepository.interface';
import { ICustScanCardSelfieCheckDetails } from '../domain/model/custScanCardSelfieCheckDetails.interface';
import { ConfigService } from '@nestjs/config';
import { CustScanCardSelfieCheckDetails } from '../infrastructure/entities/custScanCardSelfieCheckDetails.entity';
import { SelfieMatchStatus } from '../domain/enum/selfieMatchStatus.enum';
import { generateselfieCheckDTO } from '../infrastructure/controllers/customers/dtos/selfieCheck.dto.spec';
import { S3ManagerService } from '../infrastructure/services/s3-manager.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CustIdCardDetailsServiceDto } from '../infrastructure/controllers/customers/dtos/cust-id-card-details-service.dto';
import { EditIdCardScanDTO } from '../infrastructure/controllers/customers/dtos/idCardScan.dto';
import { dateStringToDateObject } from './helpers';
import { ICustIdCardDetails } from '../domain/model/custIdCardDetails.interface';
import { mockCustIdCardDetails } from '../domain/model/mocks/cust-id-card-details.mock';
import { generateMockRetryUploadDTO } from '../infrastructure/controllers/customers/dtos/retryUpload.dto.spec';
import { generateMockRetryUploadPresenter } from '../infrastructure/controllers/customers/presenters/retryUpload.presenter.spec';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { ICustTelcoRepository } from '../domain/repository/custTelcoRepository.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { mockCustPrimaryDetails } from '../domain/model/mocks/cust-primary-details.mock';
import { mockCustTelco } from '../domain/model/mocks/cust-telco.mock';
import { mockGetAddressResponseDto } from '../infrastructure/controllers/customers/dtos/get-address-response.dto';
import { EntityNotFoundError } from 'typeorm';
import { CustIdCardDetails } from '../infrastructure/entities/custIdCardDetails.entity';
import { ICustToLOSService } from '../domain/services/custToLOSService.interface';

describe('custIdCardDetailsService', () => {
  let service: ICustIdCardDetailsService;

  const mockCustScanCardSelfieCheckDetails: CustScanCardSelfieCheckDetails = {
    createdAt: new Date(Date.parse('2023-05-06T10:31:11.111Z')),
    updatedAt: new Date(Date.parse('2023-05-06T10:44:33.317Z')),
    id: '24168109-6ed3-4eb5-9d60-8ef6944c7050',
    custId: '1234',
    faceMatchScore: 90,
    livenessScore: 90,
    faceMatchStatus: SelfieMatchStatus.GOOD,
    livenessMatchStatus: SelfieMatchStatus.GOOD,
    faceMatchComparisonResult: 90,
    livenessComparisonResult: 90,
    selfieImagePreSignedS3URL: '',
    livenessVideoPreSignedS3URL: '',
    retryCount: null,
  };

  const mockCustScanCardSelfieCheckDetailsRepository: ICustScanCardSelfieCheckDetailsRepository =
    {
      findByCustId: function (
        custId: string,
      ): Promise<ICustScanCardSelfieCheckDetails> {
        return Promise.resolve(mockCustScanCardSelfieCheckDetails);
      },
      save: function (
        custIdCardDetails: ICustScanCardSelfieCheckDetails,
      ): Promise<ICustScanCardSelfieCheckDetails> {
        return Promise.resolve(mockCustScanCardSelfieCheckDetails);
      },
    };

  const mockCustIdCardDetailsRepository: ICustIdCardDetailsRepository = {
    findByCustId: function (custId: string): Promise<ICustIdCardDetails> {
      if (custId === '123') return Promise.resolve(mockCustIdCardDetails);
    },
    save: function (
      custIdCardDetails: ICustIdCardDetails,
    ): Promise<ICustIdCardDetails> {
      return Promise.resolve(mockCustIdCardDetails);
    },
    findByCustIdOrFail: function (custId: string): Promise<ICustIdCardDetails> {
      return Promise.resolve(mockCustIdCardDetails);
    },
  };

  const mockCustPrimaryDetailsRepo: ICustPrimaryDetailsRepository = {
    getByCustomerId: function (
      customerId: string,
    ): Promise<ICustPrimaryDetails> {
      return Promise.resolve(mockCustPrimaryDetails);
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
      throw new Error('Function not implemented.');
    },
    getByEmail: function (
      email: string,
      custId: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    getZeroLoansCust: function (): Promise<ICustPrimaryDetails[]> {
      return Promise.resolve(null);
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

  const mockCustTelcoRepo: ICustTelcoRepository = {
    findByLeadId: function (leadId: string): Promise<ICustTelco> {
      return Promise.resolve({ ...mockCustTelco, leadId });
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
      throw new Error('Function not implemented.');
    },
    updateCustTelcoList: function (
      custTelco: ICustTelco[],
    ): Promise<ICustTelco[]> {
      throw new Error('Function not implemented.');
    },
  };

  const mockCustToLosService: DeepMocked<ICustToLOSService> =
    createMock<ICustToLOSService>();

  const mockS3ManagerService: DeepMocked<S3ManagerService> =
    createMock<S3ManagerService>();

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ICustIdCardDetailsService,
          useClass: CustIdCardDetailsService,
        },
        {
          provide: ICustIdCardDetailsRepository,
          useValue: mockCustIdCardDetailsRepository,
        },
        { provide: S3ManagerService, useValue: mockS3ManagerService },
        {
          provide: ICustScanCardSelfieCheckDetailsRepository,
          useValue: mockCustScanCardSelfieCheckDetailsRepository,
        },
        {
          provide: ICustPrimaryDetailsRepository,
          useValue: mockCustPrimaryDetailsRepo,
        },
        { provide: ICustTelcoRepository, useValue: mockCustTelcoRepo },

        { provide: ICustToLOSService, useValue: mockCustToLosService },
        ConfigService,
      ],
    }).compile();

    service = module.get<ICustIdCardDetailsService>(ICustIdCardDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should call uploadIdCardDetails exisitng case', async () => {
    const idCardScanDTO = generateMockIdCardScanDto();
    jest
      .spyOn(mockS3ManagerService, 'generatePresignedUrl')
      .mockResolvedValueOnce('presignedUrl1')
      .mockResolvedValueOnce('presignedUrl2')
      .mockResolvedValueOnce('presignedUrl3');
    const result = await service.uploadIdCardDetails(
      '123',
      idCardScanDTO.ocr,
      idCardScanDTO.mrz,
      null,
      null,
      null,
    );
    expect(result).toBeInstanceOf(CustIdCardDetailsServiceDto);
  });

  it('Should call uploadIdCardDetails new case', async () => {
    const idCardScanDTO = generateMockIdCardScanDto();
    jest
      .spyOn(mockS3ManagerService, 'generatePresignedUrl')
      .mockResolvedValueOnce('presignedUrl1')
      .mockResolvedValueOnce('presignedUrl2')
      .mockResolvedValueOnce('presignedUrl3');
    const result = await service.uploadIdCardDetails(
      '234',
      idCardScanDTO.ocr,
      idCardScanDTO.mrz,
      null,
      null,
      null,
    );
    expect(result).toBeInstanceOf(CustIdCardDetailsServiceDto);
  });

  it('Should call uploadIdCardDetails exisitng case', async () => {
    const selfieCheckDto = generateselfieCheckDTO();
    const result = await service.selfieMatchDetails('1234', selfieCheckDto);
    expect(result).toEqual(mockCustScanCardSelfieCheckDetails);
  });
  it('Update Should call repository save method with correct input', async () => {
    const dto: EditIdCardScanDTO = {
      edited: {
        givenName: 'John',
        surname: 'Doe',
        nin: '123',
        dob: '31.12.1990',
        ninExpiryDate: '01.12.2090',
      },
    };
    const repoSaveSpy = jest.spyOn(mockCustIdCardDetailsRepository, 'save');
    await service.editIdCardDetails('1234', dto);
    expect(repoSaveSpy).toBeCalledWith({
      ...mockCustIdCardDetails,
      editedGivenName: dto.edited.givenName,
      editedSurname: dto.edited.surname,
      editedNIN: dto.edited.nin,
      editedDOB: dateStringToDateObject(dto.edited.dob),
      editedNINExpiryDate: dateStringToDateObject(dto.edited.ninExpiryDate),
    });
  });

  it('Should call getIdCardDetails exisitng case', async () => {
    const result = await service.getIdCardDetails('123');
    expect(result).toEqual(mockCustIdCardDetails);
  });

  it('Should call getSelfieLiveness exisitng case', async () => {
    const result = await service.getSelfieLiveness('123');
    expect(result).toEqual(mockCustScanCardSelfieCheckDetails);
  });

  it('Should call getSelfieLiveness exisitng case', async () => {
    jest
      .spyOn(mockS3ManagerService, 'generatePresignedUrl')
      .mockResolvedValueOnce('/url/base/selfie.jpg');
    const result = await service.retryUpload('123', [
      generateMockRetryUploadDTO(),
    ]);
    expect(result).toEqual(generateMockRetryUploadPresenter());
  });
  it('Should get Address', async () => {
    jest
      .spyOn(mockCustIdCardDetailsRepository, 'findByCustIdOrFail')
      .mockResolvedValueOnce(mockCustIdCardDetails);
    const result = await service.getAddress('customerId123');
    expect(result).toEqual(mockGetAddressResponseDto);
  });
  it('Should throw EntityNotFoundError if address not found', async () => {
    jest
      .spyOn(mockCustIdCardDetailsRepository, 'findByCustIdOrFail')
      .mockRejectedValueOnce(new EntityNotFoundError(CustIdCardDetails, null));
    const result = service.getAddress('customerId123');

    await expect(result).rejects.toThrowError(EntityNotFoundError);
  });
});
