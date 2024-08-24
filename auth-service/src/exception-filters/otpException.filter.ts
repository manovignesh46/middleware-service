import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { OtpLockedError } from '../infrastructure/controllers/common/errors/otpLocked.error';
import { ResponseStatusCode } from '../domain/enum/responseStatusCode.enum';
import { ResponseMessage } from '../domain/enum/responseMessage.enum';
import { generateExceptionFilterResponse } from './helper';

@Catch(OtpLockedError)
export class OTPExceptionFilter implements ExceptionFilter {
  private logger = new Logger(OTPExceptionFilter.name);
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    let response = ctx.getResponse<Response>();
    this.logger.error(exception);
    if (exception instanceof OtpLockedError) {
      const lockedMsg = ResponseMessage.LOGIN_LOCK.replace(
        '${timeInMinutes}',
        (exception as OtpLockedError).timeToUnlockMinutes?.toString(),
      );
      response = generateExceptionFilterResponse(
        response,
        ResponseStatusCode.LOGIN_LOCK,
        lockedMsg,
      );
    }
  }
}
