import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { StatusMessagePresenter } from '../infrastructure/controllers/common/statusMessage.presenter';
import { ResponseStatusCode } from '../domain/enum/responseStatusCode.enum';
import { ResponseMessage } from '../domain/enum/responseMessage.enum';
import { SchoolAggregatorConnectionError } from '../infrastructure/controllers/common/errors/school-aggregator-connection.error';
import { SchoolAggregatorExceptionFilter } from './school-aggregator-exception.filter';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('SchoolAggregatorExceptionFilter', () => {
  let service: SchoolAggregatorExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolAggregatorExceptionFilter],
    }).compile();
    service = module.get<SchoolAggregatorExceptionFilter>(
      SchoolAggregatorExceptionFilter,
    );
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('OTP Expired Error should return appropriate response', () => {
      const exceptionMessage = 'Some Exception';
      service.catch(
        new SchoolAggregatorConnectionError(exceptionMessage),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.OK);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(
        new StatusMessagePresenter(
          ResponseStatusCode.SCHOOL_AGGREGATOR_DOWN,
          ResponseMessage.SCHOOL_AGGREGATOR_DOWN,
        ),
      );
    });
  });
});
