import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { of } from 'rxjs';
import { URL } from 'url';
import { LeadStatus } from '../../domain/enum/customer/leadStatus.enum';
import { ICustOtp } from '../../domain/models/customer/custOtp.interface';
import { StatusMessagePresenter } from '../controllers/common/statusMessage.presenter';
import { CustomerServiceClient } from './customerClient.service';

describe('CustOtpServiceClient', () => {
  let httpService: HttpService;
  let configService: ConfigService;
  let custOtpServiceClient: CustomerServiceClient;
  const customersServiceHostname = 'https://example.com/v1';

  beforeEach(() => {
    httpService = {
      post: jest.fn(),
      delete: jest.fn(),
    } as unknown as HttpService;
    configService = {
      get: jest.fn(),
    } as unknown as ConfigService;
    jest.spyOn(configService, 'get').mockReturnValue(customersServiceHostname);
    custOtpServiceClient = new CustomerServiceClient(
      configService,
      httpService,
    );
  });
  const createCustFromLeadPath = '/customers/create-customer-from-lead/';
  const createCustFromLeadUrl = new URL(customersServiceHostname);
  createCustFromLeadUrl.pathname += createCustFromLeadPath;
  const deleteCustPath = '/customers/';
  const deleteCustUrl = new URL(customersServiceHostname);
  deleteCustUrl.pathname += deleteCustPath;

  describe('findOneByMsisdn', () => {
    const msisdnCountryCode = '1';
    const msisdn = '5551234';
    console.log(createCustFromLeadUrl);
    console.log(deleteCustUrl);
    const response: StatusMessagePresenter<ICustOtp> = {
      status: 2000,
      message: '',
      data: {
        leadCurrentStatus: LeadStatus.OTP_GENERATED,
      } as unknown as ICustOtp,
    };

    beforeEach(() => {
      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of({ data: response } as AxiosResponse));
    });

    it('should call HttpService.get with the correct URL', async () => {
      await custOtpServiceClient.createCustomerFromEnhancedLead(
        msisdnCountryCode,
        msisdn,
      );
      const postRequestPayload = { msisdn, msisdnCountryCode };
      expect(httpService.post).toHaveBeenCalledWith(
        createCustFromLeadUrl.toString(),
        postRequestPayload,
      );
    });

    it('should return the created customer ID received from HttpService', async () => {
      const result = await custOtpServiceClient.createCustomerFromEnhancedLead(
        msisdnCountryCode,
        msisdn,
      );
      expect(result).toBe(response);
      expect(result?.data?.leadCurrentStatus).toBe(
        response?.data?.leadCurrentStatus,
      );
    });
  });
  describe('deleteCustomer', () => {
    it('should delete customer and return data', async () => {
      const customerId = '123';
      const response = { data: { message: 'Customer deleted' } };
      jest
        .spyOn(httpService, 'delete')
        .mockReturnValueOnce(of(response as AxiosResponse));

      const result = await custOtpServiceClient.deleteCustomer(customerId);
      expect(httpService.delete).toBeCalledWith(
        `${deleteCustUrl.toString()}${customerId}/`,
      );
      expect(result).toEqual(response.data);
    });

    it('should throw an error when an error occurs during deletion', async () => {
      const customerId = '123';
      const error = new Error('An error occurred');
      jest.spyOn(httpService, 'delete').mockImplementationOnce(() => {
        throw error;
      });

      await expect(
        custOtpServiceClient.deleteCustomer(customerId),
      ).rejects.toThrowError();
      expect(httpService.delete).toBeCalledWith(
        `${deleteCustUrl.toString()}${customerId}/`,
      );
    });
  });
});
