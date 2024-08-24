import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';
import { ResponseMessage } from '../../domain/enum/responseMessage.enum';
import { mockCustOtp } from '../../domain/model/mocks/cust-otp.mock';
import { IWhitelistedStudentDetailsRepository } from '../../domain/repository/whitelistedStudentDetailsRepository.interface';
import { SchoolPayWhitelistResponse } from '../controllers/customers/dtos/schoolpay-whitelisting-response.dto';
import { mockSchoolPayWhitelistResponse } from '../controllers/customers/dtos/schoolpay-whitelisting-response.mock';
import { WhitelistedDTO } from '../controllers/customers/dtos/whitelisted.dto';
import { WhitelistedStudentDetailsRepository } from '../repository/whitelistedStudentDetails.repository';
import { AggregatorWhiteListingService } from './aggregatorWhitelisting.service';
import { SoapService } from './soap-client.service';

describe('AggregatorWhiteListingService', () => {
  let service: AggregatorWhiteListingService;
  const msisdnCountryCode = '+256';
  const msisdn = '700000000';
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AggregatorWhiteListingService,
        { provide: HttpService, useValue: createMock<HttpService>() },
        {
          provide: IWhitelistedStudentDetailsRepository,
          useValue: createMock<WhitelistedStudentDetailsRepository>(),
        },
        { provide: SoapService, useValue: createMock<SoapService>() },
        ConfigService,
      ],
    }).compile();

    service = module.get<AggregatorWhiteListingService>(
      AggregatorWhiteListingService,
    );
  });

  it('it should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getSchoolpayWhiteListing', async () => {
    service['WHITELISTED_BASE_URL'] = 'WHITELISTED_BASE_URL';
    service['WHITELISTED_SCHOOLPAY_URL'] = 'WHITELISTED_SCHOOLPAY_URL';
    jest
      .spyOn(service['httpService'], 'get')
      .mockReturnValueOnce(of({ data: ['mock response'] }) as never);
    const res = await service.getSchoolpayWhiteListing(
      msisdnCountryCode,
      msisdn,
    );
    expect(service['httpService'].get).toBeCalledWith(
      'WHITELISTED_BASE_URLWHITELISTED_SCHOOLPAY_URL?countrycode=256&msisdn=700000000',
      { headers: { 'Content-Type': 'application/json' } },
    );
    expect(res).toEqual('mock response');
  });

  it('getPegpayWhiteListing', async () => {
    service['WHITELISTED_BASE_URL'] = 'WHITELISTED_BASE_URL';
    service['WHITELISTED_PEGPAY_URL'] = 'WHITELISTED_PEGPAY_URL';
    service['IS_MOCK_PEGPAY_WHITELISTING'] = true;
    jest
      .spyOn(service['httpService'], 'get')
      .mockReturnValueOnce(of({ data: ['mock response'] }) as never);
    const res = await service.getPegpayWhiteListing(msisdnCountryCode, msisdn);
    expect(service['httpService'].get).toBeCalledWith(
      'WHITELISTED_BASE_URLWHITELISTED_PEGPAY_URL?countrycode=256&msisdn=700000000',
      { headers: { 'Content-Type': 'application/json' } },
    );
    expect(res).toEqual('mock response');
  });

  it('getSchoolpayWhiteListingV2 should indictae ACTUAL serverType when real schoolpay is hit', async () => {
    jest
      .spyOn(service['soapService'], 'checkStudentWhitelist')
      .mockResolvedValueOnce({
        whitelisted: 'Y',
      } as SchoolPayWhitelistResponse);
    const res = await service.getSchoolpayWhiteListingV2(
      msisdnCountryCode,
      msisdn,
      true,
    );
    expect(res).toEqual({
      schoolPayWhitelistResponse: { whitelisted: 'Y' },
      serverType: 'ACTUAL',
      whitelistRequestReference: expect.any(String),
    });
  });

  it('getSchoolpayWhiteListingV2 should be whitelist N whebn real server is hit and IS_MOCK_SCHOOLPAY_WHITELISTING is false', async () => {
    service['IS_MOCK_SCHOOLPAY_WHITELISTING'] = false;
    jest
      .spyOn(service['soapService'], 'checkStudentWhitelist')
      .mockResolvedValueOnce({
        whitelisted: 'N',
      } as SchoolPayWhitelistResponse);
    const res = await service.getSchoolpayWhiteListingV2(
      msisdnCountryCode,
      msisdn,
      true,
    );
    expect(res).toEqual({
      schoolPayWhitelistResponse: { whitelisted: 'N' },
      serverType: 'ACTUAL',
      whitelistRequestReference: expect.any(String),
    });
  });

  it('getSchoolpayWhiteListingV2 should indictae MOCK serverType when mock schoolpay is hit', async () => {
    service['IS_MOCK_SCHOOLPAY_WHITELISTING'] = true;
    jest
      .spyOn(service['soapService'], 'checkStudentWhitelist')
      .mockResolvedValueOnce({
        whitelisted: null,
      } as SchoolPayWhitelistResponse);

    jest
      .spyOn(service, 'getSchoolpayWhiteListing')
      .mockResolvedValueOnce({ whitelisted: 'Y' } as WhitelistedDTO);
    const res = await service.getSchoolpayWhiteListingV2(
      msisdnCountryCode,
      msisdn,
      true,
    );
    expect(res).toEqual({
      schoolPayWhitelistResponse: { whitelisted: null },
      serverType: 'ACTUAL',
      whitelistRequestReference: expect.any(String),
    });
  });

  it('checkWhitelistResponse both Y', async () => {
    const res = service.checkWhitelistResponse(
      { whitelisted: 'Y' } as SchoolPayWhitelistResponse,
      { whitelisted: 'Y' } as WhitelistedDTO,
    );

    expect(res).toEqual({
      isWhitelisted: true,
      whiteListedJSON: { pegPay: 'Y', schoolPay: 'Y' },
      whitelistMsg: undefined,
    });
  });

  it('checkWhitelistResponse SP Y PP N', async () => {
    const res = service.checkWhitelistResponse(
      { whitelisted: 'Y' } as SchoolPayWhitelistResponse,
      { whitelisted: 'N' } as WhitelistedDTO,
    );

    expect(res).toEqual({
      isWhitelisted: true,
      whiteListedJSON: { pegPay: 'N', schoolPay: 'Y' },
      whitelistMsg: undefined,
    });
  });

  it('checkWhitelistResponse SP N PP Y', async () => {
    const res = service.checkWhitelistResponse(
      { whitelisted: 'N' } as SchoolPayWhitelistResponse,
      { whitelisted: 'Y' } as WhitelistedDTO,
    );

    expect(res).toEqual({
      isWhitelisted: true,
      whiteListedJSON: { pegPay: 'Y', schoolPay: 'N' },
      whitelistMsg: undefined,
    });
  });

  it('checkWhitelistResponse both whitelisted N', async () => {
    const res = service.checkWhitelistResponse(
      { whitelisted: 'N' } as SchoolPayWhitelistResponse,
      { whitelisted: 'N' } as WhitelistedDTO,
    );

    expect(res).toEqual({
      isWhitelisted: false,
      whiteListedJSON: { pegPay: 'N', schoolPay: 'N' },
      whitelistMsg: ResponseMessage.WHITE_LISTED_ERROR,
    });
  });

  it('parseAndSavePegpayResponse', async () => {
    const repoSaveSpy = jest.spyOn(
      service['whitelistedStudentDetailsRepository'],
      'save',
    );
    await service.parseAndSavePegpayResponse(
      {
        student_details: [
          {
            studentName: 'first name',
            schoolCode: 'schCode123',
            schoolName: 'schName123',
            studentClass: 'class123',
            studentGender: 'FEMALE',
            studentRegnNumber: 'regNum123',
          },
        ],
      } as WhitelistedDTO,
      mockCustOtp,
    );
    expect(repoSaveSpy).toBeCalledWith(
      expect.objectContaining({
        aggregatorId: 'PEGPAY',
        currentStatus: 'WHITELISTING',
        isCustomerConfirmed: false,
        isLOSDeleted: false,
        isLOSUpdated: false,
        isStudentDeleted: false,
        lastPaymentAmount: undefined,
        lastPaymentDate: undefined,
        leadId: '286c78ce-a289-4a63-9d4a-7566c86ee4b1',
        schoolName: 'schName123',
        studentClass: 'class123',
        studentFullName: 'first name',
        studentGender: 'FEMALE',
        studentSchoolCode: 'schCode123',
        studentSchoolRegnNumber: 'regNum123',
        term1Fee: undefined,
        term2Fee: undefined,
        term3Fee: undefined,
        termsAcademicYear: undefined,
        totalTermsFee: NaN,
      }),
    );
  });
  it('parseAndSaveAnySchoolPayResponse with mock response', async () => {
    const repoSaveSpy = jest.spyOn(
      service['whitelistedStudentDetailsRepository'],
      'save',
    );
    await service.parseAndSaveAnySchoolPayResponse(
      'MOCK',
      {
        student_details: [
          {
            studentName: 'first name',
            schoolCode: 'schCode123',
            schoolName: 'schName123',
            studentClass: 'class123',
            studentGender: 'FEMALE',
            studentRegnNumber: 'regNum123',
          },
        ],
      } as WhitelistedDTO,
      mockCustOtp,
      'requestRef123',
    );
    expect(repoSaveSpy).toBeCalledWith(
      expect.objectContaining({
        aggregatorId: 'SCHOOL_PAY',
        currentStatus: 'WHITELISTING',
        isCustomerConfirmed: false,
        isLOSDeleted: false,
        isLOSUpdated: false,
        isStudentDeleted: false,
        lastPaymentAmount: undefined,
        lastPaymentDate: undefined,
        leadId: '286c78ce-a289-4a63-9d4a-7566c86ee4b1',
        schoolName: 'schName123',
        studentClass: 'class123',
        studentFullName: 'first name',
        studentGender: 'FEMALE',
        studentSchoolCode: 'schCode123',
        studentSchoolRegnNumber: 'regNum123',
        term1Fee: undefined,
        term2Fee: undefined,
        term3Fee: undefined,
        termsAcademicYear: undefined,
        totalTermsFee: NaN,
      }),
    );
  });
  it('parseAndSaveAnySchoolPayResponse with actual response', async () => {
    const repoSaveSpy = jest.spyOn(
      service['whitelistedStudentDetailsRepository'],
      'save',
    );
    await service.parseAndSaveAnySchoolPayResponse(
      'ACTUAL',
      mockSchoolPayWhitelistResponse,
      mockCustOtp,
      'requestRef123',
    );
    expect(repoSaveSpy).toBeCalledWith(
      expect.objectContaining({
        aggregatorId: 'SCHOOL_PAY',
        associatedCustomerId: undefined,
        createdAt: undefined,
        currentSchoolFees: 200,
        currentStatus: 'WHITELISTING',
        isCustomerConfirmed: false,
        isLOSDeleted: false,
        isLOSUpdated: false,
        isStudentDeleted: false,
        lastPaymentAmount: 100,
        lastPaymentDate: 'txnDate',
        leadId: '286c78ce-a289-4a63-9d4a-7566c86ee4b1',
        minPayableAmount: 10,
        minPayableMode: undefined,
        paymentsCount: 10,
        requestReferenceNumber: 'requestRef123',
        responseStatusCode: '200',
        responseStatusMessage: 'OK',
        schoolName: 'schName',
        studentClass: 'classCode',
        studentDateCreated: undefined,
        studentDob: undefined,
        studentFirstName: 'first',
        studentFullName: 'first middle last',
        studentGender: 'MALE',
        studentId: undefined,
        studentMiddleName: 'middle',
        studentPCOId: undefined,
        studentPaymentCode: 'paymentCode',
        studentSchoolCode: undefined,
        studentSchoolRegnNumber: 'regNum',
        studentSurname: 'last',
        term1Fee: 0,
        term2Fee: 0,
        term3Fee: 0,
        termsAcademicYear: undefined,
        totalTermsFee: 1000,
        updatedAt: undefined,
      }),
    );
  });
});
