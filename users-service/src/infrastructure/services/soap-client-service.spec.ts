import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { IntegratorErrorMappingService } from '../../modules/error-mapping/integrator-error-mapping.service';
import { SoapService } from './soap-client.service';
import soapRequest from 'easy-soap-request';
import { ResponseErrorMessages } from '../../domain/enum/response-error-messages';
import { AxiosError, AxiosResponse } from 'axios';
import { SchoolAggregatorConnectionError } from '../controllers/common/errors/school-aggregator-connection.error';
jest.mock('easy-soap-request', () => jest.fn());

describe('soapClientService', () => {
  let service: SoapService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SoapService,
        ConfigService,
        {
          provide: IntegratorErrorMappingService,
          useValue: createMock<IntegratorErrorMappingService>(),
        },
      ],
    }).compile();

    service = module.get<SoapService>(SoapService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return approvalid and externalRequestId', async () => {
    (soapRequest as any).mockImplementation(() => ({
      response: {
        body: `<?xml version="1.0" encoding="UTF-8"?>
        <ns0:customervalidationresponse
          xmlns:ns0="http://www.ericsson.com/em/emm/financial/v1_0">
          <approvalid>1211788</approvalid>
        </ns0:customervalidationresponse>`,
        statusCode: 200,
      },
    }));
    const res = await service.mtnOptIn('+256', '777777777');
    expect(res).toEqual(
      expect.objectContaining({
        approvalid: '1211788',
        externalRequestId: expect.any(String),
      }),
    );
    expect(res.externalRequestId).not.toContain('-');
  });
  it('should throw HTTP Code error', async () => {
    (soapRequest as any).mockImplementation(() => {
      throw new AxiosError(
        'err msg',
        'ERR_BAD_RESPONSE',
        undefined,
        undefined,
        { status: 504 } as AxiosResponse,
      );
    });
    const res = service.mtnOptIn('+256', '777777777');
    await expect(res).rejects.toThrow(
      new Error(ResponseErrorMessages.INVALID_HTTP_CODE),
    );
  });
  it('should throw XML not parseable error', async () => {
    (soapRequest as any).mockImplementation(() => ({
      response: {
        body: `This is not XML`,
        statusCode: 200,
      },
    }));
    const res = service.mtnOptIn('+256', '777777777');
    await expect(res).rejects.toThrow(
      new Error(ResponseErrorMessages.ERROR_PARSING_XML_RESPONSE_BODY),
    );
  });
  it('should throw errorCode from response from MTN Opt In', async () => {
    (soapRequest as any).mockImplementation(() => ({
      response: {
        body: `<?xml version="1.0" encoding="UTF-8"?>
        <ns0:errorResponse
          xmlns:ns0="http://www.ericsson.com/lwac" errorcode="VALIDATION_ERROR">
          <arguments name="externalrequestid" value="invalid length. The length must be at least 1 characters long"/>
          <arguments name="message" value="Request: CustomerValidationRequest violates constraints!"/>
        </ns0:errorResponse>`,
        statusCode: 500,
      },
    }));
    const res = service.mtnOptIn('+256', '777777777');
    await expect(res).rejects.toThrow(
      new Error('Telco Error Response: VALIDATION_ERROR'),
    );
  });
  it('should return mockData if IS_MOCK_MTN_OPT_IN=true and statusCode 504', async () => {
    service['IS_MOCK_MTN_OPT_IN'] = true;
    (soapRequest as any).mockImplementation(() => ({
      response: {
        statusCode: 504,
      },
    }));
    const res = await service.mtnOptIn('+256', '777777777');
    expect(res).toEqual(
      expect.objectContaining({
        approvalid: 'MTNapprovalId123',
        externalRequestId: expect.any(String),
      }),
    );
  });
  it('should return mockData if IS_MOCK_MTN_OPT_IN=true and statusCode 500 with error code', async () => {
    service['IS_MOCK_MTN_OPT_IN'] = true;
    (soapRequest as any).mockImplementation(() => ({
      response: {
        body: `<?xml version="1.0" encoding="UTF-8"?>
        <ns0:errorResponse
          xmlns:ns0="http://www.ericsson.com/lwac" errorcode="VALIDATION_ERROR">
          <arguments name="externalrequestid" value="invalid length. The length must be at least 1 characters long"/>
          <arguments name="message" value="Request: CustomerValidationRequest violates constraints!"/>
        </ns0:errorResponse>`,
        statusCode: 500,
      },
    }));
    const res = await service.mtnOptIn('+256', '777777777');
    expect(res).toEqual(
      expect.objectContaining({
        approvalid: 'MTNapprovalId123',
        externalRequestId: expect.any(String),
      }),
    );
  });
  it('should return mockData if IS_MOCK_MTN_OPT_IN=true and statusCode 500 with error code', async () => {
    service['IS_MOCK_MTN_OPT_IN'] = true;
    (soapRequest as any).mockImplementation(() => ({
      response: {
        body: `<?xml version="1.0" encoding="UTF-8"?>
        <ns0:errorResponse
          xmlns:ns0="http://www.ericsson.com/lwac" errorcode="VALIDATION_ERROR">
          <arguments name="externalrequestid" value="invalid length. The length must be at least 1 characters long"/>
          <arguments name="message" value="Request: CustomerValidationRequest violates constraints!"/>
        </ns0:errorResponse>`,
        statusCode: 500,
      },
    }));
    const res = await service.mtnOptIn('+256', '777777777');
    expect(res).toEqual(
      expect.objectContaining({
        approvalid: 'MTNapprovalId123',
        externalRequestId: expect.any(String),
      }),
    );
  });

  describe('SchoolPay Whitelisting', () => {
    it('should return proper response if schoolpay response is non-empty', async () => {
      (soapRequest as any).mockImplementation(() => ({
        response: {
          body: `<?xml version='1.0' encoding='UTF-8'?>
          <S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">
              <S:Body>
                  <ns2:ChannelServiceResponse xmlns:ns2="http://channelws.soap.webservices.sunlyteesb.servicecops.com/">
                      <return>
                          <returnCode>0</returnCode>
                          <returnMessage>Request has been processed successfully</returnMessage>
                          <serviceOutput>
                              <exportParameters>
                                  <entry>
                                      <key>OUT_PHONE_ANALYSIS_RESPONSE_JSON</key>
                                      <value>{&quot;lastTransaction&quot;:{&quot;firstName&quot;:&quot;Nassuuna&quot;,&quot;lastName&quot;:&quot;Daphine&quot;,&quot;amount&quot;:30000,&quot;paymentCode&quot;:1002798183,&quot;registrationNumber&quot;:&quot;&quot;,&quot;middleName&quot;:&quot;&quot;,&quot;transactionDate&quot;:&quot;2021-02-26 09:57:42&quot;,&quot;schoolName&quot;:&quot;NUMASA SECONDARY SCHOOL&quot;},&quot;studentPaymentsAggregate&quot;:[{&quot;firstName&quot;:&quot;Nassuuna&quot;,&quot;lastName&quot;:&quot;Daphine&quot;,&quot;paymentCode&quot;:1002798183,&quot;countOfPaymentsInLastYear&quot;:6,&quot;middleName&quot;:&quot;&quot;,&quot;sumOfPaymentsInLastYear&quot;:753668376}],&quot;studentsPaidFor&quot;:[{&quot;classCode&quot;:&quot;__ARCHIVE__&quot;,&quot;firstName&quot;:&quot;Nassuuna&quot;,&quot;lastName&quot;:&quot;Daphine&quot;,&quot;minimumAcceptableAmount&quot;:0,&quot;gender&quot;:&quot;F&quot;,&quot;paymentCode&quot;:&quot;1002798183&quot;,&quot;registrationNumber&quot;:&quot;&quot;,&quot;middleName&quot;:&quot;&quot;,&quot;schoolName&quot;:&quot;NUMASA SECONDARY SCHOOL&quot;,&quot;activeFees&quot;:0}]}</value>
                                  </entry>
                              </exportParameters>
                          </serviceOutput>
                      </return>
                  </ns2:ChannelServiceResponse>
              </S:Body>
          </S:Envelope>`,
          statusCode: 200,
        },
      }));

      const res = await service.checkStudentWhitelist(
        '123',
        '999999999',
        'reference123',
      );
      const expectedResponse = {
        lastTransaction: {
          amount: 30000,
          firstName: 'Nassuuna',
          lastName: 'Daphine',
          middleName: '',
          paymentCode: 1002798183,
          registrationNumber: '',
          schoolName: 'NUMASA SECONDARY SCHOOL',
          transactionDate: '2021-02-26 09:57:42',
        },
        responseStatusCode: '0',
        responseStatusMessage: 'Request has been processed successfully',
        studentPaymentsAggregate: [
          {
            countOfPaymentsInLastYear: 6,
            firstName: 'Nassuuna',
            lastName: 'Daphine',
            middleName: '',
            paymentCode: 1002798183,
            sumOfPaymentsInLastYear: 753668376,
          },
        ],
        studentsPaidFor: [
          {
            activeFees: 0,
            classCode: '__ARCHIVE__',
            firstName: 'Nassuuna',
            gender: 'F',
            lastName: 'Daphine',
            middleName: '',
            minimumAcceptableAmount: 0,
            paymentCode: '1002798183',
            registrationNumber: '',
            schoolName: 'NUMASA SECONDARY SCHOOL',
          },
        ],
        whitelisted: 'Y',
      };
      expect(res).toEqual(expectedResponse);
    });
    it('should return proper response if schoolpay response is empty (whitelisted should be N)', async () => {
      (soapRequest as any).mockImplementation(() => ({
        response: {
          body: `<?xml version='1.0' encoding='UTF-8'?>
          <S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">
              <S:Body>
                  <ns2:ChannelServiceResponse xmlns:ns2="http://channelws.soap.webservices.sunlyteesb.servicecops.com/">
                      <return>
                          <returnCode>0</returnCode>
                          <returnMessage>Request has been processed successfully</returnMessage>
                          <serviceOutput>
                              <exportParameters>
                                  <entry>
                                      <key>OUT_PHONE_ANALYSIS_RESPONSE_JSON</key>
                                      <value>{&quot;studentPaymentsAggregate&quot;:[],&quot;studentsPaidFor&quot;:[]}</value>
                                  </entry>
                              </exportParameters>
                          </serviceOutput>
                      </return>
                  </ns2:ChannelServiceResponse>
              </S:Body>
          </S:Envelope>`,
          statusCode: 200,
        },
      }));

      const res = await service.checkStudentWhitelist(
        '123',
        '999999999',
        'reference123',
      );
      const expectedResponse = {
        studentPaymentsAggregate: [],
        studentsPaidFor: [],
        responseStatusCode: '0',
        responseStatusMessage: 'Request has been processed successfully',
        whitelisted: 'Y',
      };
      expect(res).toEqual(expectedResponse);
    });
    it('should return proper response if schoolpay phone number invalid', async () => {
      (soapRequest as any).mockImplementation(() => ({
        response: {
          body: `<?xml version='1.0' encoding='UTF-8'?>
          <S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">
              <S:Body>
                  <ns2:ChannelServiceResponse xmlns:ns2="http://channelws.soap.webservices.sunlyteesb.servicecops.com/">
                      <return>
                          <returnCode>100</returnCode>
                          <returnMessage>Invalid phone number</returnMessage>
                          <serviceOutput>
                              <exportParameters/>
                          </serviceOutput>
                      </return>
                  </ns2:ChannelServiceResponse>
              </S:Body>
          </S:Envelope>`,
          statusCode: 200,
        },
      }));

      const res = await service.checkStudentWhitelist(
        '123',
        '999999999',
        'reference123',
      );
      const expectedResponse = {
        responseStatusCode: '100',
        responseStatusMessage: 'Invalid phone number',
        whitelisted: 'Y',
      };
      expect(res).toEqual(expectedResponse);
    });
    it('should return proper response if http status 504', async () => {
      (soapRequest as any).mockImplementation(() => ({
        response: {
          body: `<html>Gateway Timeout</html>`,
          statusCode: 504,
        },
      }));

      const res = service.checkStudentWhitelist(
        '123',
        '999999999',
        'reference123',
      );
      await expect(res).rejects.toThrow(SchoolAggregatorConnectionError);
    });
  });
});
