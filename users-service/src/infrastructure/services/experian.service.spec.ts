import { Test } from '@nestjs/testing';
import { ExperianService } from './experian.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IExperianDataRepository } from '../../domain/repository/experian-data-repository.interface';
import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { mockExperianDataReposiotry } from '../repository/mocks/experian-data.repository.mock';
import {
  mockExperianData,
  mockKycEnquiryDto,
} from '../../domain/model/mocks/experian-data.mock';
import { ICustPrimaryDetailsRepository } from '../../domain/repository/custPrimaryDetailsRepository.interface';
import { CustPrimaryDetailsRepository } from '../repository/custPrimaryDetails.repository';
import { IdType } from '../../domain/enum/id-type.enum';

let experianService: ExperianService;
const httpServiceMock = createMock<HttpService>();
const configServiceMock = createMock<ConfigService>();
const repoCreateSpy = jest.spyOn(mockExperianDataReposiotry, 'create');
const repoUpdateSpy = jest.spyOn(mockExperianDataReposiotry, 'update');
const repoFindActiveByIdSpy = jest.spyOn(
  mockExperianDataReposiotry,
  'getByIdTypeIdValueAndIsActive',
);
const httpPostSpy = jest.spyOn(httpServiceMock, 'post');

const mockResponse = {
  status: 200,
  data: { mocked: 'response' },
} as AxiosResponse;
jest.spyOn(configServiceMock, 'get').mockImplementation((envName) => {
  switch (envName) {
    case 'EXPERIAN_BASE_URL':
      return 'http://experian.com';
    case 'EXPERIAN_BRANCH_CODE':
      return 'branchcode123';
    case 'EXPERIAN_USERNAME':
      return 'username123';
    case 'EXPERIAN_PASSWORD':
      return 'password123';
    default:
      break;
  }
});

const mockCustPrimaryDetailsRepository =
  createMock<CustPrimaryDetailsRepository>();

