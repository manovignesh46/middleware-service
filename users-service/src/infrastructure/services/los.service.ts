import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { EndpointName } from '../../modules/error-mapping/endpoint-name.enum';
import { ILOSService } from '../../domain/services/losService.interface';
import { LOSOutcomeDTO } from '../controllers/customers/dtos/losOutcome.dto';
import { RunWorkFlowDTO } from '../controllers/customers/dtos/runApiLOSOutcome.dto';
import { IntegratorErrorMappingService } from '../../modules/error-mapping/integrator-error-mapping.service';
import { IntegratorName } from '../../modules/error-mapping/IntegratorName.enum';
import { IntegratorError } from '../../modules/error-mapping/integrator.error';
@Injectable()
export class LOSService implements ILOSService {
  private LOS_BASE_URL: string;
  private LOS_CONTENT_TYPE: string;
  private LOS_PARTNER_CODE: string;
  private OS: string;
  private LOS_PACKAGE_ID: string;
  private LOS_TOKEN: string;
  private requestConfig: AxiosRequestConfig;
  private respon: string;

  private readonly logger = new Logger(LOSService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private integratorErrorMappingService: IntegratorErrorMappingService,
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

    this.respon = JSON.stringify({
      uuid: '1a98eab5-f03e-4cbd-b439-6c633b74024a',
      actions: [
        {
          uuid: '57ecde5a-e1ef-45e3-ae6b-3c73d4ed91d0',
          action: 'Lead Creation',
          workflow_item: {
            id: 78,
            partner_configuration_id: 1,
            workflow_id: 53,
            target_type: 'Customer',
            target_id: 88,
            payload: {
              NIN: '93858944833493',
              name: 'Harshith',
              email: 'harshith@yabx.co',
              msisdn: '8147728808',
              lead_id: '3434',
              customer_id: 88,
              lead_status: 'created',
              partner_code: 'yabxstaging_in',
              product_type: 'installment',
              target_msisdn: '8147728808',
            },
            status: 'running',
            uuid: '1a98eab5-f03e-4cbd-b439-6c633b74024a',
            created_at: '2023-04-05T07:52:02.116Z',
            updated_at: '2023-04-05T07:52:02.147Z',
            msisdn: '8147728808',
          },
          payload: {
            NIN: '93858944833493',
            name: 'Harshith',
            email: 'harshith@yabx.co',
            msisdn: '8147728808',
            lead_id: '3434',
            customer_id: 88,
            lead_status: 'created',
            partner_code: 'yabxstaging_in',
            product_type: 'installment',
            target_msisdn: '8147728808',
          },
        },
      ],
    });
  }

  async cancelWorkflow(fullMsisdn: string, reason?: string): Promise<any> {
    const runWorkflowUrl: string = this.LOS_BASE_URL + '/api/workflow/cancel';

    this.logger.log(this.cancelWorkflow.name);

    const reqbody = {
      msisdn: fullMsisdn,
      reason: reason,
    };

    const responseData: boolean = await lastValueFrom(
      this.httpService.post(runWorkflowUrl, reqbody, this.requestConfig).pipe(
        map((response) => {
          return response.status === HttpStatus.OK;
        }),
      ),
    );

    this.logger.log('Cancel workflow response ', responseData);

    return responseData;
  }

  async interactionTarget(uuid: string): Promise<any> {
    this.logger.log(this.interactionTarget.name);

    const interactionTargetUrl: string =
      this.LOS_BASE_URL + '/api/workflow/interactions' + '?uuid=' + uuid;

    const responseData: object = await lastValueFrom(
      this.httpService.get(interactionTargetUrl, this.requestConfig).pipe(
        map((response) => {
          this.integratorErrorMappingService.validateHttpCode(
            response.status,
            response.statusText,
            IntegratorName.LOS,
            EndpointName.INTERACTION_TARGET,
          );
          this.integratorErrorMappingService.validateResponseBodyStatusCodeAndErrorCode(
            response.data,
            IntegratorName.LOS,
            EndpointName.INTERACTION_TARGET,
          );
          return response.data;
        }),
      ),
    );

    this.logger.log(this.interactionTarget.name + ' Response Data:');
    try {
      this.logger.log(JSON.stringify(responseData));
    } catch (e) {
      this.logger.warn('Unable to stringify LOS response: ');
      this.logger.log(responseData);
    }

    return responseData;
  }

