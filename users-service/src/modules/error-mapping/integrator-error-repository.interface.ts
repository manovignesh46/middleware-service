import { IntegratorErrorMappingEntity } from './integrator-error-mapping.entity';
import { EndpointName } from './endpoint-name.enum';
import { IIntegratorErrorMapping } from './integrator-error-mapping.interface';
import { IntegratorName } from './IntegratorName.enum';

export abstract class IIntegratorErrorMappingRepository {
  abstract create(
    integratorErrorMapping: IntegratorErrorMappingEntity,
  ): Promise<IIntegratorErrorMapping>;
  abstract getByHttpCodeAndIntegratorAndEndpoint(
    httpStatusCode: number,
    integratorName: IntegratorName,
    endpointName: EndpointName,
  ): Promise<IIntegratorErrorMapping>;
  abstract getByResponseStatusCodeAndIntegratorAndEndpoint(
    responseBodyStatusCode: number,
    integratorName: IntegratorName,
    endpointName: EndpointName,
  ): Promise<IIntegratorErrorMapping>;
  abstract getByResponseStatusCodeAndErrorMessageAndIntegratorAndEndpoint(
    responseBodyStatusCode: number,
    errorMessage: string,
    integratorName: IntegratorName,
    endpointName: EndpointName,
  ): Promise<IIntegratorErrorMapping>;
  abstract getByRejectionCodeAndIntegratorAndEndpoint(
    receivedRejectionCode: string,
    integratorName: IntegratorName,
    endpointName: EndpointName,
  ): Promise<IIntegratorErrorMapping>;
}
