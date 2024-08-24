import { EndpointName } from '../endpoint-name.enum';
import { IntegratorErrorMappingEntity } from '../integrator-error-mapping.entity';
import { IIntegratorErrorMapping } from '../integrator-error-mapping.interface';
import { IIntegratorErrorMappingRepository } from '../integrator-error-repository.interface';
import { IntegratorName } from '../IntegratorName.enum';
import { mockIntegratorErrorMapping } from './integrator-error-mapping.mock';

export const mockIntegratorErrorMappingRepository: IIntegratorErrorMappingRepository =
  {
    create: function (
      integratorErrorMapping: IntegratorErrorMappingEntity,
    ): Promise<IIntegratorErrorMapping> {
      return Promise.resolve({
        ...mockIntegratorErrorMapping,
        ...integratorErrorMapping,
      });
    },
    getByHttpCodeAndIntegratorAndEndpoint: function (
      httpStatusCode: number,
      integratorName: IntegratorName,
      endpointName: EndpointName,
    ): Promise<IIntegratorErrorMapping> {
      return Promise.resolve({
        ...mockIntegratorErrorMapping,
        receivedHttpCode: httpStatusCode,
        integratorName,
        endpointName,
      });
    },
    getByResponseStatusCodeAndIntegratorAndEndpoint: function (
      responseBodyStatusCode: number,
      integratorName: IntegratorName,
      endpointName: EndpointName,
    ): Promise<IIntegratorErrorMapping> {
      return Promise.resolve({
        ...mockIntegratorErrorMapping,
        receivedResponseStatusCode: responseBodyStatusCode,
        integratorName,
        endpointName,
      });
    },
    getByResponseStatusCodeAndErrorMessageAndIntegratorAndEndpoint: function (
      responseBodyStatusCode: number,
      errorMessage: string,
      integratorName: IntegratorName,
      endpointName: EndpointName,
    ): Promise<IIntegratorErrorMapping> {
      return Promise.resolve({
        ...mockIntegratorErrorMapping,
        receivedResponseStatusCode: responseBodyStatusCode,
        receivedErrorDescription: errorMessage,
        integratorName,
        endpointName,
      });
    },
    getByRejectionCodeAndIntegratorAndEndpoint: function (
      receivedRejectionCode: string,
      integratorName: IntegratorName,
      endpointName: EndpointName,
    ): Promise<IIntegratorErrorMapping> {
      return Promise.resolve({
        ...mockIntegratorErrorMapping,
        receivedRejectionOrErrorCode: receivedRejectionCode,
        integratorName,
        endpointName,
      });
    },
  };
