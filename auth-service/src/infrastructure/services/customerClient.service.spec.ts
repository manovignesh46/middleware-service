import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';
import { OtpAction } from '../../domain/enum/otp-action.enum';
import { CustomerServiceClient } from './customerClient.service';

describe('CustomerServiceClient', () => {
  let service: CustomerServiceClient;
  let getSpy;
  let postSpy;
  let deleteSpy;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CustomerServiceClient,
        ConfigService,
        { provide: HttpService, useValue: createMock<HttpService>() },
      ],
    }).compile();

    service = module.get<CustomerServiceClient>(CustomerServiceClient);
    getSpy = jest
      .spyOn(service['httpService'], 'get')
      .mockReturnValue(of({ data: { status: 2000 } } as AxiosResponse));
    postSpy = jest
      .spyOn(service['httpService'], 'post')
      .mockReturnValue(of({ data: { status: 2000 } } as AxiosResponse));
    deleteSpy = jest
      .spyOn(service['httpService'], 'delete')
      .mockReturnValue(of({ data: { status: 2000 } } as AxiosResponse));
  });

  it('updatePushDevice', async () => {
    await service.updatePushDevice('custId', 'devId', 'devOs', 'devToken');
    expect(postSpy).toHaveBeenLastCalledWith(
      'http://127.0.0.1:3001/v1/customers/update-push-device/',
      {
        customerId: 'custId',
        deviceId: 'devId',
        deviceOs: 'devOs',
        deviceToken: 'devToken',
      },
      { headers: { 'internal-api-key': 'changeme' } },
    );
  });
  it('createCustomerFromEnhancedLead', async () => {
    await service.createCustomerFromEnhancedLead('+256', '9999999999');
    expect(postSpy).toHaveBeenLastCalledWith(
      'http://127.0.0.1:3001/v1/customers/create-customer-from-lead/',
      {
        msisdn: '9999999999',
        msisdnCountryCode: '+256',
      },
      //   { headers: { 'internal-api-key': 'changeme' } },
    );
  });
  it('deleteCustomer', async () => {
    await service.deleteCustomer('customerID123');
    expect(deleteSpy).toHaveBeenLastCalledWith(
      'http://127.0.0.1:3001/v1/customers/customerID123/',
      //   { headers: { 'internal-api-key': 'changeme' } },
    );
  });
  it('updateCustomer', async () => {
    await service.updateCustomer('customerID123', 'cognitoId123');
    expect(postSpy).toHaveBeenLastCalledWith(
      'http://127.0.0.1:3001/v1/customers/update-customer',
      { cognitoId: 'cognitoId123', customerId: 'customerID123' },
      { headers: { 'internal-api-key': 'changeme' } },
    );
  });
  it('checkOtpVerifiedKey', async () => {
    await service.checkOtpVerifiedKey(
      'customerID123',
      'otpVerifiedKey',
      OtpAction.LOGIN,
    );
    expect(postSpy).toHaveBeenLastCalledWith(
      'http://127.0.0.1:3001/v1/customers/verify-otp-key',
      {
        customerId: 'customerID123',
        otpAction: 'LOGIN',
        otpVerifiedKey: 'otpVerifiedKey',
      },
      { headers: { 'internal-api-key': 'changeme' } },
    );
  });
  it('getCustomerFromFullMsisdn', async () => {
    await service.getCustomerFromFullMsisdn('+2569999999999');
    expect(getSpy).toHaveBeenLastCalledWith(
      'http://127.0.0.1:3001/v1/customers/fullmsisdn/+2569999999999',
      //   { headers: { 'internal-api-key': 'changeme' } },
    );
  });
});
