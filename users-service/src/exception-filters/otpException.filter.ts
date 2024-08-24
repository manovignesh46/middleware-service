import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { OtpLockedError } from '../infrastructure/controllers/common/errors/otpLocked.error';
import { OtpExpiredError } from '../infrastructure/controllers/common/errors/otpExpired.error';
import { ResponseStatusCode } from '../domain/enum/responseStatusCode.enum';
import { ResponseMessage } from '../domain/enum/responseMessage.enum';
import { OtpNotExpiredError } from '../infrastructure/controllers/common/errors/otpNotExpired.error';
import { generateExceptionFilterResponse } from './helper';

@Catch(OtpLockedError, OtpExpiredError, OtpNotExpiredError)
export class OTPExceptionFilter implements ExceptionFilter {
  private logger = new Logger(OTPExceptionFilter.name);
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    let response = ctx.getResponse<Response>();
    this.logger.error(exception);
    if (exception instanceof OtpLockedError) {
      const lockedMsg = ResponseMessage.OTP_LOCK.replace(
        '${timeInMinutes}',
        (exception as OtpLockedError).timeToUnlockMinutes?.toString(),
      );
      response = generateExceptionFilterResponse(
        response,
        ResponseStatusCode.OTP_LOCKED,
        lockedMsg,
      );
    } else if (exception instanceof OtpExpiredError) {
      response = generateExceptionFilterResponse(
        response,
        ResponseStatusCode.OTP_EXPIRED,
        ResponseMessage.OTP_EXPIRED,
      );
    } else if (exception instanceof OtpNotExpiredError) {
      response = generateExceptionFilterResponse(
        response,
        ResponseStatusCode.OTP_EXPIRED,
        ResponseMessage.OTP_NOT_EXPIRED,
      );
    }
  }
}
