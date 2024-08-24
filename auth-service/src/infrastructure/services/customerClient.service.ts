import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import * as path from 'path';
import { lastValueFrom } from 'rxjs';
import { OtpAction } from '../../domain/enum/otp-action.enum';
import { ResponseStatusCode } from '../../domain/enum/responseStatusCode.enum';
import { ICustomerServiceClient } from '../../domain/services/customerClient.interface';
import { StatusMessagePresenter } from '../controllers/common/statusMessage.presenter';

@Injectable()
export class CustomerServiceClient implements ICustomerServiceClient {
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.customersServiceHostname = this.configService.get<string>(
      'CUSTOMERS_SERVICE_HOSTNAME',
    );

    this.internalApiKey =
      this.configService.get<string>('INTERNAL_API_KEY') || 'changeme';
    this.requestConfig = {
      headers: { 'internal-api-key': this.internalApiKey },
    };
  }
  async updatePushDevice(
    customerId: string,
    deviceId: string,
    deviceOs: string,
    deviceToken: string,
  ): Promise<StatusMessagePresenter<any>> {
    this.logger.log(this.updatePushDevice.name);
    const path = '/customers/update-push-device/';
    const payload = { customerId, deviceId, deviceOs, deviceToken };
    const url = new URL(this.customersServiceHostname);
    url.pathname += path;
    let res;
    try {
      res = (
        await lastValueFrom(
          this.httpService.post(url.toString(), payload, this.requestConfig),
        )
      ).data;
    } catch (err) {
      this.logger.error(err.stack);
      throw new Error(
        `Error when registering device for push notifications: ${payload.toString()}`,
      );
    }
    if (res?.status !== ResponseStatusCode.SUCCESS) {
      this.logger.error(res);
      throw new Error(
        `Error response when registering device for push notification: ${res?.message}`,
      );
    }
    return res;
  }
  private customersServiceHostname: string;
  private internalApiKey: string;
  private logger = new Logger(CustomerServiceClient.name);
  private requestConfig: AxiosRequestConfig;
  async createCustomerFromEnhancedLead(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<StatusMessagePresenter> {
    const path = '/customers/create-customer-from-lead/';
    const payload = { msisdnCountryCode, msisdn };
    const url = new URL(this.customersServiceHostname);
    url.pathname += path;
    try {
      return (
        await lastValueFrom(this.httpService.post(url.toString(), payload))
      ).data;
    } catch (err) {
      this.logger.error(err.stack);
      throw new Error('Error when Creating Customer');
    }
  }

  async deleteCustomer(customerId: string) {
    const path = `/customers/${customerId}/`;
    const url = new URL(this.customersServiceHostname);
    url.pathname += path;
    try {
      return (await lastValueFrom(this.httpService.delete(url.toString())))
        .data;
    } catch (err) {
      this.logger.error(err.stack);
      throw new Error('Error when Deleting Customer');
    }
  }

  async updateCustomer(customerId: string, cognitoId: string) {
    const urlPath = '/customers/update-customer';
    const url = new URL(this.customersServiceHostname);
    url.pathname = path.join(url.pathname, urlPath);
    const requestBody = { customerId, cognitoId };

    try {
      return (
        await lastValueFrom(
          this.httpService.post(
            url.toString(),
            requestBody,
            this.requestConfig,
          ),
        )
      ).data;
    } catch (err) {
      this.logger.error(err.stack);
      throw new Error('Error when Updating Customer');
    }
  }

  async checkOtpVerifiedKey(
    customerId: string,
    otpVerifiedKey: string,
    otpAction: OtpAction,
  ) {
    this.logger.log(this.checkOtpVerifiedKey.name);
    const urlPath = '/customers/verify-otp-key';
    const url = new URL(this.customersServiceHostname);
    url.pathname = path.join(url.pathname, urlPath);
    const requestBody = { customerId, otpVerifiedKey, otpAction };

    try {
      return (
        await lastValueFrom(
          this.httpService.post(
            url.toString(),
            requestBody,
            this.requestConfig,
          ),
        )
      ).data;
    } catch (err) {
      this.logger.error(err.stack);
      throw new Error('Error when verifying customer otp verified key');
    }
  }

  async getCustomerFromFullMsisdn(fullMsisdn: string) {
    this.logger.log(this.getCustomerFromFullMsisdn.name);
    const urlPath = `/customers/fullmsisdn/${fullMsisdn}`;
    const url = new URL(this.customersServiceHostname);
    url.pathname = path.join(url.pathname, urlPath);
    try {
      const response = (
        await lastValueFrom(this.httpService.get(url.toString()))
      ).data;

      if (response?.status === ResponseStatusCode.SUCCESS) {
        return response?.data;
      } else if (response?.status === ResponseStatusCode.FAIL) {
        this.logger.error(
          `Empty response from customers service to retrieve customer from msisdn`,
        );
        return null;
      } else {
        this.logger.error(
          `Error making request to customers service to retrieve customer from msisdn`,
        );
        throw new Error(
          response?.message ||
            'Error when retreiving Customer details from msisdn',
        );
      }
    } catch (err) {
      this.logger.error(err.stack);
      throw err;
    }
  }
}
