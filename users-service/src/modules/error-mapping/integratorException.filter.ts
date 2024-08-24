import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IntegratorError } from './integrator.error';
import { generateExceptionFilterResponse } from '../../exception-filters/helper';
import { Response } from 'express';
import { IIntegratorErrorMappingRepository } from './integrator-error-repository.interface';
import { ResponseStatusCode } from '../../domain/enum/responseStatusCode.enum';
import { IIntegratorErrorMapping } from './integrator-error-mapping.interface';
import { IntegratorErrorMappingEntity } from './integrator-error-mapping.entity';
import { IntegratorErrorType } from './integrator-error-type.enum';
import { IntegratorName } from './IntegratorName.enum';

@Catch(IntegratorError)
@Injectable()
export class IntegratorExceptionFilter implements ExceptionFilter {
  private logger = new Logger(IntegratorExceptionFilter.name);
  constructor(private respository: IIntegratorErrorMappingRepository) {}
  async catch(exception: IntegratorError, host: ArgumentsHost) {
    const {
      integratorName,
      endpointName,
      httpStatusCode,
      responseBodyStatusCode,
      rejectionOrErrorCode,
      message,
    } = exception;
    this.logger.warn(
      `Exception with 3rd party integration\nError message: ${message}\nError HTTP Status Code: ${httpStatusCode}\nError ResponseBody Status Code (If Any): ${responseBodyStatusCode}`,
    );

    const ctx = host.switchToHttp();
    let response = ctx.getResponse<Response>();
    let integratorErrorMapping: IIntegratorErrorMapping;

    //Error thrown with only httpStatusCode
    if (httpStatusCode && !responseBodyStatusCode && !rejectionOrErrorCode) {
      integratorErrorMapping =
        await this.respository.getByHttpCodeAndIntegratorAndEndpoint(
          httpStatusCode,
          integratorName,
          endpointName,
        );
    } else if (responseBodyStatusCode && !rejectionOrErrorCode) {
      if (integratorName === IntegratorName.PEGPAY) {
        //PEGPAY has errors with same error code but diff message
        integratorErrorMapping =
          await this.respository.getByResponseStatusCodeAndErrorMessageAndIntegratorAndEndpoint(
            responseBodyStatusCode,
            message,
            integratorName,
            endpointName,
          );
      } else {
        integratorErrorMapping =
          await this.respository.getByResponseStatusCodeAndIntegratorAndEndpoint(
            responseBodyStatusCode,
            integratorName,
            endpointName,
          );
      }
    } else if (rejectionOrErrorCode) {
      integratorErrorMapping =
        await this.respository.getByRejectionCodeAndIntegratorAndEndpoint(
          rejectionOrErrorCode,
          integratorName,
          endpointName,
        );
    }
    if (!integratorErrorMapping) {
      //new unmapped entry (will not be persisted across envs)
      const newMapping: IntegratorErrorMappingEntity = {
        integratorName: integratorName,
        endpointName: endpointName,
        receivedHttpCode: httpStatusCode,
        receivedResponseStatusCode: responseBodyStatusCode,
        receivedRejectionOrErrorCode: rejectionOrErrorCode,
        receivedErrorDescription: message,
        mappedErrorCode: 'UNMAPPED',
        mappedErrorMessage: 'UNMAPPED',
      } as IntegratorErrorMappingEntity;
      await this.respository.create(newMapping);
    }

    if (
      !integratorErrorMapping ||
      !integratorErrorMapping?.mappedErrorMessage ||
      integratorErrorMapping?.mappedErrorMessage === 'UNMAPPED'
    ) {
      const responseMessage = `Error with integration ${
        (exception as IntegratorError)?.integratorName
      } - ${message}`;
      this.logger.warn(responseMessage);
      response = generateExceptionFilterResponse(
        response,
        ResponseStatusCode.GENERIC_ERROR_500,
        responseMessage,
      );
    } else {
      //Todo: get errorMessage from other table
      let responseStatusCode: number;
      let responseMessage: string;
      if (integratorErrorMapping.errorType === IntegratorErrorType.BUSINESS) {
        // Business errors will have mappedErrorCode in the status for ResponseBody sent to FE
        responseStatusCode = parseInt(integratorErrorMapping.mappedErrorCode);
        responseMessage = integratorErrorMapping?.mappedErrorMessage;
      }
      /* When TECHNICAL error. Otherwise when BUSINESS error but mapped error message cannot
      be parsed into an Int, then responseStatusCode is NaN / null */
      if (!responseStatusCode) {
        // Technical errors will have always have status 500 sent to FE, message will have the mappedErrorCode
        responseStatusCode = ResponseStatusCode.GENERIC_ERROR_500;
        responseMessage = `${integratorErrorMapping?.mappedErrorMessage} - ${integratorErrorMapping?.mappedErrorCode}`;
      }
      response = generateExceptionFilterResponse(
        response,
        responseStatusCode,
        responseMessage,
      );
    }
  }
}
