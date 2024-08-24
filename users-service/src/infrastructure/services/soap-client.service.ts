import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { ValidateStudentAccountSunlyteDto } from '../controllers/customers/dtos/validate-student-account-sunlyte.dto';
import { getTimestamp } from '../../usecases/helpers';
import soapRequest from 'easy-soap-request';
import convert from 'xml-js';
import {
  mockPegpayResponse,
  PegpayGetStudentDetailsResponseDto,
} from '../controllers/customers/dtos/pegpay-get-student-details.response.dto';
import { createSign, randomUUID } from 'node:crypto';
import path from 'path';
import { SchoolAggregatorConnectionError } from '../controllers/common/errors/school-aggregator-connection.error';
import { IntegratorErrorMappingService } from '../../modules/error-mapping/integrator-error-mapping.service';
import { EndpointName } from '../../modules/error-mapping/endpoint-name.enum';
import { IntegratorName } from '../../modules/error-mapping/IntegratorName.enum';
import { MockData } from './mockData';
import { AxiosError, AxiosResponseHeaders } from 'axios';
import { ResponseErrorMessages } from '../../domain/enum/response-error-messages';
import { SchoolPayWhitelistResponse } from '../controllers/customers/dtos/schoolpay-whitelisting-response.dto';

@Injectable()
export class SoapService {
  constructor(
    private readonly configService: ConfigService,
    private integratorErrorMappingService: IntegratorErrorMappingService,
  ) {}
  private logger = new Logger(SoapService.name);

  //SchoolPay Constants
  private SCHOOL_PAY_BASE_URL =
    this.configService.get('SUNLYTE_BASE_URL') ||
    'https://sunlytetest.servicecops.com';
  private SCHOOL_PAY_GET_STUDENT_DETAILS_PATH =
    this.configService.get('SUNLYTE_GET_STUDENT_DETAILS_PATH') ||
    '/sunlyte-test/ChannelSoapWs';
  private SCHOOL_PAY_CHANNEL_CODE =
    this.configService.get('SUNLYTE_CHANNEL_CODE') || 'STANCHAT';
  private SCHOOL_PAY_SERVICE_CODE =
    this.configService.get('SUNLYTE_SERVICE_CODE') ||
    'STANDCHART_SCHOOLPAY_STUDENT_VALIDATION';
  private SCHOOLPAY_WHITELIST_SERVICE_CODE =
    this.configService.get('SCHOOLPAY_WHITELIST_SERVICE_CODE') ||
    'STANCHART_PAYER_CREDIT_ANALYSIS';
  private SCHOOL_PAY_ENTRY_KEY =
    this.configService.get('SUNLYTE_ENTRY_KEY') || 'IN_STUDENT_PAYMENT_CODE';

  //PegPay Constants
  private PEGPAY_BASE_URL =
    this.configService.get<string>('PEGPAY_BASE_URL') ||
    'https://test.pegasus.co.ug:9108';
  private PEGPAY_UTILITY_VALUE =
    this.configService.get('PEGPAY_UTILITY_VALUE') || 'FLEXIPAY';
  private PEGPAY_VENDOR_CODE =
    this.configService.get('PEGPAY_VENDOR_CODE') || 'FURAHA';
  private IS_MOCK_PEGPAY_STUDENT_DETAILS =
    this.configService.get<string>('IS_MOCK_PEGPAY_STUDENT_DETAILS') ===
      'true' || false;
  private IS_MOCK_SCHOOLPAY_STUDENT_DETAILS =
    this.configService.get<string>('IS_MOCK_SCHOOLPAY_STUDENT_DETAILS') ===
      'true' || false;

  //MTN Constants
  private OPT_IN_MTN_BASE_URL = this.configService.get('OPT_IN_MTN_BASE_URL');
  private OPT_IN_MTN_ENDPOINT = this.configService.get('OPT_IN_MTN_ENDPOINT');
  private OPT_IN_MTN_TOKEN = this.configService.get('OPT_IN_MTN_TOKEN');
  private IS_MOCK_MTN_OPT_IN =
    this.configService.get('IS_MOCK_MTN_OPT_IN') === 'true';
  private MTN_OPT_IN_MSG = this.configService.get('MTN_OPT_IN_MSG');

