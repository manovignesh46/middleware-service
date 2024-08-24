import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { randomUUID } from 'crypto';
import { lastValueFrom, map } from 'rxjs';
import { Gender } from '../../domain/enum/gender.enum';
import { ResponseMessage } from '../../domain/enum/responseMessage.enum';
import { WhitelistStatus } from '../../domain/enum/whitelistStatus.enum';
import { ICustOtp } from '../../domain/model/custOtp.interface';
import { IWhitelistedStudentDetails } from '../../domain/model/whitelistedStudentDetails.interface';
import { IWhitelistedStudentDetailsRepository } from '../../domain/repository/whitelistedStudentDetailsRepository.interface';
import { IntegratorName } from '../../modules/error-mapping/IntegratorName.enum';
import { SchoolAggregatorConnectionError } from '../controllers/common/errors/school-aggregator-connection.error';
import { SchoolPayWhitelistResponse } from '../controllers/customers/dtos/schoolpay-whitelisting-response.dto';
import {
  WhitelistedDTO,
  WhiteListedStudentDetailsDTO,
} from '../controllers/customers/dtos/whitelisted.dto';
import { WhitelistedStudentDetails } from '../entities/whitelistedStudentDetails.entity';
import { MockData } from './mockData';
import { SoapService } from './soap-client.service';

