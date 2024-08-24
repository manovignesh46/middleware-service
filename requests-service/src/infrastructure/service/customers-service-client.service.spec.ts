import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { ResponseStatusCode } from '../../domain/enum/responseStatusCode.enum';
import { ICustomerServiceClient } from '../../domain/service/customer-service-client.service.interface';
import { CustomerServiceClient } from './customers-service-client.service';
import { generateMockCustomerIdCardDetails } from '../controllers/requests/dtos/CustomerIdCardDetails.dto.spec';
import { generateMockSelfieLivenessDTO } from '../controllers/requests/dtos/selfieLiveness.dto.spec';
import { generateMockOfferDetailsDTO } from '../controllers/requests/dtos/offerDetails.dto.spec';
import { generateMockStudentDetailsDTO } from '../controllers/requests/dtos/studentDetails.dto.spec';

describe('CustomerServiceClient', () => {
  let service: ICustomerServiceClient;
  let configService: ConfigService;

  const mockRepayLoanResponse = {
    data: {
      status: ResponseStatusCode.SUCCESS,
      message: '',
      data: { targetApiUuid: '123' },
    },
  };

  const mockGetResponse = {
    data: {
      status: ResponseStatusCode.SUCCESS,
      message: '',
      data: {},
    },
  };

  const mockHttpService = {
    get: jest.fn((path: string) => {
      if (path === 'http://localhost:3001/v1/customers/idCardDetails/1234') {
        mockGetResponse.data.data = generateMockCustomerIdCardDetails();
        return of(mockGetResponse);
      } else if (
        path === 'http://localhost:3001/v1/customers/selfieLiveness/1234'
      ) {
        mockGetResponse.data.data = generateMockSelfieLivenessDTO();
        return of(mockGetResponse);
      } else if (
        path === 'http://localhost:3001/v1/customers/offerVariant/1234'
      ) {
        mockGetResponse.data.data = generateMockOfferDetailsDTO();
        return of(mockGetResponse);
      } else if (
        path === 'http://localhost:3001/v1/customers/studentDetails/1234/123'
      ) {
        mockGetResponse.data.data = generateMockStudentDetailsDTO();
        return of(mockGetResponse);
      } else return of(mockRepayLoanResponse);
    }),

    post: jest.fn(() => {
      return of(mockRepayLoanResponse);
    }),
    put: jest.fn(() => {
      return of(mockRepayLoanResponse);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        CustomerServiceClient,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();
    service = module.get<CustomerServiceClient>(CustomerServiceClient);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repayLoan should call http get with the correct url', async () => {
    const customerId = 'abc';
    const customerServiceHostname = configService.get<string>(
      'CUSTOMERS_SERVICE_HOSTNAME',
    );
    const expectedUrl =
      customerServiceHostname + `/customers/${customerId}/target-api-uuid/`;
    const httpGetSpy = jest.spyOn(mockHttpService, 'get');
    const response = await service.getTargetApiUUID(customerId);
    expect(httpGetSpy).toBeCalledWith(expectedUrl);
    expect(response).toEqual('123');
  });
  // it('if repayLoan returns non success response, return null', async () => {
  //   const customerId = 'abc';
  //   jest
  //     .spyOn(mockHttpService, 'get')
  //     .mockReturnValueOnce(
  //       of({ data: { ...mockRepayLoanResponse.data, status: -1 } }),
  //     );
  //   const response = service.getTargetApiUUID(customerId);
  //   await expect(response).rejects.toThrowError();
  // });

  it('interService getIdCardDetails', async () => {
    const result = await service.getIdCardDetails('1234');
    expect(result).toEqual(generateMockCustomerIdCardDetails());
  });

  it('interService getCustomerSelfieLiveness', async () => {
    const result = await service.getCustomerSelfieLiveness('1234');
    expect(result).toEqual(generateMockSelfieLivenessDTO());
  });

  it('interService getOfferDetails', async () => {
    const result = await service.getOfferDetails('1234');
    expect(result).toEqual(generateMockOfferDetailsDTO());
  });

  it('interService getStudentDetails', async () => {
    const result = await service.getStudentDetails('1234', '123');
    expect(result).toEqual(generateMockStudentDetailsDTO());
  });
});
