import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';
import { ResponseMessage } from '../domain/enum/response-status-message.enum';
import { ResponseStatusCode } from '../domain/enum/responseStatusCode.enum';
import { StatusMessagePresenter } from '../infrastructure/controllers/requests/presenters/statusMessage.presenter';
import { IpBlacklistingInterceptor } from './ip-blacklisting.interceptor';

describe('IP Blacklisting Interceptor', () => {
  let interceptor: IpBlacklistingInterceptor;
  let context: ExecutionContext;
  let next: CallHandler<any>;
  let nextHandler;

  const mockHttpService = createMock<HttpService>();
  const mockHttpResponseIpLocation = {
    status: 200,
    data: { country_code2: 'SG' },
  };
  const mockHttpResponseIpInfo = {
    status: 200,
    data: { country: 'SG' },
  };

  const mockConfigService = createMock<ConfigService>();
  mockConfigService.get.mockImplementation((envName) => {
    switch (envName) {
      case 'BLACKLISTED_COUNTRY_CODES':
        return ['CU', 'RU', 'KP', 'IR', 'SY', 'BY', 'VE', 'UA'];

      default:
        break;
    }
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    next = {
      handle: jest.fn().mockReturnValue(of('next handler executed')),
    } as CallHandler<any>;

    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { 'x-user-ip': 'ipAddressHere' },
        }),
      }),
    } as any as ExecutionContext;

    nextHandler = jest.spyOn(next, 'handle');

    const module = await Test.createTestingModule({
      providers: [
        IpBlacklistingInterceptor,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    interceptor = module.get<IpBlacklistingInterceptor>(
      IpBlacklistingInterceptor,
    );
  });

  it('Should forward to route handler for non-blacklisted countries', async () => {
    mockHttpService.get.mockReturnValueOnce(
      of(mockHttpResponseIpInfo) as never,
    );
    await interceptor.intercept(context, next);
    expect(nextHandler).toBeCalledTimes(1);
  });
  it('Should block to route handler for blacklisted countries', (done) => {
    const mockHttpResponse = { status: 200, data: { country: 'CU' } };
    mockHttpService.get.mockReturnValueOnce(of(mockHttpResponse) as never);
    interceptor.intercept(context, next).then((response) => {
      expect(nextHandler).toHaveBeenCalledTimes(0);
      response.subscribe((data) => {
        expect(data).toEqual(
          new StatusMessagePresenter(
            ResponseStatusCode.FAIL_COUNTRY_IP_BLACKLISTING,
            ResponseMessage.COUNTRY_BLACKLISTED,
          ),
        );
        done();
      });
    });
  });
  it('Should fallback to another 3rd Party if one is down', async () => {
    const mockHttpResponse = { status: 500, data: {} };
    mockHttpService.get.mockReturnValueOnce(of(mockHttpResponse) as never);
    mockHttpService.get.mockReturnValueOnce(
      of(mockHttpResponseIpLocation) as never,
    );
    await interceptor.intercept(context, next);
    expect(nextHandler).toBeCalledTimes(1);
  });
  it('Should block to route handler if no IP provided', (done) => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
      }),
    } as any as ExecutionContext;
    interceptor.intercept(context, next).then((response) => {
      expect(nextHandler).toHaveBeenCalledTimes(0);
      response.subscribe((data) => {
        expect(data).toEqual(
          new StatusMessagePresenter(
            ResponseStatusCode.GENERIC_ERROR_500,
            ResponseMessage.NO_X_USER_IP_HEADER,
          ),
        );
        done();
      });
    });
  });
  it('Should block to route handler if no IP countries API is returning 500', (done) => {
    const mockHttpResponse = { status: 500, data: {} };
    mockHttpService.get.mockReturnValueOnce(of(mockHttpResponse) as never);
    mockHttpService.get.mockReturnValueOnce(of(mockHttpResponse) as never);
    interceptor.intercept(context, next).then((response) => {
      expect(nextHandler).toHaveBeenCalledTimes(0);
      response.subscribe((data) => {
        expect(data).toEqual(
          new StatusMessagePresenter(
            ResponseStatusCode.GENERIC_ERROR_500,
            ResponseMessage.COUNTRY_WHITELISTING_API_ERROR,
          ),
        );
        done();
      });
    });
  });
  it('Should block to route handler if resolved country from API is null', (done) => {
    const mockHttpResponse = { status: 200, data: { country_code2: null } };
    mockHttpService.get.mockReturnValueOnce(of(mockHttpResponse) as never);
    mockHttpService.get.mockReturnValueOnce(of(mockHttpResponse) as never);
    interceptor.intercept(context, next).then((response) => {
      expect(nextHandler).toHaveBeenCalledTimes(0);
      response.subscribe((data) => {
        expect(data).toEqual(
          new StatusMessagePresenter(
            ResponseStatusCode.FAIL_COUNTRY_IP_BLACKLISTING,
            ResponseMessage.COUNTRY_BLACKLISTED,
          ),
        );
        done();
      });
    });
  });
  it('Should block to route handler if API response has no data (no response body)', (done) => {
    const mockHttpResponse = { status: 200 };
    mockHttpService.get.mockReturnValueOnce(of(mockHttpResponse) as never);
    mockHttpService.get.mockReturnValueOnce(of(mockHttpResponse) as never);
    interceptor.intercept(context, next).then((response) => {
      expect(nextHandler).toHaveBeenCalledTimes(0);
      response.subscribe((data) => {
        expect(data).toEqual(
          new StatusMessagePresenter(
            ResponseStatusCode.GENERIC_ERROR_500,
            ResponseMessage.COUNTRY_WHITELISTING_API_ERROR,
          ),
        );
        done();
      });
    });
  });
});
