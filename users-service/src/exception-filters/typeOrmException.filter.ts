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
import { ResponseMessage } from '../domain/enum/responseMessage.enum';
import { ResponseStatusCode } from '../domain/enum/responseStatusCode.enum';
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
        ResponseStatusCode.USER_NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND,
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
