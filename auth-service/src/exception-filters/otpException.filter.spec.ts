import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { StatusMessagePresenter } from '../infrastructure/controllers/common/statusMessage.presenter';
import { OTPExceptionFilter } from './otpException.filter';
import { ResponseStatusCode } from '../domain/enum/responseStatusCode.enum';
import { ResponseMessage } from '../domain/enum/responseMessage.enum';
import { OtpLockedError } from '../infrastructure/controllers/common/errors/otpLocked.error';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('OTPExceptionFilter', () => {
  let service: OTPExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [OTPExceptionFilter],
    }).compile();
    service = module.get<OTPExceptionFilter>(OTPExceptionFilter);
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('OTP Locked Error should return appropriate response', () => {
      const exceptionMessage = 'Some Exception';
      service.catch(
        new OtpLockedError(exceptionMessage, 10),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.OK);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(
        new StatusMessagePresenter(
          ResponseStatusCode.LOGIN_LOCK,
          ResponseMessage.LOGIN_LOCK.replace('${timeInMinutes}', '10'),
        ),
      );
    });
  });
});
