import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { ResponseStatusCode } from '../../domain/enum/responseStatusCode.enum';
import { ICustomerServiceClient } from '../../domain/service/customer-service-client.service.interface';
import { CustomerIdCardDetailsDTO } from '../controllers/requests/dtos/customerIdCardDetails.dto';
import { OfferDetailsDTO } from '../controllers/requests/dtos/offerDetails.dto';
import { SelfieLivenessDTO } from '../controllers/requests/dtos/selfieLiveness.dto';
import { StudentDetailsDTO } from '../controllers/requests/dtos/studentDetails.dto';
@Injectable()
export class CustomerServiceClient implements ICustomerServiceClient {
  private logger = new Logger(CustomerServiceClient.name);
  private customersServiceHostname: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.customersServiceHostname = this.configService.get<string>(
      'CUSTOMERS_SERVICE_HOSTNAME',
    );
  }

  async terminateOngoingLoan(custId: string): Promise<boolean> {
    this.logger.log(this.terminateOngoingLoan.name);

    const path = `/customers/terminate/loans/${custId}`;
    const url = new URL(this.customersServiceHostname);
    url.pathname += path;
    try {
      const response = (
        await lastValueFrom(this.httpService.get(url.toString()))
      ).data;

      if (response?.status === ResponseStatusCode.SUCCESS) {
        return response?.data;
      } else {
        this.logger.error(
          `Error making request to customers service terminate ongoing loan workflow customer`,
        );
        throw new Error(
          response?.message ||
            'Error when terminate ongoing loan workflowr Customer',
        );
      }
    } catch (err) {
      this.logger.error(err.stack);
      throw err;
    }
  }

  async getMsisdn(customerId: string) {
    this.logger.log(this.getMsisdn.name);
    const path = `/customers/${customerId}/msisdn`;
    const url = new URL(this.customersServiceHostname);
    url.pathname += path;
    try {
      const response = (
        await lastValueFrom(this.httpService.get(url.toString()))
      ).data;

      if (response?.status === ResponseStatusCode.SUCCESS) {
        return response?.data;
      } else {
        this.logger.error(
          `Error making request to customers service to retrieve Msisdn for customer`,
        );
        throw new Error(
          response?.message || 'Error when retreiving Msisdn for Customer',
        );
      }
    } catch (err) {
      this.logger.error(err.stack);
      throw err;
    }
  }
  async getTargetApiUUID(customerId: string): Promise<string> {
    const path = `/customers/${customerId}/target-api-uuid/`;
    const url = new URL(this.customersServiceHostname);
    url.pathname += path;
    try {
      const response = (
        await lastValueFrom(this.httpService.get(url.toString()))
      ).data;

      if (response?.status === ResponseStatusCode.SUCCESS) {
        return response?.data?.targetApiUuid;
      } else {
        this.logger.error(
          `Error making request to customers service to retreive Target API UUID`,
        );
        throw new Error(
          response?.message || 'Error when retreiving Target API UUID',
        );
      }
    } catch (err) {
      this.logger.error(err.stack);
      throw err;
    }
  }

  async getIdCardDetails(
    customerId: string,
  ): Promise<CustomerIdCardDetailsDTO> {
    const path = `/customers/idCardDetails/${customerId}`;
    const url = new URL(this.customersServiceHostname);
    url.pathname += path;

    const responseData: CustomerIdCardDetailsDTO = await lastValueFrom(
      this.httpService.get(url.toString()).pipe(
        map((response) => {
          if (response?.data.status === ResponseStatusCode.SUCCESS)
            return response.data.data;
        }),
      ),
    );

    return responseData;
  }

  async getCustomerSelfieLiveness(
    customerId: string,
  ): Promise<SelfieLivenessDTO> {
    const path = `/customers/selfieLiveness/${customerId}`;
    const url = new URL(this.customersServiceHostname);
    url.pathname += path;

    const responseData: SelfieLivenessDTO = await lastValueFrom(
      this.httpService.get(url.toString()).pipe(
        map((response) => {
          if (response?.data.status === ResponseStatusCode.SUCCESS)
            return response.data.data;
        }),
      ),
    );

    return responseData;
  }

  async getOfferDetails(offerId: string): Promise<OfferDetailsDTO> {
    const path = `/customers/offerVariant/${offerId}`;
    const url = new URL(this.customersServiceHostname);
    url.pathname += path;

    const responseData: OfferDetailsDTO = await lastValueFrom(
      this.httpService.get(url.toString()).pipe(
        map((response) => {
          if (response?.data.status === ResponseStatusCode.SUCCESS)
            return response.data.data;
        }),
      ),
    );

    return responseData;
  }

  async getStudentDetails(
    studentPCOId: string,
    custId: string,
  ): Promise<StudentDetailsDTO> {
    const path = `/customers/studentDetails/${studentPCOId}/${custId}`;
    const url = new URL(this.customersServiceHostname);
    url.pathname += path;

    const responseData: StudentDetailsDTO = await lastValueFrom(
      this.httpService.get(url.toString()).pipe(
        map((response) => {
          if (response?.data.status === ResponseStatusCode.SUCCESS)
            return response.data.data;
        }),
      ),
    );

    return responseData;
  }
}