  //Secrets
  private SCHOOL_PAY_API_KEY =
    this.configService.get('SUNLYTE_API_KEY') || 'st4nch4rt';
  private PEGPAY_API_KEY =
    this.configService.get('PEGPAY_API_KEY') || '18D22YF670';
  private PEGPAY_RSA_PRIVATE_KEY = this.configService.get(
    'PEGPAY_RSA_PRIVATE_KEY',
  );
  async validateSchoolPayStudentAccount(
    studentAccountNumber: string,
    requestReference: string,
  ): Promise<ValidateStudentAccountSunlyteDto> {
    this.logger.log(this.validateSchoolPayStudentAccount.name);
    const { messageSignature, currentTimestamp } =
      this.getSchoolPayMessageSignature();
    const url = new URL(this.SCHOOL_PAY_BASE_URL);
    url.pathname = path.join(
      url.pathname,
      this.SCHOOL_PAY_GET_STUDENT_DETAILS_PATH,
    );
    const headers = {
      'Content-Type': 'text/xml; charset=utf-8',
    };
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:chan="http://channelws.soap.webservices.sunlyteesb.servicecops.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <chan:ChannelService>
         <request>
            <authorization>
               <channelCode>${this.SCHOOL_PAY_CHANNEL_CODE}</channelCode>
               <channelRequestDigest>${messageSignature}</channelRequestDigest>
               <channelRequestTimestamp>${currentTimestamp}</channelRequestTimestamp>
            </authorization>
            <request>
               <serviceCode>${this.SCHOOL_PAY_SERVICE_CODE}</serviceCode>
               <requestReference>${requestReference}</requestReference>
               <serviceInputs>
                  <importParams>
                    <entry>
                      <key>${this.SCHOOL_PAY_ENTRY_KEY}</key>
                      <value>${studentAccountNumber}</value>
                    </entry>           
                   </importParams>                
               </serviceInputs>
            </request>
         </request>
      </chan:ChannelService>
   </soapenv:Body>
</soapenv:Envelope>
`;

    this.logger.log('School Pay Request Headers and Body:');
    this.logger.log(headers);
    this.logger.log(xml);
    let response: any;
    try {
      ({ response } = await soapRequest({
        url: url.toString(),
        headers,
        xml,
        timeout: 20000,
      }));
    } catch (err) {
      this.logger.error(err);
      const errorMessage = 'Error connecting to SchoolPay';
      this.logger.error(errorMessage);
      this.logger.warn(
        'If this is a development environment you can mock the Schoolpay response by setting IS_MOCK_SCHOOLPAY_STUDENT_DETAILS=true',
      );
      throw new SchoolAggregatorConnectionError(errorMessage);
    }
    this.logger.log(response);
    const { body: responseXml, statusCode: responseStatusCode } = response;
    this.printAxiosResponse(response);

    if (responseStatusCode !== HttpStatus.OK) {
      const errorMessage = `Response Status code from School Pay is ${responseStatusCode}`;
      this.logger.error(errorMessage);
      this.logger.warn(
        'If this is a development environment you can mock the School Pay response by setting IS_MOCK_SCHOOLPAY_STUDENT_DETAILS=true',
      );
      throw new SchoolAggregatorConnectionError(
        errorMessage,
        responseStatusCode,
      );
    }

    let responseJson: any;
    try {
      const json = JSON.parse(convert.xml2json(responseXml, { compact: true }));
      responseJson = json['S:Envelope']['S:Body']['ns2:ChannelServiceResponse'];
    } catch (e) {
      this.logger.error(e.stack);
      this.logger.warn(
        'If this is a development environment you can mock the School Pay response by setting IS_MOCK_SCHOOLPAY_STUDENT_DETAILS=true',
      );

      throw new SchoolAggregatorConnectionError(
        'Error occurred when parsing School Pay response body xml',
      );
    }

    if (responseJson?.return?.returnCode?._text != 0) {
      this.logger.error(
        `Response code from Sunlyte is ${responseJson?.return?.returnCode?._text}`,
      );
      this.integratorErrorMappingService.validateResponseBodyStatusCodeAndErrorCode(
        responseJson,
        IntegratorName.SCHOOL_PAY,
        EndpointName.GET_STUDENT_DETAILS,
      );
      return {
        responseStatusCode: responseJson?.return?.returnCode?._text,
        responseStatusMessage: responseJson?.return?.returnMessage?._text,
      } as ValidateStudentAccountSunlyteDto;
    }

    this.logger.debug('Response JSON:');
    this.logger.debug(responseJson);
    const responseEntryArray =
      responseJson?.return?.serviceOutput?.exportParameters?.entry;
    const parsedResponseJson = this.keyValueArrayToObject(responseEntryArray);
    this.logger.log('Parsed JSON Key Value Pairs:');
    this.logger.log(parsedResponseJson);

    return {
      ...parsedResponseJson,
      responseStatusCode: responseJson?.return?.returnCode?._text,
      responseStatusMessage: responseJson?.return?.returnMessage?._text,
    } as ValidateStudentAccountSunlyteDto;
  }

  /**
   * Makes a request to the SchoolPay API to get a list of whitelisted students.
   * @param msisdnCountryCode The country code associated with the MSISDN.
   * @param msisdn The MSISDN of the user.
   * @param requestReference A reference string for the request.
   * @returns A Promise that resolves with the list of whitelisted students.
   * @throws {SchoolAggregatorConnectionError} If an error occurs during the request.
   * Make sure to catch error and return mock data if IS_MOCK_SCHOOLPAY_WHITELISTING=true
   */
  async checkStudentWhitelist(
    msisdnCountryCode: string,
    msisdn: string,
    requestReference: string,
  ): Promise<SchoolPayWhitelistResponse> {
    this.logger.log(this.checkStudentWhitelist.name);
    const fullMsisdn = (msisdnCountryCode + msisdn).replace('+', '');
    const { messageSignature, currentTimestamp } =
      this.getSchoolPayMessageSignature();
    const url = new URL(this.SCHOOL_PAY_BASE_URL);
    url.pathname = path.join(
      url.pathname,
      this.SCHOOL_PAY_GET_STUDENT_DETAILS_PATH, //Whitelist API path is the same as Get Student Details
    );
    const headers = {
      'Content-Type': 'text/xml; charset=utf-8',
    };
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:chan="http://channelws.soap.webservices.sunlyteesb.servicecops.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <chan:ChannelService>
         <request>
            <authorization>
               <channelCode>${this.SCHOOL_PAY_CHANNEL_CODE}</channelCode>
               <channelRequestDigest>${messageSignature}</channelRequestDigest>
               <channelRequestTimestamp>${currentTimestamp}</channelRequestTimestamp>
            </authorization>
            <request>
               <serviceCode>${this.SCHOOLPAY_WHITELIST_SERVICE_CODE}</serviceCode>
               <requestReference>${requestReference}</requestReference>
               <serviceInputs>
                  <importParams>
                    <entry>
                      <key>IN_PHONE_NUMBER</key>
                      <value>${fullMsisdn}</value>
                    </entry>           
                   </importParams>                
               </serviceInputs>
            </request>
         </request>
      </chan:ChannelService>
   </soapenv:Body>
</soapenv:Envelope>
`;
    this.printRequestXmlAndHeaders(
      headers,
      xml,
      IntegratorName.SCHOOL_PAY,
      EndpointName.WHITELIST,
    );

    let response: any;
    try {
      ({ response } = await soapRequest({
        url: url.toString(),
        headers,
        xml,
        timeout: 20000,
      }));
    } catch (err) {
      this.logger.error(err);
      const errorMessage = 'Error connecting to SchoolPay';
      this.logger.error(errorMessage);
      this.logger.warn(
        'If this is a development environment you can mock the SchoolPay whitelist response by setting IS_MOCK_SCHOOLPAY_WHITELISTING=true',
      );
      throw new SchoolAggregatorConnectionError(errorMessage);
    }
    this.logger.log(response);
    const { body: responseXml, statusCode: responseStatusCode } = response;
    this.printAxiosResponse(response);

    if (responseStatusCode !== HttpStatus.OK) {
      const errorMessage = `Response Status code from School Pay is ${responseStatusCode}`;
      this.logger.error(errorMessage);
      this.logger.warn(
        'If this is a development environment you can mock the School Pay response by setting IS_MOCK_SCHOOLPAY_WHITELISTING=true',
      );
      throw new SchoolAggregatorConnectionError(
        errorMessage,
        responseStatusCode,
      );
    }

    let responseJson: any;
    try {
      const json = JSON.parse(convert.xml2json(responseXml, { compact: true }));
      responseJson = json['S:Envelope']['S:Body']['ns2:ChannelServiceResponse'];
    } catch (e) {
      this.logger.error(e.stack);
      this.logger.warn(
        'If this is a development environment you can mock the School Pay response by setting IS_MOCK_SCHOOLPAY_WHITELISTING=true',
      );

      throw new SchoolAggregatorConnectionError(
        'Error occurred when parsing School Pay response body xml',
      );
    }

    // if (responseJson?.return?.returnCode?._text != 0) {
    //   //100 error code indicates no entry for given MSISDN
    //   if (responseJson?.return?.returnCode?._text == 100) {
    //     //Return whitelisted = 'N'
    //     return {
    //       responseStatusCode: responseJson?.return?.returnCode?._text,
    //       responseStatusMessage: responseJson?.return?.returnMessage?._text,
    //       whitelisted: 'N',
    //     } as SchoolPayWhitelistResponse;
    //   }
    //   this.logger.error(
    //     `Response code from Sunlyte is ${responseJson?.return?.returnCode?._text}`,
    //   );
    //   this.integratorErrorMappingService.validateResponseBodyStatusCodeAndErrorCode(
    //     responseJson,
    //     IntegratorName.SCHOOL_PAY,
    //     EndpointName.WHITELIST,
    //   );
    //   return {
    //     responseStatusCode: responseJson?.return?.returnCode?._text,
    //     responseStatusMessage: responseJson?.return?.returnMessage?._text,
    //   } as SchoolPayWhitelistResponse;
    // }

    this.logger.debug('Response JSON:');
    this.logger.debug(responseJson);
    const outputKey =
      responseJson?.return?.serviceOutput?.exportParameters?.entry?.key?._text;
    const outputValue =
      responseJson?.return?.serviceOutput?.exportParameters?.entry?.value
        ?._text;
    let parsedOutputValue: any;
    try {
      if (outputValue) {
        parsedOutputValue = JSON.parse(outputValue);
      }
    } catch (err) {
      this.logger.error('Unable to parse the response string to JSON:');
      this.logger.error(outputValue);
      throw err;
    }

    this.logger.log('Response Object:');
    this.logger.log(parsedOutputValue);

    //If there are no 'studentsPaidFor' for that phone number, then treat as not whitelisted
    // if (!parsedOutputValue?.studentsPaidFor?.length) {
    //   return {
    //     responseStatusCode: responseJson?.return?.returnCode?._text,
    //     responseStatusMessage: responseJson?.return?.returnMessage?._text,
    //     whitelisted: 'N',
    //   } as SchoolPayWhitelistResponse;
    // }

    return {
      ...parsedOutputValue,
      responseStatusCode: responseJson?.return?.returnCode?._text,
      responseStatusMessage: responseJson?.return?.returnMessage?._text,
      whitelisted: 'Y',
    } as SchoolPayWhitelistResponse;
  }

