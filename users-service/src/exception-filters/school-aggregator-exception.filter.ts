import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ResponseStatusCode } from '../domain/enum/responseStatusCode.enum';
import { ResponseMessage } from '../domain/enum/responseMessage.enum';
import { generateExceptionFilterResponse } from './helper';
import { SchoolAggregatorConnectionError } from '../infrastructure/controllers/common/errors/school-aggregator-connection.error';

@Catch(SchoolAggregatorConnectionError)
export class SchoolAggregatorExceptionFilter implements ExceptionFilter {
  private logger = new Logger(SchoolAggregatorExceptionFilter.name);
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    let response = ctx.getResponse<Response>();
    this.logger.error(exception);
    if (exception instanceof SchoolAggregatorConnectionError) {
      response = generateExceptionFilterResponse(
        response,
        ResponseStatusCode.SCHOOL_AGGREGATOR_DOWN,
        ResponseMessage.SCHOOL_AGGREGATOR_DOWN,
      );
    }
  }
}