describe('ExperianService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExperianService,
        { provide: HttpService, useValue: httpServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
        {
          provide: IExperianDataRepository,
          useValue: mockExperianDataReposiotry,
        },
        {
          provide: ICustPrimaryDetailsRepository,
          useValue: mockCustPrimaryDetailsRepository,
        },
      ],
    }).compile();
    experianService = moduleRef.get<ExperianService>(ExperianService);
  });

  describe('kycEnquiry', () => {
    it('should make a request to Experian KYC Endpoint', async () => {
      httpPostSpy.mockReturnValueOnce(of(mockResponse));
      // Act
      await experianService.kycEnquiry(mockKycEnquiryDto);

      expect(httpPostSpy).toHaveBeenCalled();

      // Assert
      //   expect(httpPostSpy).toHaveBeenCalledWith(
      //     'http://experian.com/bureau/ind/kyc/enquiry/v4', // You can provide a specific URL to match
      //     {
      //       // Check the request body
      //       data: {
      //         client_reference_number: expect.any(String),
      //         has_consent: 1,
      //         source: '0',
      //         identifiers: [
      //           {
      //             id_number: 'nin123',
      //             id_number_type: 'COUNTRYID',
      //             country: 'UG',
      //           },
      //         ],

      //         authorization: {
      //           branchcode: 'branchcode123',
      //           username: 'username123',
      //           password: 'password123',
      //         },
      //       },
      //     },
      //   );
    });

    it('should handle a successful response', async () => {
      // Arrange
      httpPostSpy.mockReturnValueOnce(of(mockResponse));

      // Act
      await experianService.kycEnquiry(mockKycEnquiryDto);

      // Assert
      expect(repoFindActiveByIdSpy).toBeCalledTimes(1);
      expect(repoCreateSpy).toHaveBeenCalledTimes(1);
      expect(repoUpdateSpy).toHaveBeenCalledTimes(2); //update newExperian Response and old experian response
      // You can add further assertions based on the expected behavior
    });
    it('should use leadId if cust Id has no active entries', async () => {
      // Arrange
      httpPostSpy.mockReturnValueOnce(of(mockResponse));
      jest
        .spyOn(mockExperianDataReposiotry, 'getByIdTypeIdValueAndIsActive')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockExperianData);

      // Act
      await experianService.kycEnquiry({
        ...mockKycEnquiryDto,
        idType: IdType.CUSTOMER,
      });

      // Assert
      expect(repoFindActiveByIdSpy).toBeCalledTimes(2); // find using custId and leadId
      expect(repoCreateSpy).toHaveBeenCalledTimes(1);
      expect(repoUpdateSpy).toHaveBeenCalledTimes(2); //update newExperian Response and old experian response
      // You can add further assertions based on the expected behavior
    });
    it('should use leadId if cust Id has no active entries. If both null should only call experian repo update once', async () => {
      // Arrange
      httpPostSpy.mockReturnValueOnce(of(mockResponse));
      jest
        .spyOn(mockExperianDataReposiotry, 'getByIdTypeIdValueAndIsActive')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      // Act
      await experianService.kycEnquiry({
        ...mockKycEnquiryDto,
        idType: IdType.CUSTOMER,
      });

      // Assert
      expect(repoFindActiveByIdSpy).toBeCalledTimes(2); // find using custId and leadId
      expect(repoCreateSpy).toHaveBeenCalledTimes(1);
      expect(repoUpdateSpy).toHaveBeenCalledTimes(1); //update newExperian Response only
      // You can add further assertions based on the expected behavior
    });
    it('should search by leadId only if IdType is LEAD. If has no active entries then will call experian repo update once only', async () => {
      // Arrange
      httpPostSpy.mockReturnValueOnce(of(mockResponse));
      jest
        .spyOn(mockExperianDataReposiotry, 'getByIdTypeIdValueAndIsActive')
        .mockResolvedValueOnce(null);

      // Act
      await experianService.kycEnquiry({
        ...mockKycEnquiryDto,
        idType: IdType.LEAD,
      });

      // Assert
      expect(repoFindActiveByIdSpy).toBeCalledTimes(1); // find using leadId only
      expect(repoCreateSpy).toHaveBeenCalledTimes(1);
      expect(repoUpdateSpy).toHaveBeenCalledTimes(1); //update newExperian Response only
      // You can add further assertions based on the expected behavior
    });

    it('should handle an error response', async () => {
      httpPostSpy.mockImplementationOnce(() => {
        throw new Error('mocked error');
      });
      // Act
      const res = experianService.kycEnquiry(mockKycEnquiryDto);

      expect(res).rejects.toThrowError();
    });
  });
  it('should handle an status code not 200 response', async () => {
    const mockResponse = {
      status: 400,
      data: { mocked: 'error' },
    } as AxiosResponse;
    httpPostSpy.mockReturnValueOnce(of(mockResponse)),
      // Act
      await experianService.kycEnquiry(mockKycEnquiryDto);

    // Assert
    expect(repoFindActiveByIdSpy).toBeCalledTimes(1);
    expect(repoCreateSpy).toHaveBeenCalledTimes(1);
    expect(repoUpdateSpy).toHaveBeenCalledTimes(1); //only update newExperian entry
    // You can add further assertions based on the expected behavior
  });
  it('check experian validity date check should work as expected', async () => {
    experianService['EXPERIAN_VALID_DAYS'] = 180;
    const isMoreThan180DaysAgo = experianService['checkExperianValidity'](
      new Date('01 Jan 1990'),
    );
    const is180DaysAgo = experianService['checkExperianValidity'](
      new Date(Date.now() - 180 * 24 * 3600 * 1000),
    );
    const isSlightlyMoreThan180DaysAgo = experianService[
      'checkExperianValidity'
    ](new Date(Date.now() - 180 * 24 * 3600 * 1000 - 1));
    const isSlightlyLessThan180DaysAgo = experianService[
      'checkExperianValidity'
    ](new Date(Date.now() - 180 * 24 * 3600 * 1000 + 1));
    const is179DaysAgo = experianService['checkExperianValidity'](
      new Date(Date.now() - 179 * 24 * 3600 * 1000),
    );

    // Assert
    expect(isMoreThan180DaysAgo).toEqual(false);
    expect(is180DaysAgo).toEqual(false);
    expect(isSlightlyMoreThan180DaysAgo).toEqual(false);
    expect(isSlightlyLessThan180DaysAgo).toEqual(false);
    expect(is179DaysAgo).toEqual(true);
  });
});
