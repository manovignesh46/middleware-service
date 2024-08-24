import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { RetrieveSchoolPayStudentDetailsDto } from '../controllers/customers/dtos/retrieveStudentDetails.dto';
import { ValidateStudentAccountSunlyteDto } from '../controllers/customers/dtos/validate-student-account-sunlyte.dto';
import { StudentDetails } from '../entities/studentDetails.entity';
import { SchoolPaySchoolAggregatorService } from './schoolpay-school-aggregator.service';
import { SoapService } from './soap-client.service';

describe('schoolAggregatorService', () => {
  let service: SchoolPaySchoolAggregatorService;

  const mockSoapService: DeepMocked<SoapService> = createMock<SoapService>();
  const mockValidateStudentAccountResponse: ValidateStudentAccountSunlyteDto = {
    OUT_DATE_CREATED: '2016-05-13 19:49:34',
    OUT_SCHOOL_CODE: '112',
    OUT_FIRST_NAME: 'Joe Kule',
    OUT_STUDENT_CLASS: 'S2 SENIOR TWO',
    OUT_OUTSTANDING_BALANCE: '200000',
    OUT_STUDENT_PAYMENT_CODE: '1000008152',
    OUT_SURNAME: 'Muhangi',
    OUT_STUDENT_REGISTRATION_NUMBER: '335',
    OUT_DATE_OF_BIRTH: '1996-05-13',
    OUT_SCHOOL_NAME: 'MANDELA SS HOIMA',
    responseStatusCode: '0',
    responseStatusMessage: 'Success',
    OUT_MIDDLE_NAME: '',
    AIRTEL_OVA: 'airtel123',
    MTN_OVA: undefined,
    MINIMUM_ALLOWED_AMOUNT: '5',
    OUT_STUDENT_GENDER: 'MALE',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolPaySchoolAggregatorService,
        { provide: SoapService, useValue: mockSoapService },
      ],
    }).compile();

    service = module.get<SchoolPaySchoolAggregatorService>(
      SchoolPaySchoolAggregatorService,
    );
    jest
      .spyOn(mockSoapService, 'validateSchoolPayStudentAccount')
      .mockResolvedValueOnce(mockValidateStudentAccountResponse);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('schoolAggregatorService retrieveStudentDetails', async () => {
    const dto = new RetrieveSchoolPayStudentDetailsDto(
      '123',
      'school123',
      'reqref123',
    );
    const result = await service.retrieveStudentDetails(dto);
    const expectedResponse =
      StudentDetails.transformValidateStudentAccountSunlyteDtoToStudentDetailsEntity(
        mockValidateStudentAccountResponse,
      );
    expect(result).toEqual(expectedResponse);
  });
});
