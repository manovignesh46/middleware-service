import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { ControllerLoggingInterceptor } from './controllerLogger.interceptor';

describe('ControllerLoggingInterceptor', () => {
  let interceptor: ControllerLoggingInterceptor;
  let context;
  let next: CallHandler<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControllerLoggingInterceptor],
    }).compile();

    interceptor = module.get<ControllerLoggingInterceptor>(
      ControllerLoggingInterceptor,
    );
    context = {
      getClass: jest.fn().mockReturnValue({ name: 'TestController' }),
      getHandler: jest.fn().mockReturnValue({ name: 'testMethod' }),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          originalUrl: '/test',
        }),
      }),
    };
    next = {
      handle: jest.fn().mockReturnValue(of({})),
    } as CallHandler<any>;
  });

  it('should log controller and method name on intercept', () => {
    const loggerSpy = jest.spyOn(interceptor['logger'], 'log');

    interceptor.intercept(context, next).subscribe(() => {
      expect(loggerSpy).toHaveBeenCalledWith(
        'GET /test handled by TestController.testMethod',
      );
    });
  });
});
