import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NestInterceptor,
  Logger,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Observable, of, lastValueFrom } from 'rxjs';
import { ResponseMessage } from '../domain/enum/response-status-message.enum';
import { ResponseStatusCode } from '../domain/enum/responseStatusCode.enum';
import { StatusMessagePresenter } from '../infrastructure/controllers/requests/presenters/statusMessage.presenter';

@Injectable()
export class IpBlacklistingInterceptor implements NestInterceptor {
  private BLACKLISTED_COUNTRY_CODES: string[];
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.BLACKLISTED_COUNTRY_CODES = this.configService.get<string[]>(
      'BLACKLISTED_COUNTRY_CODES',
    ) || ['CU', 'RU', 'KP', 'IR', 'SY', 'BY', 'VE', 'UA'];
  }
  private readonly logger = new Logger(IpBlacklistingInterceptor.name);
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

    if (countryCode && !this.BLACKLISTED_COUNTRY_CODES.includes(countryCode)) {
      this.logger.log(`Request IP originating from ${countryCode}`);
      // Only call route handler if country is NOT blacklisted
      return next.handle();
    } else {
      this.logger.error(
        `User source IP country: ${countryCode} is in the sanctioned country list: ${this.BLACKLISTED_COUNTRY_CODES}`,
      );

      return of(
        new StatusMessagePresenter(
          ResponseStatusCode.FAIL_COUNTRY_IP_BLACKLISTING,
          ResponseMessage.COUNTRY_BLACKLISTED,
        ),
      );
    }
  }
}
