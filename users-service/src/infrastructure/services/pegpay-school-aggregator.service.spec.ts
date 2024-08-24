import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { ISchoolAggregatorService } from '../../domain/services/schoolAggregatorService.interface';
import { PegpayGetStudentDetailsResponseDto } from '../controllers/customers/dtos/pegpay-get-student-details.response.dto';
import { RetrievePegPayStudentDetailsDto } from '../controllers/customers/dtos/retrieveStudentDetails.dto';
import { StudentDetails } from '../entities/studentDetails.entity';
import { PegPaySchoolAggregator } from './pegpay-school-aggregator.service';
import { SoapService } from './soap-client.service';

describe('schoolAggregatorService', () => {
  let service: ISchoolAggregatorService;

  const mockSoapService: DeepMocked<SoapService> = createMock<SoapService>();

  const mockPegPayResponse: PegpayGetStudentDetailsResponseDto = {
    customerRef: '19067',
    customerName: 'Pegasus Okello',
    schoolName: 'Peg Pay University',
    outstandingBalance: '90000',
    studentLevel: 'P2',
    studentLevelDescription: 'Primary 2',
    allowPartialPayments: '1',
    pegpayTranId: undefined, //currently not getting this from Pegpay
    gender: 'Male',
    studentOva: '0772236235',
    minimumPaymentAmount: '0',
    statusCode: '0',
    statusDescription: 'SUCCESS',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ISchoolAggregatorService, useClass: PegPaySchoolAggregator },
        { provide: SoapService, useValue: mockSoapService },
      ],
    }).compile();

    service = module.get<ISchoolAggregatorService>(ISchoolAggregatorService);
    jest
      .spyOn(mockSoapService, 'retrievePegPayStudentDetails')
      .mockResolvedValueOnce(mockPegPayResponse);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('schoolAggregatorService retrieveStudentDetails', async () => {
    const dto = new RetrievePegPayStudentDetailsDto('123', 'school123');
    const result = await service.retrieveStudentDetails(dto);
    const expectedResponse =
      StudentDetails.transformPegpayGetStudentDetailsResponseDtoToStudentDetailsEntity(
        mockPegPayResponse,
      );
    expectedResponse.studentSchoolCode = 'school123';
    expect(result).toEqual(expectedResponse);
  });
});
