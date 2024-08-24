import { Injectable, Logger } from '@nestjs/common';
import { IRequestServiceClient } from '../../domain/services/requestServiceClient.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { ResponseStatusCode } from '../../domain/enum/responseStatusCode.enum';

@Injectable()
export class RequestServiceClient implements IRequestServiceClient {
  private requestServiceHostname: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.requestServiceHostname = this.configService.get<string>(
      'REQUEST_SERVICE_HOSTNAME',
    );
  }

  private logger = new Logger(RequestServiceClient.name);

  async cancelExistingWorkflow(custId: string): Promise<boolean> {
    const path = `/requests/cancel/workflow/${custId}`;
    const url = new URL(this.requestServiceHostname);
    url.pathname += path;

    const responseData = await lastValueFrom(
      this.httpService.get(url.toString()).pipe(
        map((response) => {
          if (response?.data.status === ResponseStatusCode.SUCCESS)
            return response.data.data;
        }),
      ),
    );

    console;
    return responseData;
  }
}
