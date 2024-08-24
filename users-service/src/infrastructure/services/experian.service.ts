import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import path from 'path';
import { lastValueFrom } from 'rxjs';
import { ExperianRequestType } from '../../domain/enum/experian-request-type.enum';
import { IdType } from '../../domain/enum/id-type.enum';
import { IExperianData } from '../../domain/model/experian-data.interface';
import { ICustPrimaryDetailsRepository } from '../../domain/repository/custPrimaryDetailsRepository.interface';
import { IExperianDataRepository } from '../../domain/repository/experian-data-repository.interface';
import {
  IExperianService,
  KycEnquiryDto,
} from '../../domain/services/experian-service.interface';
import { getTimestamp } from '../../usecases/helpers';
import { ExperianData } from '../entities/experian-data.entity';

@Injectable()
export class ExperianService implements IExperianService {
  private logger = new Logger(ExperianService.name);
  private EXPERIAN_BASE_URL: string;
  private BRANCH_CODE: string;
  private USERNAME: string;
  private PASSWORD: string;
  private EXPERIAN_VALID_DAYS: number;
  private IS_MOCK_EXPERIAN_DATA: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly experianRequestRepository: IExperianDataRepository,
    private readonly custPrimaryDetailsRepo: ICustPrimaryDetailsRepository,
  ) {
    this.EXPERIAN_BASE_URL = configService.get<string>('EXPERIAN_BASE_URL');
    this.BRANCH_CODE = configService.get<string>('EXPERIAN_BRANCH_CODE');
    this.USERNAME = configService.get<string>('EXPERIAN_USERNAME');
    this.PASSWORD = configService.get<string>('EXPERIAN_PASSWORD');
    this.EXPERIAN_VALID_DAYS =
      configService.get<number>('EXPERIAN_VALID_DAYS') || 180;
    this.IS_MOCK_EXPERIAN_DATA =
      configService.get<string>('IS_MOCK_EXPERIAN_DATA') === 'true';
  }
  async kycEnquiry(kycEnquiryDto: KycEnquiryDto): Promise<void> {
    this.logger.log(this.kycEnquiry.name);

    const kycUrl = new URL(this.EXPERIAN_BASE_URL);
    kycUrl.pathname = path.join(kycUrl.pathname, '/bureau/ind/kyc/enquiry/v4');

    const { idType, idValue, nationalIdNumber } = kycEnquiryDto;
    const isConsent = kycEnquiryDto?.isConsent === true; //is false if isConsent is undefined / false
    let existingActiveExperianEntry: IExperianData =
      await this.experianRequestRepository.getByIdTypeIdValueAndIsActive(
        idType,
        idValue,
      );

    //Possible the previous experian request was when CUST was still a LEAD
    if (!existingActiveExperianEntry && idType === IdType.CUSTOMER) {
      const custPrimaryDetails =
        await this.custPrimaryDetailsRepo.getCustomerByCustomerId(idValue);

      existingActiveExperianEntry =
        await this.experianRequestRepository.getByIdTypeIdValueAndIsActive(
          IdType.LEAD,
          custPrimaryDetails.leadId,
        );
    }
    let newExperianRequest: IExperianData = new ExperianData();

    //If prev entry exists
    if (existingActiveExperianEntry) {
      //If still valid, return
      const isExperianDataValid = this.checkExperianValidity(
        existingActiveExperianEntry.createdAt,
      );
      if (isExperianDataValid) {
        this.logger.log('Experian not called as previous entry still valid');
        return;
      }

      //get client ref num and set new entry w old client ref num
      newExperianRequest.clientReferenceNumber =
        existingActiveExperianEntry.clientReferenceNumber;
    } else {
      //if not exists then create new client ref num
      newExperianRequest.clientReferenceNumber =
        this.generateClientReferenceNumber(idValue);
    }

    // POST Request Body
    const requestBody = {
      data: {
        client_reference_number: newExperianRequest.clientReferenceNumber,
        has_consent: isConsent ? 1 : 0,
        source: '0',
        identifiers: [
          {
            id_number: nationalIdNumber,
            id_number_type: 'COUNTRYID',
            country: 'UG',
          },
        ],
      },
      authorization: {
        branchcode: this.BRANCH_CODE,
        username: this.USERNAME,
        password: this.PASSWORD,
      },
    };

    //Store new experian request
    newExperianRequest.idType = idType;
    newExperianRequest.idValue = idValue;
    newExperianRequest.requestType = ExperianRequestType.KYCV4;
    newExperianRequest.requestBody = JSON.stringify({
      ...requestBody,
      authorization: 'redacted', //Don't save authorization details
    });
    newExperianRequest = await this.experianRequestRepository.create(
      newExperianRequest,
    );

    //make request to experian
    let response: AxiosResponse;
    try {
      this.logger.log('Start Request to Experian KYC Endpoint');
      const startTime = Date.now();
      response = await lastValueFrom(
        this.httpService.post(kycUrl.href, requestBody),
      );
      const endTime = Date.now();
      const latency = endTime - startTime;
      this.logger.log(`End Request to Experian KYC Endpoint +${latency}ms`);
      newExperianRequest.latency = latency;
    } catch (err) {
      this.logger.error('Error communicating with Experian KYC Endpoint');
      this.logger.error(err.stack);
      if (this.IS_MOCK_EXPERIAN_DATA) {
        await this.injectMockExperianData(
          newExperianRequest,
          existingActiveExperianEntry,
        );
        return;
      } else {
        throw new Error('Experian Error');
      }
    }
    if (response?.status == 200) {
      //if success, then set isActive true
      newExperianRequest.isActive = true;

      //set old entry to isActive false
      if (existingActiveExperianEntry) {
        existingActiveExperianEntry.isActive = false;
        await this.experianRequestRepository.update(
          existingActiveExperianEntry,
        );
      }
      this.logger.log(response?.data);
    } else {
      if (this.IS_MOCK_EXPERIAN_DATA) {
        await this.injectMockExperianData(
          newExperianRequest,
          existingActiveExperianEntry,
        );
        return;
      }

      //if request fail, set isActive false
      newExperianRequest.isActive = false;
      this.logger.error(`Request failed with status code: ${response?.status}`);
      this.logger.error(response?.data);
    }

    //Update new experian response data
    newExperianRequest.experianData = JSON.stringify(response?.data);
    newExperianRequest.responseStatusCode = response?.status?.toString();
    newExperianRequest = await this.experianRequestRepository.update(
      newExperianRequest,
    );
  }

  /**
   * @description Saves a mock experian response entry into DB.
   * If a previous experian entry exists, it sets the older entry to isActive=false
   * @param newExperianRequest
   * @param existingActiveExperianEntry
   */
  private async injectMockExperianData(
    newExperianRequest: IExperianData,
    existingActiveExperianEntry: IExperianData,
  ) {
    this.logger.log(this.injectMockExperianData.name);
    this.logger.warn('Injecting Mock Experian Data');
    const mockExperianEntry: IExperianData = {
      ...newExperianRequest,
      isActive: true,
      responseStatusCode: '200',
      experianData: 'MOCK_DATA',
    };
    await this.experianRequestRepository.update(mockExperianEntry);

    //set old entry to isActive false
    if (existingActiveExperianEntry) {
      existingActiveExperianEntry.isActive = false;
      await this.experianRequestRepository.update(existingActiveExperianEntry);
    }
    return;
  }

  private checkExperianValidity(experianDataDate: Date): boolean {
    const differenceInMilliseconds = Date.now() - experianDataDate.getTime();
    const differenceInDays = Math.ceil(
      differenceInMilliseconds / (1000 * 3600 * 24),
    );
    const experianIsValid = differenceInDays < this.EXPERIAN_VALID_DAYS;
    this.logger.log(`Experian data valid for ${this.EXPERIAN_VALID_DAYS} days`);
    this.logger.log(
      `Experian data isValid: ${experianIsValid}. Latest experian entry was ${differenceInDays} days ago on ${experianDataDate}`,
    );
    return experianIsValid;
  }

  private generateClientReferenceNumber(custId: string) {
    return custId + getTimestamp();
  }
}
