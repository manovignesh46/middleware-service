import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { CustomerServiceClient } from './customers-service-client.service';
import { createMock } from '@golevelup/ts-jest';
import { GetCustomerFromFullMsisdnPresenter } from './presenter/get-customer-from-full-msisdn.presenter';
import { AxiosResponse } from 'axios';

describe('CustomerServiceClient', () => {
  let customerService: CustomerServiceClient;
  const mockHttpService = createMock<HttpService>();
  const mockConfigService = createMock<ConfigService>();
  jest.spyOn(mockConfigService, 'get').mockReturnValue('http://example.com');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerServiceClient,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    customerService = module.get<CustomerServiceClient>(CustomerServiceClient);
  });

  it('should be defined', () => {
    expect(customerService).toBeDefined();
  });

  describe('getCustomerFromFullMsisdn', () => {
    it('should retrieve customer data when the response status is SUCCESS', async () => {
      const fullMsisdn = '+123456789';
      new GetCustomerFromFullMsisdnPresenter();
      const mockResponseData: GetCustomerFromFullMsisdnPresenter = {
        msisdnCountryCode: '+12',
        msisdn: '3456789',
        preferredName: 'John',
        email: 'john@abc.com',
        customerId: 'customer123',
        leadId: 'lead123',
      };
      const mockAxiosResponse = {
        data: { status: 2000, message: 'OK', data: mockResponseData },
      } as AxiosResponse;
      jest
        .spyOn(mockHttpService, 'get')
        .mockReturnValueOnce(of(mockAxiosResponse));

      const response = await customerService.getCustomerFromFullMsisdn(
        fullMsisdn,
      );

      expect(response).toEqual(mockResponseData);

      // Ensure that HttpService.get was called with the correct URL
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://example.com/customers/fullmsisdn/+123456789',
      );
    });

    it('should throw an error when the response status is not SUCCESS', async () => {
      const fullMsisdn = '987654321';

      // Mock a response with an error status
      jest.spyOn(mockHttpService, 'get').mockReturnValueOnce(
        of({
          data: {
            status: 4000,
            message: 'Invalid MSISDN',
          },
        } as AxiosResponse),
      );

      await expect(
        customerService.getCustomerFromFullMsisdn(fullMsisdn),
      ).rejects.toThrowError('Invalid MSISDN');

      // Ensure that HttpService.get was called with the correct URL
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://example.com/customers/fullmsisdn/987654321',
      );
    });
  });
});