  async interactionOutcome(
    secondaryUUID: string,
    losOutcomeDTO: LOSOutcomeDTO,
  ): Promise<boolean> {
    this.logger.log(this.interactionOutcome.name);
    const interactionOutcomeUrl: string =
      this.LOS_BASE_URL +
      '/api/workflow/interaction_outcome' +
      '?uuid=' +
      secondaryUUID;

    this.logger.log(interactionOutcomeUrl);

    this.logger.log(' Users service losOutcomeDTO');
    this.logger.log(losOutcomeDTO);

    const responseData: number = await lastValueFrom(
      this.httpService
        .put(
          interactionOutcomeUrl,
          JSON.stringify(losOutcomeDTO),
          this.requestConfig,
        )
        .pipe(
          map((response) => {
            this.integratorErrorMappingService.validateHttpCode(
              response?.status,
              response.statusText,
              IntegratorName.LOS,
              EndpointName.INTERACTION_OUTCOME,
            );
            this.integratorErrorMappingService.validateResponseBodyStatusCodeAndErrorCode(
              response.data,
              IntegratorName.LOS,
              EndpointName.INTERACTION_OUTCOME,
            );
            return response.status;
          }),
        ),
    );

    return responseData === 200;
  }

  async runWorkFlow(runWorkFlowDTO: RunWorkFlowDTO): Promise<any> {
    const runWorkflowUrl: string = this.LOS_BASE_URL + '/api/workflow/run';

    this.logger.debug(runWorkflowUrl);
    this.logger.log('runWorkFlowDTO');
    this.logger.log(runWorkFlowDTO);

    const responseData: object = await lastValueFrom(
      this.httpService
        .post(
          runWorkflowUrl,
          JSON.stringify(runWorkFlowDTO),
          this.requestConfig,
        )
        .pipe(
          map((response) => {
            this.logger.debug(response?.data);
            this.integratorErrorMappingService.validateHttpCode(
              response.status,
              response.statusText,
              IntegratorName.LOS,
              EndpointName.INITIATE_WORKFLOW,
            );
            this.integratorErrorMappingService.validateResponseBodyStatusCodeAndErrorCode(
              response.data,
              IntegratorName.LOS,
              EndpointName.INITIATE_WORKFLOW,
            );
            if (
              response?.data?.actions?.length == 0 ||
              response?.data?.status === 'finished'
            ) {
              throw new IntegratorError(
                `Initiate workflow failed, possibly due to existing entry in LOS`,
                IntegratorName.LOS,
                EndpointName.INITIATE_WORKFLOW,
                null,
                null,
                'workflow finished',
              );
            }
            return response.data;
          }),
        ),
    );

    this.logger.log(responseData);

    return responseData;
  }

  async getCustomerLoans(dataToCRM: any): Promise<any> {
    this.logger.log('Get Customer loan data from CRM ', dataToCRM);
    try {
      //Below is a mock data
      return {
        summary: [
          {
            productType: 'EDUCATION',
            studentName: 'Albert John',
            dueDate: '12/06/2023',
            loanAmount: '22000',
          },
          {
            productType: 'EDUCATION',
            studentName: 'Albert John',
            dueDate: '12/07/2023',
            loanAmount: '22000',
          },
          {
            productType: 'EDUCATION',
            studentName: 'Albert John',
            dueDate: '12/08/2023',
            loanAmount: '22000',
          },
        ],
        limit: 3,
        offset: 1,
        totalCount: 3,
        loanId: '5a8a78a0-d43e-11ed-afa1-0242ac120002',
        customerId: '926e32b8-2704-428e-9649-5b31757772ea',
        lastTransactionDate: '12/03/2023',
        status: 'ACTIVE',
        updatedAt: '2023-02-06T05:47:34.963Z',
        createdAt: '2023-02-06T05:47:34.963Z',
      };
      //TBD for the payload, need to implement and fine tune this based on LOS API doc once available
      //return this.httpService.get(this.configService.LOSURL, { name });
    } catch (err) {
      this.logger.error(err.stack);
      throw err;
    }
  }
}
