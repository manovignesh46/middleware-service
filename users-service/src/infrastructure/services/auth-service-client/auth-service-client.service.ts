import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';
import { ResponseStatusCode } from '../../../domain/enum/responseStatusCode.enum';
import { IDevice } from './dtos/device.interface';

@Injectable()
export class AuthServiceClient {
  private authServiceHostname: string;
  private internalApiKey: string;
  private requestConfig: AxiosRequestConfig;
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.authServiceHostname = this.configService.get<string>(
      'AUTH_SERVICE_HOSTNAME',
    );
    this.internalApiKey =
      this.configService.get<string>('INTERNAL_API_KEY') || 'changeme';
    this.requestConfig = {
      headers: { 'internal-api-key': this.internalApiKey },
    };
  }

  private logger = new Logger(AuthServiceClient.name);

  async getDevices(customerId: string): Promise<IDevice[]> {
    this.logger.log(this.getDevices.name);
    const path = `/auth/internal/list-devices/${customerId}`;
    const url = new URL(this.authServiceHostname);
    url.pathname += path;
    try {
      const response = (
        await lastValueFrom(
          this.httpService.get(url.toString(), this.requestConfig),
        )
      ).data;
      if (response?.status === ResponseStatusCode.SUCCESS) {
        return response?.data?.deviceList; // IDevice[]
      } else {
        this.logger.error(
          `Error making request to auth service to retrieve device list for customer`,
        );
        throw new Error(
          response?.message || 'Error when retreiving device list for customer',
        );
      }
    } catch (e) {
      this.logger.error(e.stack);
      throw e;
    }
  }

  async deleteCognitoCredentials(customerId: string) {
    this.logger.log(this.deleteCognitoCredentials.name);
    const path = `/auth/internal/delete-cognito-user/${customerId}`;
    const url = new URL(this.authServiceHostname);
    url.pathname += path;
    let response;
    try {
      response = (
        await lastValueFrom(
          this.httpService.delete(url.toString(), this.requestConfig),
        )
      ).data;
    } catch (e) {
      this.logger.error(e.stack);
      throw e;
    }

    switch (response?.status) {
      case ResponseStatusCode.SUCCESS:
        return true;
      case ResponseStatusCode.FAIL:
        return false;
      default:
        throw new Error(
          response?.message ||
            'Error when deleting cognito credentials for customer',
        );
    }
  }
}
