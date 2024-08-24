import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { ILMSService } from '../../domain/service/lmsService.interface';
import { LOSRepayLoanDto } from '../controllers/requests/dtos/repay-loan.dto';
import { LMSLoanCalculatorDTO } from '../controllers/requests/dtos/LMSLoanCalculator.dto';
import { LMSFormData } from '../controllers/requests/dtos/lmsFormData.dto';
import { Agent } from 'https';

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
        os: 'web_application',
        'package-id': this.LMS_PACKAGE_ID,
        Authorization: 'Bearer ' + this.LMS_TOKEN,
      },
      httpsAgent: new Agent({ rejectUnauthorized: false }),
    };
  }

  async loanDetailStatement(msisdn: string, loanId: string): Promise<any> {
    const dashboardUrl: string =
      this.LMS_BASE_URL + '/apis/v1/loans/' + loanId + '/statement';

    const requestBody = { msisdn: msisdn };

    const responseData: object = await lastValueFrom(
      this.httpService.post(dashboardUrl, requestBody, this.requestConfig).pipe(
        map((response) => {
          if (response.status === 500) {
            throw new Error(
              'The given loan reference is not valid, so no loan statement is available',
            );
          }
          return response.data.data;
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
            return response.data.data;
          }),
        ),
    );

    return responseData;
  }

  async repayLoan(repayLoanDto: LOSRepayLoanDto) {
    this.logger.log(this.repayLoan.name);

    const repayLoanBaseUrl =
      this.LMS_BASE_URL + '/apis/v1/loans/trigger_instant_repayment';

    const requestBody = JSON.stringify(repayLoanDto);
    this.logger.log(`Request Body: ${requestBody}`);

    const response = await lastValueFrom(
      this.httpService.post(repayLoanBaseUrl, requestBody, this.requestConfig),
    );
    this.logger.log(`Response from LOS Repay Loan:`);
    this.logger.log(JSON.stringify(response.status));
    this.logger.log(JSON.stringify(response.data));

    if (response.status !== HttpStatus.OK) {
      this.logger.error(`Error response from LOS during Loan Repayment:`);
      this.logger.error(`HTTP Status Code: ${response?.status}`);
      this.logger.error(response?.data);
      throw new Error('Error Sending LOS request for loan repayment');
    }

    return response?.data;
  }

  async loanCalculator(
    lmsLoanCalculatorDTO: LMSLoanCalculatorDTO,
  ): Promise<any> {
    this.logger.log(this.loanCalculator.name);

    const loanCalculatorUrl: string =
      this.LMS_BASE_URL + '/apis/v1/loans/calculate';

    console.log(loanCalculatorUrl);

    this.logger.log('Request service loanCalculator');
    this.logger.log(lmsLoanCalculatorDTO);

    const responseData: number = await lastValueFrom(
      this.httpService
        .post(loanCalculatorUrl, lmsLoanCalculatorDTO, this.requestConfig)
        .pipe(
          map((response) => {
            console.log(response.data);
            return response.data.data;
          }),
        ),
    );

    return responseData;
  }

  async applicationFormData(
    loanId: string,
    payload: any,
  ): Promise<LMSFormData> {
    this.logger.log(this.applicationFormData.name);

    const applicationFormUrl: string =
      this.LMS_BASE_URL + `/apis/v1/loans/${loanId}/details`;

    this.logger.log(applicationFormUrl);

    const responseData: LMSFormData = await lastValueFrom(
      this.httpService
        .post(applicationFormUrl, payload, this.requestConfig)
        .pipe(
          map((response) => {
            if (response?.data?.code === 2000) return response?.data?.data;
            else throw new Error('The given loan reference is not valid');
          }),
        ),
    );
    this.logger.debug('LMS Application Form Data');
    this.logger.debug(responseData);

    return responseData;
  }
}
