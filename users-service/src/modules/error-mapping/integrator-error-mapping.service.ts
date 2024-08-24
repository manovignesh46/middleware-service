import { Injectable, Logger } from '@nestjs/common';
import { EndpointName } from './endpoint-name.enum';
import { IntegratorError } from './integrator.error';
import { IntegratorName } from './IntegratorName.enum';

@Injectable()
export class IntegratorErrorMappingService {
  private logger = new Logger(IntegratorErrorMappingService.name);
  validateHttpCode(
    httpCode: number,
    httpMessage: string,
    integratorName: IntegratorName,
    endpointName: EndpointName,
  ) {
    this.logger.log(this.validateHttpCode.name);
    //Assumption that all integrators return 200 / 201 if the request and response is valid
    if (httpCode != 200 && httpCode != 201) {
      this.logger.error(
        `Integration HTTP Error ${integratorName} ${endpointName} - HTTP ${httpCode} ${httpMessage}`,
      );
      throw new IntegratorError(
        httpMessage,
        integratorName,
        endpointName,
        httpCode,
        null,
        null,
      );
    }
  }

  validateResponseBodyStatusCodeAndErrorCode(
    responseBody: any,
    integratorName: IntegratorName,
    endpointName: EndpointName,
  ) {
    this.logger.log(this.validateResponseBodyStatusCodeAndErrorCode.name);

    let responseBodyStatusCode: number;
    let rejectionOrErrorCode: any;
    let errorMessage: string;
    let isThrowError = false;

    switch (integratorName) {
      case IntegratorName.LOS:
      // fall-through case to LMS. Don't add 'break' here
      case IntegratorName.LMS:
        //get 'code' from res body (if any)
        responseBodyStatusCode = responseBody?.code;
        if (responseBodyStatusCode && responseBodyStatusCode != 2000) {
          this.logger.log(
            `Response Body Status Code: ${responseBodyStatusCode}`,
          );
          isThrowError = true;
          errorMessage = responseBody?.message;
        }

        //get rejection_code from res body (if any)
        rejectionOrErrorCode =
          IntegratorName.LOS === integratorName
            ? responseBody?.rejection_code
            : responseBody?.data?.rejection_code;
        if (
          rejectionOrErrorCode !== undefined &&
          rejectionOrErrorCode !== null &&
          rejectionOrErrorCode !== 0 &&
          rejectionOrErrorCode !== ''
        ) {
          this.logger.log(
            `Rejection/Error code identified: ${rejectionOrErrorCode}`,
          );
          //Dashboard response is handled separately because it needs the preferredName
          if (endpointName != EndpointName.DASHBOARD) {
            isThrowError = true;
            errorMessage =
              IntegratorName.LOS === integratorName
                ? responseBody?.rejected_reason
                : responseBody?.data?.rejected_reason ||
                  responseBody?.data?.rejected_reason;
          }
        }
        break;
      case IntegratorName.AIRTEL:
        break;
      case IntegratorName.EXPERIAN:
        break;
      case IntegratorName.REFINITIV:
        break;
      case IntegratorName.PEGPAY:
        responseBodyStatusCode = parseInt(responseBody?.statusCode);
        if (responseBodyStatusCode && responseBodyStatusCode != 0) {
          isThrowError = true;
          errorMessage = responseBody?.statusDescription;
        }
        break;
      case IntegratorName.SCHOOL_PAY:
        responseBodyStatusCode = responseBody?.return?.returnCode?._text;
        if (responseBodyStatusCode && responseBodyStatusCode != 0) {
          isThrowError = true;
          errorMessage = responseBody?.return?.returnMessage?._text;
        }
        break;
      case IntegratorName.MTN:
        if (
          endpointName == EndpointName.OPT_IN &&
          responseBody?._attributes?.errorcode
        ) {
          isThrowError = true;
          errorMessage = responseBody?._attributes?.errorcode;
        }
      default:
        break;
    }

    if (isThrowError) {
      this.logger.error(
        `Integration HTTP Error ${integratorName} ${endpointName} - Status Code: ${responseBodyStatusCode}, Rejection/Error Code ${rejectionOrErrorCode}, Error Message: ${errorMessage}`,
      );
      this.logger.error(responseBody);
      throw new IntegratorError(
        errorMessage,
        integratorName,
        endpointName,
        null,
        responseBodyStatusCode,
        rejectionOrErrorCode,
      );
    }
  }
}
