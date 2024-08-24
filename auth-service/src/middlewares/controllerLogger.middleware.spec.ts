import { mock, MockProxy } from 'jest-mock-extended';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';
import { ControllerLoggerMiddleware } from './controllerLogger.middleware';

describe('ControllerLoggerMiddleware', () => {
  let middleware: ControllerLoggerMiddleware;
  let req: MockProxy<Request>;
  let res: MockProxy<Response>;
  let next: MockProxy<NextFunction>;
  let logger: MockProxy<Logger>;

  beforeEach(() => {
    req = mock<Request>();
    res = mock<Response>();
    next = mock<NextFunction>();
    logger = mock<Logger>();
    middleware = new ControllerLoggerMiddleware();
  });

  it('should log incoming request and response on finish', () => {
    const method = 'GET';
    const originalUrl = '/example';
    const userAgent = 'Chrome';
    const ip = '127.0.0.1';
    const statusCode = 200;
    const contentLength = 1024;
    const start = 10;
    const end = 12;

    req.ip = ip;
    req.method = method;
    req.originalUrl = originalUrl;
    req.get.mockReturnValue(userAgent);

    res.statusCode = statusCode;
    res.get.mockReturnValue(contentLength.toString());

    const loggerLogSpy = jest
      .spyOn(middleware['logger'], 'log')
      .mockImplementationOnce((logMessage) => {
        return;
      })
      .mockImplementationOnce((logMessage) => {
        return;
      });

    jest.spyOn(Date, 'now').mockReturnValueOnce(start).mockReturnValueOnce(end);

    next = jest.fn().mockReturnValueOnce(start).mockReturnValueOnce(end);

    middleware.use(req, res, next);

    expect(loggerLogSpy).toHaveBeenNthCalledWith(
      1,
      `Incoming Request: ${method} ${originalUrl} - ${userAgent} ${ip}`,
    );

    res.on.mock.calls[0][1]();

    expect(loggerLogSpy).toHaveBeenNthCalledWith(
      2,
      `End Request: ${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} completed in ${
        end - start
      }ms`,
    );

    expect(next).toHaveBeenCalled();
  });
});
