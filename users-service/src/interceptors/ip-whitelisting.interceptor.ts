import { HttpService } from '@nestjs/axios';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { lastValueFrom, Observable, of } from 'rxjs';
import { ResponseMessage } from '../domain/enum/responseMessage.enum';
import { ResponseStatusCode } from '../domain/enum/responseStatusCode.enum';
import { StatusMessagePresenter } from '../infrastructure/controllers/common/statusMessage.presenter';

@Injectable()
export class IpWhitelistingInterceptor implements NestInterceptor {
  private WHITELISTED_COUNTRY_CODES: string[];
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.WHITELISTED_COUNTRY_CODES = this.configService.get<string[]>(
      'WHITELISTED_COUNTRY_CODES',
    ) || ['UG', 'SG', 'IN', 'US'];
  }
  private readonly logger = new Logger(IpWhitelistingInterceptor.name);
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const userIpAddress = request?.headers['x-user-ip'];
    if (!userIpAddress) {
      return of(
        new StatusMessagePresenter(
          ResponseStatusCode.GENERIC_ERROR_500,
          ResponseMessage.NO_X_USER_IP_HEADER,
        ),
      );
    }
    let countryCode: string;
    let response;
    let responseBody;
    try {
      response = await lastValueFrom(
        this.httpService.get(`https://ipinfo.io/${userIpAddress}`, {
          timeout: 15000,
        }),
      );
      responseBody = response?.data;
      countryCode = responseBody?.country;
    } catch (e) {
      this.logger.error(e);
    }

    if (!countryCode) {
      try {
        response = await lastValueFrom(
          this.httpService.get(
            `https://api.iplocation.net/?cmd=ip-country&ip=${userIpAddress}`,
            { timeout: 15000 },
          ),
        );
        responseBody = response?.data;
        countryCode = responseBody?.country_code2;
      } catch (e) {
        this.logger.error(e);
      }
    }

    if (response?.status !== 200 || !responseBody) {
      this.logger.error(
        `Request failed with response code: ${response?.status}`,
      );
      this.logger.error(
        `Error message from API: ${responseBody?.response_message}`,
      );
      return of(
        new StatusMessagePresenter(
          ResponseStatusCode.GENERIC_ERROR_500,
          ResponseMessage.COUNTRY_WHITELISTING_API_ERROR,
        ),
      );
    }

    if (countryCode && this.WHITELISTED_COUNTRY_CODES.includes(countryCode)) {
      this.logger.log(`Request IP originating from ${countryCode}`);
      // Only call route handler if country is whitelisted
      return next.handle();
    } else {
      this.logger.error(
        `User source IP country: ${countryCode} is not in the list of whitelisted country list: ${this.WHITELISTED_COUNTRY_CODES}`,
      );

      return of(
        new StatusMessagePresenter(
          ResponseStatusCode.FAIL_COUNTRY_IP_WHITELISTING,
          ResponseMessage.COUNTRY_NOT_WHITELISTED,
        ),
      );
    }
  }
}
