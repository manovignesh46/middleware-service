import { Test, TestingModule } from '@nestjs/testing';
import { IntegratorExceptionFilter } from './integratorException.filter';
import { mockIntegratorErrorMappingRepository } from './mocks/mock-integrator-error-mapping.repository';
import { IIntegratorErrorMappingRepository } from './integrator-error-repository.interface';
import { IntegratorError } from './integrator.error';
import { IntegratorName } from './IntegratorName.enum';
import { EndpointName } from './endpoint-name.enum';
import { StatusMessagePresenter } from '../../infrastructure/controllers/common/statusMessage.presenter';
import { HttpStatus } from '@nestjs/common';
import { ResponseStatusCode } from '../../domain/enum/responseStatusCode.enum';
import { mockIntegratorErrorMapping } from './mocks/integrator-error-mapping.mock';
import { IntegratorErrorType } from './integrator-error-type.enum';

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
  let service: IntegratorExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegratorExceptionFilter,
        {
          provide: IIntegratorErrorMappingRepository,
          useValue: mockIntegratorErrorMappingRepository,
        },
      ],
    }).compile();
    service = module.get<IntegratorExceptionFilter>(IntegratorExceptionFilter);
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('Technical error message mapped to 500', async () => {
      jest
        .spyOn(
          mockIntegratorErrorMappingRepository,
          'getByHttpCodeAndIntegratorAndEndpoint',
        )
        .mockResolvedValueOnce({
          ...mockIntegratorErrorMapping,
          mappedErrorCode: 'PP1000',
          mappedErrorMessage: 'test mapped message',
          errorType: IntegratorErrorType.TECHINICAL,
        });
      await service.catch(
        new IntegratorError(
          'pegpay error',
          IntegratorName.PEGPAY,
          EndpointName.GET_STUDENT_DETAILS,
          500,
          null,
          null,
        ),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(
        expect.objectContaining({
          status: ResponseStatusCode.GENERIC_ERROR_500,
          message: 'test mapped message - PP1000',
        }),
      );
    });
    it('Business error message mapped to 500 if error code cannot be parsed to int', async () => {
      jest
        .spyOn(
          mockIntegratorErrorMappingRepository,
          'getByHttpCodeAndIntegratorAndEndpoint',
        )
        .mockResolvedValueOnce({
          ...mockIntegratorErrorMapping,
          mappedErrorCode: 'thisIsNotAnInt1000',
          mappedErrorMessage: 'test mapped message',
          errorType: IntegratorErrorType.TECHINICAL,
        });
      await service.catch(
        new IntegratorError(
          'pegpay error',
          IntegratorName.PEGPAY,
          EndpointName.GET_STUDENT_DETAILS,
          500,
          null,
          null,
        ),
        mockArgumentsHost,
      );

      expect(mockJson).toBeCalledWith(
        expect.objectContaining({
          status: ResponseStatusCode.GENERIC_ERROR_500,
          message: 'test mapped message - thisIsNotAnInt1000',
        }),
      );
    });
    it('Business error message mapped to respective status', async () => {
      jest
        .spyOn(
          mockIntegratorErrorMappingRepository,
          'getByHttpCodeAndIntegratorAndEndpoint',
        )
        .mockResolvedValueOnce({
          ...mockIntegratorErrorMapping,
          mappedErrorCode: '1000',
          mappedErrorMessage: 'test mapped message',
          errorType: IntegratorErrorType.BUSINESS,
        });
      await service.catch(
        new IntegratorError(
          'pegpay error',
          IntegratorName.PEGPAY,
          EndpointName.GET_STUDENT_DETAILS,
          500,
          null,
          null,
        ),
        mockArgumentsHost,
      );

      expect(mockJson).toBeCalledWith(
        expect.objectContaining({
          status: 1000,
          message: 'test mapped message',
        }),
      );
    });
    it('Unmapped error to return generic 500', async () => {
      jest
        .spyOn(
          mockIntegratorErrorMappingRepository,
          'getByHttpCodeAndIntegratorAndEndpoint',
        )
        .mockResolvedValueOnce(null);
      await service.catch(
        new IntegratorError(
          'pegpay error',
          IntegratorName.PEGPAY,
          EndpointName.GET_STUDENT_DETAILS,
          500,
          null,
          null,
        ),
        mockArgumentsHost,
      );

      expect(mockJson).toBeCalledWith(
        expect.objectContaining({
          status: ResponseStatusCode.GENERIC_ERROR_500,
        }),
      );
    });
  });
});
