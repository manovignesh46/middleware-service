import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EndpointName } from './endpoint-name.enum';
import { IIntegratorErrorMappingRepository } from './integrator-error-repository.interface';
import { IntegratorErrorMappingEntity } from './integrator-error-mapping.entity';
import { IntegratorName } from './IntegratorName.enum';
import { IIntegratorErrorMapping } from './integrator-error-mapping.interface';

@Injectable()
export class IntegratorErrorMappingRepository
  implements IIntegratorErrorMappingRepository
{
  constructor(
    @InjectRepository(IntegratorErrorMappingEntity)
    private repository: Repository<IntegratorErrorMappingEntity>,
  ) {}

  create(
    integratorErrorMapping: IntegratorErrorMappingEntity,
  ): Promise<IIntegratorErrorMapping> {
    return this.repository.save(integratorErrorMapping);
  }
  getByHttpCodeAndIntegratorAndEndpoint(
    httpStatusCode: number,
    integratorName: IntegratorName,
    endpointName: EndpointName,
  ): Promise<IIntegratorErrorMapping> {
    return this.repository.findOneBy({
      receivedHttpCode: httpStatusCode,
      integratorName,
      endpointName,
    });
  }
  getByResponseStatusCodeAndIntegratorAndEndpoint(
    responseBodyStatusCode: number,
    integratorName: IntegratorName,
    endpointName: EndpointName,
  ): Promise<IIntegratorErrorMapping> {
    return this.repository.findOneBy({
      receivedResponseStatusCode: responseBodyStatusCode,
      integratorName,
      endpointName,
    });
  }

  getByResponseStatusCodeAndErrorMessageAndIntegratorAndEndpoint(
    responseBodyStatusCode: number,
    errorMessage: string,
    integratorName: IntegratorName,
    endpointName: EndpointName,
  ): Promise<IIntegratorErrorMapping> {
    return this.repository.findOneBy({
      receivedResponseStatusCode: responseBodyStatusCode,
      receivedErrorDescription: errorMessage,
      integratorName,
      endpointName,
    });
  }

  getByRejectionCodeAndIntegratorAndEndpoint(
    receivedRejectionCode: string,
    integratorName: IntegratorName,
    endpointName: EndpointName,
  ): Promise<IIntegratorErrorMapping> {
    return this.repository.findOneBy({
      receivedRejectionOrErrorCode: receivedRejectionCode,
      integratorName,
      endpointName,
    });
  }
}
