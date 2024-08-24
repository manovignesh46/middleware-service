import { IRefinitiveService } from '../../domain/services/refinitiveService.interface';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import {
  generateAuthorizationHeaders,
  getRefinitivePayload,
} from './refinitiv.helper';
import { Gender } from '../../domain/enum/gender.enum';
import { MockData } from './mockData';
import { IntegratorErrorMappingService } from '../../modules/error-mapping/integrator-error-mapping.service';
import { IntegratorName } from '../../modules/error-mapping/IntegratorName.enum';
import { EndpointName } from '../../modules/error-mapping/endpoint-name.enum';
@Injectable()
export class RifinitiveService implements IRefinitiveService {
  private logger = new Logger(RifinitiveService.name);

  private REFINITIVE_BASE_URL: string;
  private REFINITIVE_API_SECRET: string;
  private REFINITIVE_API_KEY: string;
  private REFINITIVE_CONTENT_TYPE: string;
  private REFINITIVE_GROUP_ID: string;
  private REFINITIV_STATUS_ID: string;
  private REFINITIV_RISK_ID: string;
  private REFINITIV_REASON_ID: string;
  private REFINITIV_RESOLUTION_REMARK: string;
  private IS_MOCK_REFINITIVE_DATA: boolean;
  private requestConfig: AxiosRequestConfig;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private intergratorErrorMappingService: IntegratorErrorMappingService,
  ) {
    this.REFINITIVE_BASE_URL =
      this.configService.get<string>('REFINITIVE_BASE_URL') ||
      'https://api-worldcheck.refinitiv.com/';
    this.REFINITIVE_API_SECRET =
      this.configService.get<string>('REFINITIVE_API_SECRET') ||
      'FrZyR8kX4pLwsidtBEyfGOBs0FvYOrOI4PB3VN8iXdhD8xhKEEnCMvoCmGAXRkbHvcB6Kukf5YkVThTlMnKbVQ==';
    this.REFINITIVE_API_KEY =
      this.configService.get<string>('REFINITIVE_API_KEY') ||
      'bb61ed81-902a-478f-afde-1893cfd27978';
    this.REFINITIVE_CONTENT_TYPE =
      this.configService.get<string>('REFINITIVE_CONTENT_TYPE') ||
      'application/json';
    this.REFINITIVE_GROUP_ID =
      this.configService.get<string>('REFINITIVE_GROUP_ID') ||
      '5jb6vls802mr1hj9rtl55pppj';
    this.IS_MOCK_REFINITIVE_DATA =
      this.configService.get<string>('IS_MOCK_REFINITIVE_DATA') === 'true' ||
      false;
    this.REFINITIV_STATUS_ID = this.configService.get<string>(
      'REFINITIV_STATUS_ID',
    );
    this.REFINITIV_RISK_ID =
      this.configService.get<string>('REFINITIV_RISK_ID');
    this.REFINITIV_REASON_ID = this.configService.get<string>(
      'REFINITIV_REASON_ID',
    );
    this.REFINITIV_RESOLUTION_REMARK = this.configService.get<string>(
      'REFINITIV_RESOLUTION_REMARK',
    );
  }

  async refinitiveResolution(
    caseSystemId: string,
    resultIdReferenceId: string,
  ): Promise<any> {
    this.logger.log(this.refinitiveResolution.name);

    const refinitiveUrl =
      this.REFINITIVE_BASE_URL + `v2/cases/${caseSystemId}/results/resolution`;

    const payload = {
      resultIds: JSON.parse(resultIdReferenceId),
      statusId: this.REFINITIV_STATUS_ID,
      riskId: this.REFINITIV_RISK_ID,
      reasonId: this.REFINITIV_REASON_ID,
      resolutionRemark: this.REFINITIV_RESOLUTION_REMARK,
    };

    const responseData: object = await lastValueFrom(
      this.httpService
        .put(refinitiveUrl, JSON.stringify(payload), this.requestConfig)
        .pipe(
          map((response) => {
            return response;
          }),
        ),
    );

    return responseData;
  }

  getSanctionDetails(name: string) {
    this.logger.log(this.getSanctionDetails.name);
    try {
      //Below is a mock data
      return {
        id: 'ajakshdashdasda',
        firstName: 'Sumit',
        lastName: 'Kumar',
        status: 'ACTIVE',
        createdAt: '12/01/2023',
        updatedAt: '12/02/2023',
      };
      //TBD for the payloand, need to implement and fine tune this based on rifinitive API doc once available
      //return this.httpService.get(this.configService.rifinitiveURl, { name });
    } catch (err) {
      this.logger.error(err.stack);
      throw err;
    }
  }

  async getRefinitiv(
    name: string,
    gender: string,
    dob: string,
    countryName: string,
  ): Promise<any> {
    const refinitiveUrl =
      this.REFINITIVE_BASE_URL + 'v2/cases/screeningRequest';
    const payload = await getRefinitivePayload(
      this.REFINITIVE_GROUP_ID,
      name,
      gender,
      dob,
      countryName,
    );

    const authHeaders = await generateAuthorizationHeaders(
      this.REFINITIVE_API_KEY,
      this.REFINITIVE_API_SECRET,
      'POST',
      refinitiveUrl,
      this.REFINITIVE_CONTENT_TYPE,
      JSON.stringify(payload),
    );
    await this.populateRequestConfig(authHeaders);

    this.logger.log('refinitive service requestConfig');
    this.logger.log(this.requestConfig);

    let responseStatusCode: number;
    let responseStatusText: string;
    const responseData: object = await lastValueFrom(
      this.httpService
        .post(refinitiveUrl, JSON.stringify(payload), this.requestConfig)
        .pipe(
          map((response) => {
            responseStatusCode = response.status;
            responseStatusText = response.statusText;
            if (response.status !== 200) {
              this.logger.error(
                `Refinitive Service received a ${response.status} status code`,
              );
              return;
            }
            return response.data;
          }),
        ),
    );
    if (!responseData && this.IS_MOCK_REFINITIVE_DATA) {
      this.logger.warn('Using Mock Refinitive Data');
      // return MockData.mockRefinitiveResponse;
      return MockData.mockRefinitiveResponseNew;
    }

    this.intergratorErrorMappingService.validateHttpCode(
      responseStatusCode,
      responseStatusText,
      IntegratorName.REFINITIV,
      EndpointName.SCREENING_REQUEST,
    );

    return responseData;
  }

  async populateRequestConfig(authHeaders: any) {
    this.requestConfig = {
      headers: {
        'Content-Type': this.REFINITIVE_CONTENT_TYPE,
        'Content-Length': authHeaders['Content-Length'],
        Date: authHeaders['Date'],
        Authorization: authHeaders['Authorization'],
      },
    };
  }
}