@Injectable()
export class AggregatorWhiteListingService {
  private logger = new Logger(AggregatorWhiteListingService.name);
  private WHITELISTED_BASE_URL: string;
  private WHITELISTED_SCHOOLPAY_URL: string;
  private WHITELISTED_PEGPAY_URL: string;
  private requestConfig: AxiosRequestConfig;
  private IS_MOCK_SCHOOLPAY_WHITELISTING: boolean;
  private IS_MOCK_PEGPAY_WHITELISTING: boolean;
  private SCHOOL_WHITELISTING_CHECK: boolean;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly whitelistedStudentDetailsRepository: IWhitelistedStudentDetailsRepository,
    private readonly soapService: SoapService,
  ) {
    this.WHITELISTED_BASE_URL = this.configService.get<string>(
      'WHITELISTED_BASE_URL',
    );
    this.WHITELISTED_SCHOOLPAY_URL = this.configService.get<string>(
      'WHITELISTED_SCHOOLPAY_URL',
    );
    this.WHITELISTED_PEGPAY_URL = this.configService.get<string>(
      'WHITELISTED_PEGPAY_URL',
    );
    this.IS_MOCK_SCHOOLPAY_WHITELISTING =
      this.configService.get<string>('IS_MOCK_SCHOOLPAY_WHITELISTING') ===
      'true';
    this.SCHOOL_WHITELISTING_CHECK =
      this.configService.get<string>('SCHOOL_WHITELISTING_CHECK') === 'true';
    this.IS_MOCK_PEGPAY_WHITELISTING =
      this.configService.get<string>('IS_MOCK_PEGPAY_WHITELISTING') === 'true';
    this.requestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async getSchoolpayWhiteListing(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<any> {
    this.logger.log(this.getSchoolpayWhiteListing.name);
    msisdnCountryCode = msisdnCountryCode.replace('+', '');
    const whitelistedSchoolPayFullURL =
      this.WHITELISTED_BASE_URL +
      this.WHITELISTED_SCHOOLPAY_URL +
      `?countrycode=${msisdnCountryCode}&msisdn=${msisdn}`;

    this.logger.log('WhiteList api for schoolPay');
    this.logger.log(msisdnCountryCode + msisdn);
    this.logger.log(whitelistedSchoolPayFullURL);

    const responseData: any = await lastValueFrom(
      this.httpService
        .get(whitelistedSchoolPayFullURL, this.requestConfig)
        .pipe(
          map((response) => {
            console.log('WhiteList schoolPay api response');
            return response.data[0];
          }),
        ),
    );

    this.logger.log('WhiteList schoolPay api response');
    this.logger.log(responseData);

    return responseData;
  }

  /**
   * @description Makes a call to SchoolPay Actual / Mock Server / Both depending on the value of IS_WHITELISTING_MOCK
   */
  async getSchoolpayWhiteListingV2(
    msisdnCountryCode: string,
    msisdn: string,
    isWhitelistedSchoolFound: boolean,
  ) {
    this.logger.log(this.getSchoolpayWhiteListingV2.name);
    const whitelistRequestReference = randomUUID();
    //Used to determine if the SchoolPay response is from Mock or Actual Server
    let serverType: 'ACTUAL' | 'MOCK';
    let schoolPayWhitelistResponse:
      | SchoolPayWhitelistResponse //Actual Server Response
      | WhitelistedDTO; //Mock Server Response
    try {
      if (
        this.IS_MOCK_SCHOOLPAY_WHITELISTING &&
        this.SCHOOL_WHITELISTING_CHECK &&
        !isWhitelistedSchoolFound
      ) {
        this.logger.log('SchoolPay Whitelist Call (Mock Server)');
        serverType = 'MOCK';
        schoolPayWhitelistResponse = (await this.getSchoolpayWhiteListing(
          msisdnCountryCode,
          msisdn,
        )) as WhitelistedDTO;
      }

      if (
        isWhitelistedSchoolFound ||
        schoolPayWhitelistResponse?.whitelisted === 'Y'
      ) {
        this.logger.log('SchoolPay Whitelist Call (Actual Server)');
        serverType = 'ACTUAL';
        schoolPayWhitelistResponse =
          (await this.soapService.checkStudentWhitelist(
            msisdnCountryCode,
            msisdn,
            whitelistRequestReference,
          )) as SchoolPayWhitelistResponse;

        this.logger.log('Inside aggregator service');
        this.logger.log('schoolpay whitelist response');
        this.logger.log(schoolPayWhitelistResponse);
      }
      //Make call to actual SchoolPay Server
      // this.logger.log('SchoolPay Whitelist Call (Actual Server)');
      // serverType = 'ACTUAL';
      // schoolPayWhitelistResponse =
      //   (await this.soapService.checkStudentWhitelist(
      //     msisdnCountryCode,
      //     msisdn,
      //     whitelistRequestReference,
      //   )) as SchoolPayWhitelistResponse;

      // this.logger.log('Inside aggregator service');
      // this.logger.log('schoolpay whitelist response');
      // this.logger.log(schoolPayWhitelistResponse);

      // this.logger.log(
      //   'IS_MOCK_SCHOOLPAY_WHITELISTING value: ' +
      //   this.IS_MOCK_SCHOOLPAY_WHITELISTING,
      // );

      // //If Whitelisted is 'N'/undefined and IS_MOCK_SCHOOLPAY_WHITELISTING, then get student data from mock server
      // if (
      //   this.IS_MOCK_SCHOOLPAY_WHITELISTING &&
      //   schoolPayWhitelistResponse.whitelisted != 'Y'
      // ) {
      //   this.logger.log('SchoolPay Whitelist Call (Mock Server)');
      //   serverType = 'MOCK';
      //   schoolPayWhitelistResponse = (await this.getSchoolpayWhiteListing(
      //     msisdnCountryCode,
      //     msisdn,
      //   )) as WhitelistedDTO;
      // }
    } catch (e) {
      // if (
      //   e instanceof SchoolAggregatorConnectionError &&
      //   this.IS_MOCK_SCHOOLPAY_WHITELISTING
      // ) {
      //   this.logger.log('SchoolPay Whitelist Call (Mock Server)');
      //   serverType = 'MOCK';
      //   //Get data from mock server if actual server is down
      //   schoolPayWhitelistResponse = (await this.getSchoolpayWhiteListing(
      //     msisdnCountryCode,
      //     msisdn,
      //   )) as WhitelistedDTO;
      // } else {
      throw e;
      // }
    }
    return {
      schoolPayWhitelistResponse,
      serverType,
      whitelistRequestReference,
    };
  }

  /**
   * @description Takes in schoolpay response from either Actual or Mock server and transforms to
   * Whitelisted student detail entity and saves into DB
   * @param serverType
   * @param schoolPayWhitelistResponse
   * @param updatedLead
   * @param whitelistRequestReference
   * @returns
   */
  async parseAndSaveAnySchoolPayResponse(
    serverType: string,
    schoolPayWhitelistResponse: SchoolPayWhitelistResponse | WhitelistedDTO,
    updatedLead: ICustOtp,
    whitelistRequestReference: string,
  ) {
    //Only applies to Actual Server Response
    if (serverType == 'ACTUAL') {
      //Cast to Type SchoolPayWhitelistResponse
      schoolPayWhitelistResponse =
        schoolPayWhitelistResponse as SchoolPayWhitelistResponse;
      await this.transformAndSaveActualSchoolpayWhitelistData(
        schoolPayWhitelistResponse,
        updatedLead.leadId,
        whitelistRequestReference,
      );
    }

    //Only applies to Mock Server Response
    if (serverType == 'MOCK') {
      //Cast to Type WhitelistedDTO
      schoolPayWhitelistResponse = schoolPayWhitelistResponse as WhitelistedDTO;
      if (
        schoolPayWhitelistResponse?.student_details &&
        schoolPayWhitelistResponse?.student_details?.length
      ) {
        for await (const studentDetails of schoolPayWhitelistResponse?.student_details) {
          const entity =
            await this.transformMockResponseToWhitelistedStudentDetailsEntity(
              updatedLead.leadId,
              studentDetails,
              'SCHOOL_PAY',
            );
          entity.lastPaymentAmount =
            schoolPayWhitelistResponse.last_payment_amount;
          entity.lastPaymentDate = schoolPayWhitelistResponse.last_payment_date;
          await this.whitelistedStudentDetailsRepository.save(entity);
        }
      }
    }
    return schoolPayWhitelistResponse;
  }

  async transformAndSaveActualSchoolpayWhitelistData(
    schoolpayResponseData: SchoolPayWhitelistResponse,
    leadId: string,
    requestReference: string,
  ) {
    this.logger.log(this.transformAndSaveActualSchoolpayWhitelistData.name);
    if (schoolpayResponseData?.studentsPaidFor?.length) {
      for (const student of schoolpayResponseData?.studentsPaidFor) {
        //Find Associated Student Payments Aggregate
        const studentPaymentsAggregate =
          schoolpayResponseData.studentPaymentsAggregate?.find(
            (data) => data.paymentCode == student.paymentCode,
          );

        //Last Transaction will be not null if the last payment is for that student
        const lastTransaction =
          schoolpayResponseData.lastTransaction.paymentCode ==
          student.paymentCode
            ? schoolpayResponseData.lastTransaction
            : null;

        const whitelistedStudent: IWhitelistedStudentDetails = {
          studentId: undefined, //Auto-Generated
          associatedCustomerId: undefined,
          aggregatorId: IntegratorName.SCHOOL_PAY,
          requestReferenceNumber: requestReference,
          responseStatusCode: schoolpayResponseData.responseStatusCode,
          responseStatusMessage: schoolpayResponseData.responseStatusMessage,
          studentSchoolRegnNumber: student.registrationNumber,
          studentFullName: student.middleName
            ? `${student.firstName} ${student.middleName} ${student.lastName}`
            : `${student.firstName} ${student.lastName}`,
          studentFirstName: student.firstName,
          studentMiddleName: student.middleName,
          studentSurname: student.lastName,
          studentDob: undefined, //Not received in response
          studentDateCreated: undefined, //Not received in response
          studentGender:
            student.gender && student.gender == 'M'
              ? Gender.MALE
              : Gender.FEMALE,
          studentClass: student.classCode,
          studentSchoolCode: undefined, //Not received in response
          schoolName: student.schoolName,
          currentSchoolFees: +student.activeFees || undefined, //converting string to number | undefined
          minPayableMode: undefined, //Not received in response
          minPayableAmount: +student.minimumAcceptableAmount || undefined,
          studentPaymentCode: student.paymentCode,
          studentPCOId: undefined,
          isCustomerConfirmed: false,
          isStudentDeleted: false,
          isLOSUpdated: false,
          isLOSDeleted: false,
          leadId: leadId,
          currentStatus: WhitelistStatus.WHITELISTING,
          term1Fee: 0,
          term2Fee: 0,
          term3Fee: 0,
          termsAcademicYear: undefined,
          totalTermsFee:
            +studentPaymentsAggregate?.sumOfPaymentsInLastYear || undefined, //convert string to number | undefined
          lastPaymentAmount: +lastTransaction?.amount || undefined,
          lastPaymentDate: lastTransaction?.transactionDate,
          paymentsCount:
            +studentPaymentsAggregate?.countOfPaymentsInLastYear || undefined,
          createdAt: undefined,
          updatedAt: undefined,
        };

        const addedStudent =
          await this.whitelistedStudentDetailsRepository.save(
            whitelistedStudent,
          );
        this.logger.debug(`Added Student: ${addedStudent.studentId}`);
      }
    }
  }

  async transformMockResponseToWhitelistedStudentDetailsEntity(
    leadId: string,
    whitelistStudentDTO: WhiteListedStudentDetailsDTO,
    aggregatorId: string,
  ): Promise<WhitelistedStudentDetails> {
    this.logger.log(
      this.transformMockResponseToWhitelistedStudentDetailsEntity.name,
    );
    const entity: IWhitelistedStudentDetails = new WhitelistedStudentDetails();
    entity.leadId = leadId;
    entity.aggregatorId = aggregatorId;
    entity.studentFullName = whitelistStudentDTO.studentName;
    entity.studentSchoolCode = whitelistStudentDTO.schoolCode;
    entity.schoolName = whitelistStudentDTO.schoolName;
    entity.studentSchoolRegnNumber = whitelistStudentDTO.studentRegnNumber;
    entity.studentGender =
      whitelistStudentDTO.studentGender === 'MALE'
        ? Gender.MALE
        : Gender.FEMALE;
    entity.studentClass = whitelistStudentDTO.studentClass;
    entity.termsAcademicYear = whitelistStudentDTO.term_year;
    entity.term1Fee = whitelistStudentDTO.term_1_fee;
    entity.term2Fee = whitelistStudentDTO.term_2_fee;
    entity.term3Fee = whitelistStudentDTO.term_3_fee;
    entity.totalTermsFee =
      whitelistStudentDTO.term_1_fee +
      whitelistStudentDTO.term_2_fee +
      whitelistStudentDTO.term_3_fee;
    entity.currentStatus = WhitelistStatus.WHITELISTING;
    entity.isStudentDeleted = false;
    entity.isCustomerConfirmed = false;
    entity.isLOSDeleted = false;
    entity.isLOSUpdated = false;
    return entity;
  }

  async getPegpayWhiteListing(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<any> {
    this.logger.log(this.getPegpayWhiteListing.name);
    if (!this.IS_MOCK_PEGPAY_WHITELISTING) {
      /*If this.IS_MOCK_PEGPAY_WHITELISTING=false, then return null. 
      Once actual pegpay whitelist server is working, then call actual server here*/
      return null;
    }

    msisdnCountryCode = msisdnCountryCode.replace('+', '');
    const whitelistedPegpayFullURL =
      this.WHITELISTED_BASE_URL +
      this.WHITELISTED_PEGPAY_URL +
      `?countrycode=${msisdnCountryCode}&msisdn=${msisdn}`;

    this.logger.log('WhiteList api for pegPay');
    this.logger.log(msisdnCountryCode + msisdn);
    this.logger.log(whitelistedPegpayFullURL);

    const responseData: any = await lastValueFrom(
      this.httpService.get(whitelistedPegpayFullURL, this.requestConfig).pipe(
        map((response) => {
          console.log('WhiteList pegPay api response');
          return response.data[0];
        }),
      ),
    );

    this.logger.log('WhiteList pegPay api response');
    this.logger.log(responseData);
    return responseData;
  }

  async parseAndSavePegpayResponse(
    pegPaywhitelistResponse: WhitelistedDTO,
    updatedLead: ICustOtp,
  ) {
    this.logger.log(this.parseAndSavePegpayResponse.name);
    if (
      pegPaywhitelistResponse?.student_details &&
      pegPaywhitelistResponse?.student_details?.length
    ) {
      for await (const studentDetails of pegPaywhitelistResponse?.student_details) {
        const entity =
          await this.transformMockResponseToWhitelistedStudentDetailsEntity(
            updatedLead.leadId,
            studentDetails,
            'PEGPAY',
          );
        entity.lastPaymentAmount = pegPaywhitelistResponse.last_payment_amount;
        entity.lastPaymentDate = pegPaywhitelistResponse.last_payment_date;
        await this.whitelistedStudentDetailsRepository.save(entity);
      }
    }
  }

  checkWhitelistResponse(
    schoolPayWhitelistResponse: SchoolPayWhitelistResponse | WhitelistedDTO,
    pegPaywhitelistResponse: WhitelistedDTO,
  ) {
    let isWhitelisted: boolean;
    let whitelistMsg: string;
    if (schoolPayWhitelistResponse || pegPaywhitelistResponse) {
      if (
        schoolPayWhitelistResponse?.whitelisted === 'Y' ||
        pegPaywhitelistResponse?.whitelisted === 'Y'
      ) {
        isWhitelisted = true;
      } else {
        isWhitelisted = false;
        whitelistMsg = ResponseMessage.WHITE_LISTED_ERROR;
      }
    } else {
      isWhitelisted = false;
      whitelistMsg = ResponseMessage.WHITE_LISTED_NOT_PRESENT;
    }

    const whiteListedJSON = {
      schoolPay: schoolPayWhitelistResponse?.whitelisted || 'N',
      pegPay: pegPaywhitelistResponse?.whitelisted || 'N',
    };
    return { isWhitelisted, whitelistMsg, whiteListedJSON };
  }
}
