import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { generateExceptionFilterResponse } from './helper';

@Catch(Error)
export class GeneralExceptionFilter extends BaseExceptionFilter {
  private logger = new Logger(GeneralExceptionFilter.name);
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    let response = ctx.getResponse<Response>();
    this.logger.log(exception);
    if (exception instanceof BadRequestException) {
      super.catch(exception, host);
    } else {
      response = generateExceptionFilterResponse(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        exception.message,
      );
    }
  }
}