  async retrievePegPayStudentDetails(
    studentId: string,
    schoolCode: string,
  ): Promise<PegpayGetStudentDetailsResponseDto> {
    this.logger.log(this.retrievePegPayStudentDetails.name);
    const url = new URL(this.PEGPAY_BASE_URL);
    url.pathname = path.join(
      url.pathname,
      '/livepegasusaggregation/billpaymentslV1/',
    );
    this.logger.debug(`Pegpay URL: ${url.toString()}`);
    const headers = {
      SoapAction: 'http://pegpaypaymentsapi/QuerySchoolDetails',
      'Content-Type': 'text/xml',
    };
    const pegpayMessageSignature = this.getPegPayMessageSignature(studentId);
    const xml = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <QueryCustomerDetails xmlns="http://PegPayPaymentsApi/">
        <!-- Optional -->
        <query>
            <QueryField1>${studentId}</QueryField1>
            <QueryField3>${schoolCode}</QueryField3>
            <QueryField4>${this.PEGPAY_UTILITY_VALUE}</QueryField4>
            <QueryField5>${this.PEGPAY_VENDOR_CODE}</QueryField5>
            <QueryField6>${this.PEGPAY_API_KEY}</QueryField6>
            <QueryField8>${pegpayMessageSignature}</QueryField8>
        </query>
    </QueryCustomerDetails>
  </soap:Body>
  </soap:Envelope>`;

    this.logger.debug('Pegpay Request:');
    this.logger.debug(headers);
    this.logger.debug(xml);

    let response;
    try {
      ({ response } = await soapRequest({
        url: url.toString(),
        headers,
        xml,
        timeout: 20000,
      }));
    } catch (err) {
      const errorMessage = 'Error connecting to Pegpay';
      this.logger.error(errorMessage);
      this.logger.warn(
        'If this is a development environment you can mock the Pegpay response by setting IS_MOCK_PEGPAY_STUDENT_DETAILS=true',
      );
      this.logger.error(err.stack);
      throw new SchoolAggregatorConnectionError(errorMessage);
    }
    const { body: responseBody, statusCode: responseStatusCode } = response;
    this.printAxiosResponse(response);
    if (responseStatusCode !== HttpStatus.OK) {
      const errorMessage = `Response Status code from Pegpay is ${responseStatusCode}`;
      this.logger.error(errorMessage);
      this.logger.warn(
        'If this is a development environment you can mock the Pegpay response by setting IS_MOCK_PEGPAY_STUDENT_DETAILS=true',
      );
      throw new SchoolAggregatorConnectionError(
        errorMessage,
        responseStatusCode,
      );
    }

    let jsonResponse: any;
    try {
      jsonResponse = JSON.parse(
        convert.xml2json(responseBody, { compact: true }),
      );
    } catch (e) {
      this.logger.error(e.stack);
      this.logger.warn(
        'If this is a development environment you can mock the Pegpay response by setting IS_MOCK_PEGPAY_STUDENT_DETAILS=true',
      );
      if (this.IS_MOCK_PEGPAY_STUDENT_DETAILS) {
        this.logger.warn('Using mock pegpay data');
        return { ...mockPegpayResponse, customerRef: studentId };
      } else {
        throw new Error('Error occurred when parsing PegPay response body xml');
      }
    }
    this.logger.log('Parsed Response Body:');
    this.logger.log(jsonResponse);

    //get details from the pegpay response object
    const pegpayGetStudentDetailsResponseDto: PegpayGetStudentDetailsResponseDto =
      {
        customerRef:
          jsonResponse?.QueryCustomerDetailsResponse?.ResponseField1?._text,
        customerName:
          jsonResponse?.QueryCustomerDetailsResponse?.ResponseField2?._text,
        schoolName:
          jsonResponse?.QueryCustomerDetailsResponse?.ResponseField3?._text,
        outstandingBalance:
          jsonResponse?.QueryCustomerDetailsResponse?.ResponseField4?._text,
        studentLevel:
          jsonResponse?.QueryCustomerDetailsResponse?.ResponseField5?._text,
        studentLevelDescription:
          jsonResponse?.QueryCustomerDetailsResponse?.ResponseField6?._text,
        allowPartialPayments:
          jsonResponse?.QueryCustomerDetailsResponse?.ResponseField7?._text,
        minimumPaymentAmount:
          jsonResponse?.QueryCustomerDetailsResponse?.ResponseField8?._text,
        gender:
          jsonResponse?.QueryCustomerDetailsResponse?.ResponseField9?._text,
        studentOva:
          jsonResponse?.QueryCustomerDetailsResponse?.ResponseField10?._text,
        statusCode:
          jsonResponse?.QueryCustomerDetailsResponse?.ResponseField11?._text,
        statusDescription:
          jsonResponse?.QueryCustomerDetailsResponse?.ResponseField12?._text,
        pegpayTranId: undefined,
      };

    this.logger.log('pegpayGetStudentDetailsResponseDto:');
    this.logger.log(pegpayGetStudentDetailsResponseDto);
    this.integratorErrorMappingService.validateResponseBodyStatusCodeAndErrorCode(
      pegpayGetStudentDetailsResponseDto,
      IntegratorName.PEGPAY,
      EndpointName.GET_STUDENT_DETAILS,
    );
    return pegpayGetStudentDetailsResponseDto;
  }
  getPegPayMessageSignature(studentId: string) {
    const concatenatedString =
      this.PEGPAY_VENDOR_CODE +
      this.PEGPAY_API_KEY +
      this.PEGPAY_UTILITY_VALUE +
      studentId;
    console.log(concatenatedString);

    // Signing
    const signer = createSign('SHA1');
    signer.write(concatenatedString);
    signer.end();
    // Returns the signature in output_format which can be 'binary', 'hex' or 'base64'
    const signature = signer.sign(
      { key: this.PEGPAY_RSA_PRIVATE_KEY },
      'base64',
    );
    return signature;
  }

  //Signature and timestamp to use in the channelRequestDigest and channelRequestTimestamp respectively
  private getSchoolPayMessageSignature(): {
    messageSignature: string;
    currentTimestamp: string;
  } {
    this.logger.log(this.getSchoolPayMessageSignature.name);
    const currentTimestamp = getTimestamp();
    const stringToSign = currentTimestamp + this.SCHOOL_PAY_API_KEY;
    const messageSignature = CryptoJS.SHA256(stringToSign).toString(
      CryptoJS.enc.Hex,
    );
    return { messageSignature, currentTimestamp };
  }

  //Coverts a list of [{key: { _text: 'myKey'}, value: { _text: 'myValue'}}] objects to {myKey: myValue}
  private keyValueArrayToObject(
    keyValueObjectArray: { key: { _text: string }; value: { _text: string } }[],
  ) {
    this.logger.log(this.keyValueArrayToObject.name);
    const output = {};
    for (const item of keyValueObjectArray) {
      const key = item.key?._text;
      const value = item.value?._text;
      output[key] = value;
    }
    return output;
  }

  /*
  Makes an MTN Opt-in SOAP request

  @returns the externalRequestId (randomly generated UUID when creating the request) 
  and approvalid (from MTN response body)

  @throws Will throw an error if SOAP request timeout (20s), res HTTP code not 200, XML not able to be parsed, Response contains errorCode
  */
  async mtnOptIn(
    msisdnCountryCode: string,
    msisdn: string,
    //approvalid is not in camelCase because this defined by MTN
  ): Promise<{ approvalid: string; externalRequestId: string }> {
    this.logger.log(this.mtnOptIn.name);
    const url = new URL(this.OPT_IN_MTN_BASE_URL);
    url.pathname = path.join(url.pathname, this.OPT_IN_MTN_ENDPOINT);
    const externalRequestId = randomUUID().split('-').join(''); //externalRequestId cannot contain '-'
    const fullMsisdn = (msisdnCountryCode + msisdn).trim().replace('+', '');
    const headers = {
      Authorization: `Basic ${this.OPT_IN_MTN_TOKEN}`,
      'Content-Type': 'text/xml',
      Accept: 'text/xml',
    };
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <ns0:customervalidationrequest xmlns:ns0="http://www.ericsson.com/em/emm/financial/v1_0">
        <externalrequestid>${externalRequestId}</externalrequestid>
        <message>${this.MTN_OPT_IN_MSG}</message>
        <receiver>ID:${fullMsisdn}/MSISDN</receiver>
    </ns0:customervalidationrequest>`;

    this.logger.debug(`MTN Opt-in URL: ${url.toString()}`);
    this.logger.debug('MTN Opt-in Request:');
    this.logger.debug(headers);
    this.logger.debug(xml);

    let response;
    try {
      ({ response } = await soapRequest({
        url: url.toString(),
        headers,
        xml,
        timeout: 20000,
        extraOpts: {
          /*
          assumption: MTN success always 200, known errors 500 ('ACCOUNTHOLDER_NOT_FOUND' etc)
          Other codes treated as bad response
          */
          validateStatus: (status) => status == 200 || status == 500,
        },
      }));
    } catch (err) {
      this.logger.error('Error Connecting to MTN Opt-In Endpoint');
      this.logger.warn(
        'If this is a development environment you can mock the MTN Opt-in response by setting IS_MOCK_MTN_OPT_IN=true',
      );
      this.logger.error(err.stack);
      this.logger.error(err.code);
      if (this.IS_MOCK_MTN_OPT_IN) {
        return { ...MockData.mockMtnOptInResponse, externalRequestId };
      } else {
        if (err instanceof AxiosError) {
          switch (err.code) {
            case 'ECONNABORTED' || 'ETIMEDOUT':
              throw new Error(ResponseErrorMessages.RESPONSE_TIMEOUT);

            case 'ERR_BAD_RESPONSE':
              this.logger.error(
                `Response Status code from MTN Opt-In API is ${err?.response?.status}`,
              );
              throw new Error(ResponseErrorMessages.INVALID_HTTP_CODE);
          }
        }
        throw err; //in case no error was thrown above
      }
    }

    const { body: responseBody } = response;
    this.printAxiosResponse(response);

    let jsonResponse: any;
    let errorResponse: any;
    try {
      const parsedJson = JSON.parse(
        convert.xml2json(responseBody, { compact: true }),
      );

      //Parse error response if any
      errorResponse = parsedJson?.['ns0:errorResponse'];

      jsonResponse = parsedJson?.['ns0:customervalidationresponse'];
    } catch (e) {
      this.logger.error(e.stack);
      this.logger.warn(
        'If this is a development environment you can mock the MTN Opt-in API response by setting IS_MOCK_MTN_OPT_IN=true',
      );
      if (this.IS_MOCK_MTN_OPT_IN) {
        this.logger.warn('Using mock MTN Opt-in data');
        return { ...MockData.mockMtnOptInResponse, externalRequestId };
      } else {
        throw new Error(ResponseErrorMessages.ERROR_PARSING_XML_RESPONSE_BODY);
      }
    }

    if (errorResponse) {
      this.logger.error('Error from MTN Opt-In API:');
      this.logger.error(errorResponse);
      this.logger.warn(
        'If this is a development environment you can mock the MTN Opt-in API response by setting IS_MOCK_MTN_OPT_IN=true',
      );
      if (this.IS_MOCK_MTN_OPT_IN) {
        this.logger.warn('Using mock MTN Opt-in data');
        return { ...MockData.mockMtnOptInResponse, externalRequestId };
      }
      //To Be commented in if we need to add Business Error Handling for endpoint
      // this.integratorErrorMappingService.validateResponseBodyStatusCodeAndErrorCode(
      //   errorResponse,
      //   IntegratorName.MTN,
      //   EndpointName.OPT_IN,
      // );
      throw new Error(
        `Telco Error Response: ${errorResponse?._attributes?.errorcode}`,
      );
    }
    this.logger.log('Parsed Response Body:');
    this.logger.log(jsonResponse);

    return { approvalid: jsonResponse?.approvalid?._text, externalRequestId };
  }

  private printAxiosResponse(response: {
    headers: AxiosResponseHeaders;
    body: any;
    statusCode: number;
  }) {
    const {
      headers: responseHeaders,
      body: responseBody,
      statusCode: responseStatusCode,
    } = response;
    this.logger.log('Response Headers:');
    this.logger.log(responseHeaders);
    this.logger.log('Response Body: ');
    this.logger.log(responseBody);
    this.logger.log('Response Status Code:');
    this.logger.log(responseStatusCode);
  }

  private printRequestXmlAndHeaders(
    headers: object,
    xml: string,
    integrationName?: IntegratorName,
    endpointName?: EndpointName,
  ) {
    this.logger.debug(
      `${integrationName || ''} ${endpointName || ''} Request:`,
    );
    this.logger.debug(headers);
    this.logger.debug(xml);
  }
}
