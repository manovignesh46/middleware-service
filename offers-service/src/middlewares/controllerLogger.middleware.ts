import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ControllerLoggerMiddleware implements NestMiddleware {
  private logger = new Logger(ControllerLoggerMiddleware.name);

  // List any senstive fields which should be redacted
  private readonly sensitiveFields = [
    'password',
    'email',
    'nationalIdNumber',
    'pin',
    'otp',
    'nin',
    'msisdn',
  ];

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const start = Date.now();
    const filteredBody = this.filterSensitiveFields(request.body);

    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} - ${userAgent} ${ip}`,
    );
    if (['POST', 'PUT'].includes(method)) {
      this.logger.log(`Request Body: `, filteredBody);
    }
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `End Request: ${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} completed in ${
          Date.now() - start
        }ms`,
      );
    });

    next();
  }
  filterSensitiveFields(body: any) {
    if (!body || typeof body !== 'object') {
      return body;
    }
    const filtered = { ...body };
    this.sensitiveFields.forEach((field) => {
      if (filtered[field]) {
        filtered[field] = '***';
      }
    });
    return filtered;
  }
}
