import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { EntityNotFoundError, TypeORMError } from 'typeorm';
import { Response } from 'express';
import { generateExceptionFilterResponse } from './helper';
@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  private logger = new Logger(TypeORMExceptionFilter.name);
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    let response = ctx.getResponse<Response>();
    this.logger.error(exception);
    if (exception instanceof EntityNotFoundError) {
      response = generateExceptionFilterResponse(
        response,
        HttpStatus.NOT_FOUND,
        exception.message,
      );
    } else {
      response = generateExceptionFilterResponse(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        exception.message,
      );
    }
  }
}
