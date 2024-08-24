import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { lastValueFrom } from 'rxjs';
import { ResponseStatusCode } from '../../../domain/model/enum/responseStatusCode.enum';
@Injectable()
export class CustomerServiceClient {
  private customersServiceHostname: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.customersServiceHostname = this.configService.get<string>(
      'CUSTOMERS_SERVICE_HOSTNAME',
    );
  }

  private logger = new Logger(CustomerServiceClient.name);

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
