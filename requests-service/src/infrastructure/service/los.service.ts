import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { ILOSService } from '../../domain/service/losService.interface';
import { LOSOutcomeDTO } from '../controllers/requests/dtos/losOutcome.dto';

@Injectable()
export class LOSService implements ILOSService {
  private LOS_BASE_URL: string;
  private LOS_CONTENT_TYPE: string;
  private LOS_PARTNER_CODE: string;
  private OS: string;
  private LOS_PACKAGE_ID: string;
  private LOS_TOKEN: string;
  private requestConfig: AxiosRequestConfig;

  private readonly logger = new Logger(LOSService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.LOS_BASE_URL = this.configService.get<string>('LOS_BASE_URL');
    this.LOS_CONTENT_TYPE = this.configService.get<string>('LOS_CONTENT_TYPE');
    this.LOS_PARTNER_CODE = this.configService.get<string>('LOS_PARTNER_CODE');
    this.OS = this.configService.get<string>('OS');
    this.LOS_PACKAGE_ID = this.configService.get<string>('LOS_PACKAGE_ID');
    this.LOS_TOKEN = this.configService.get<string>('LOS_TOKEN');

    this.requestConfig = {
      headers: {
        'Content-Type': this.LOS_CONTENT_TYPE,
        'partner-code': this.LOS_PARTNER_CODE,
        os: this.OS,
        'package-id': this.LOS_PACKAGE_ID,
        Authorization: 'Bearer ' + this.LOS_TOKEN,
      },
    };
  }

  async interactionTarget(uuid: string): Promise<any> {
    this.logger.log(this.interactionTarget.name);

    const interactionTargetUrl: string =
      this.LOS_BASE_URL + '/api/workflow/interactions' + '?uuid=' + uuid;

    const responseData: object = await lastValueFrom(
      this.httpService.get(interactionTargetUrl, this.requestConfig).pipe(
        map((response) => {
          return response.data;
        }),
      ),
    );

    return responseData;
  }

  async interactionOutcome(
    secondaryUUID: string,
    losOutcomeDto: LOSOutcomeDTO,
  ): Promise<boolean> {
    this.logger.log(this.interactionOutcome.name);
    const interactionOutcomeUrl: string =
      this.LOS_BASE_URL +
      '/api/workflow/interaction_outcome' +
      '?uuid=' +
      secondaryUUID;

    this.logger.log(interactionOutcomeUrl);

    this.logger.log('Request service LOSOutcomeDTO');
    this.logger.log(losOutcomeDto);

    const responseData: number = await lastValueFrom(
      this.httpService
        .put(interactionOutcomeUrl, losOutcomeDto, this.requestConfig)
        .pipe(
          map((response) => {
            return response.status;
          }),
        ),
    );

    return responseData === 200;
  }
}
