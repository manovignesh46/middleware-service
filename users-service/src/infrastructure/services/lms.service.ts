import { Injectable, Logger } from '@nestjs/common';
import { ILMSService } from '../../domain/services/lmsService.interface';
import { AxiosRequestConfig } from 'axios';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { IntegratorErrorMappingService } from '../../modules/error-mapping/integrator-error-mapping.service';
import { EndpointName } from '../../modules/error-mapping/endpoint-name.enum';
import { IntegratorName } from '../../modules/error-mapping/IntegratorName.enum';

@Injectable()
export class LMSService implements ILMSService {
  private readonly logger = new Logger(LMSService.name);
  private LMS_BASE_URL: string;
  private LMS_PARTNER_CODE: string;
  private LMS_PACKAGE_ID: string;
  private LMS_TOKEN: string;
  private OS: string;
  private requestConfig: AxiosRequestConfig;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private integratorErrorMappingService: IntegratorErrorMappingService,
  ) {
    this.LMS_BASE_URL = configService.get<string>('LMS_BASE_URL');
    this.LMS_PARTNER_CODE = configService.get<string>('LMS_PARTNER_CODE');
    this.LMS_PACKAGE_ID = configService.get<string>('LMS_PACKAGE_ID');
    this.LMS_TOKEN = configService.get<string>('LMS_TOKEN');
    this.OS = this.configService.get<string>('OS');

    this.requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'partner-code': this.LMS_PARTNER_CODE,
        os: this.OS,
        'package-id': this.LMS_PACKAGE_ID,
        Authorization: 'Bearer ' + this.LMS_TOKEN,
      },
    };
  }
  async optOutCustomer(fullMsisdn: string): Promise<any> {
    this.logger.log(this.optOutCustomer.name);

    const customerOptOutURL: string =
      this.LMS_BASE_URL + '/apis/v1/customers/opt_out';

    const optOutRequestBody = {
      msisdn: fullMsisdn,
    };

    const responseData: object = await lastValueFrom(
      this.httpService
        .post(customerOptOutURL, optOutRequestBody, this.requestConfig)
        .pipe(
          map((response) => {
            console.log(response.data);
            return response.data;
          }),
        ),
    );

    return responseData;
  }
  async purgeCustomer(msisdnList: string[]): Promise<any> {
    this.logger.log(this.purgeCustomer.name);

    const customerPurgeURL: string =
      this.LMS_BASE_URL + '/apis/v1/customers/purge';

    const purgeRequestBody = {
      msisdns: msisdnList,
    };

    const responseData: object = await lastValueFrom(
      this.httpService
        .post(customerPurgeURL, purgeRequestBody, this.requestConfig)
        .pipe(
          map((response) => {
            console.log(response);
            return response.data;
          }),
        ),
    );

    return responseData;
  }

  async getCustomerTelco(fullMsisdn: string): Promise<any> {
    this.logger.log(this.getCustomerTelco.name);

    const customerTelcoURL: string =
      this.LMS_BASE_URL + '/apis/v1/customers/fetch_mtn_customer';

    const telcoRequestBody = {
      msisdn: fullMsisdn,
    };

    const responseData: object = await lastValueFrom(
      this.httpService
        .post(customerTelcoURL, telcoRequestBody, this.requestConfig)
        .pipe(
          map((response) => {
            return response.data;
          }),
        ),
    );

    return responseData;
  }

  async dashboard(productType: string, fullMsisdn: string): Promise<any> {
    this.logger.log(this.dashboard.name);

    const dashboardUrl: string = this.LMS_BASE_URL + '/apis/v1/loans/dashboard';

    const dashboardRequestBody = {
      product_type: productType,
      msisdn: fullMsisdn,
    };

    const responseData: object = await lastValueFrom(
      this.httpService
        .post(dashboardUrl, dashboardRequestBody, this.requestConfig)
        .pipe(
          map((response) => {
            this.integratorErrorMappingService.validateHttpCode(
              response.status,
              response.statusText,
              IntegratorName.LMS,
              EndpointName.DASHBOARD,
            );
            this.integratorErrorMappingService.validateResponseBodyStatusCodeAndErrorCode(
              response.data,
              IntegratorName.LMS,
              EndpointName.DASHBOARD,
            );
            this.logger.log('LMS dashboard logs');
            this.logger.log(response.data.data);
            return response.data.data;
          }),
        ),
    );

    return responseData;
  }

  async getEKycState(fullMsisdn: string): Promise<any> {
    this.logger.log(this.getEKycState.name);

    const ekycStatusUrl: string =
      this.LMS_BASE_URL + '/apis/v1/customers/ekyc_status';

    const reqBody = {
      msisdn: fullMsisdn,
    };

    const responseData: object = await lastValueFrom(
      this.httpService.post(ekycStatusUrl, reqBody, this.requestConfig).pipe(
        map((response) => {
          return response.data.data;
        }),
      ),
    );
    this.logger.log(this.getEKycState.name + ' Response Data:');
    this.logger.log(responseData);
    return responseData;
  }
}
