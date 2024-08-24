import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { StatusMessagePresenter } from '../infrastructure/controllers/common/statusMessage.presenter';
import { TypeORMError } from 'typeorm';
import { TypeORMExceptionFilter } from './typeOrmException.filter';

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

describe('TypeORMExceptionFilter', () => {
  let service: TypeORMExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeORMExceptionFilter],
    }).compile();
    service = module.get<TypeORMExceptionFilter>(TypeORMExceptionFilter);
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('TypeOrm Exception', () => {
      const exceptionMessage = 'Some Exception';
      service.catch(new TypeORMError(exceptionMessage), mockArgumentsHost);
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.OK);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(
        new StatusMessagePresenter(
          HttpStatus.INTERNAL_SERVER_ERROR,
          exceptionMessage,
        ),
      );
    });
  });
});
