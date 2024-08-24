import { NotAuthorizedException } from '@aws-sdk/client-cognito-identity-provider';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseMessage } from '../../../domain/enum/responseMessage.enum';
import { ResponseStatusCode } from '../../../domain/enum/responseStatusCode.enum';
import { mockCognitoDetail } from '../../../domain/models/mocks/cognito-details.mock';
import { mockDevice } from '../../../domain/models/mocks/device.mock';
import { IAuthService } from '../../../domain/services/authService.interface';
import { ICognitoDetailService } from '../../../domain/services/cognito-detail.service.interface';
import { ICustomerServiceClient } from '../../../domain/services/customerClient.interface';
import { DeviceService } from '../../services/device.service';
import { StatusMessagePresenter } from '../common/statusMessage.presenter';
import { AuthController } from './auth.controller';
import {
  LoginDto,
  ResetPinDto,
  SignUpDto,
  VerifyLoginOtpDto,
  LogoutDto,
} from './auth.dto';
import { SessionIdPresenter, VerifyOtpTokenPresenter } from './auth.presenter';
import { GetCustomerFromFullMsisdnPresenter } from './customer/get-customer-from-full-msisdn.presenter';
import { ForgotPinResetDto } from './dtos/forgot-pin-reset-password.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService: IAuthService = {
    registerPhoneNumber: jest.fn(
      (phoneNumber: string, pin, confirmPin, email?) => {
        return {
          AccessToken: '123',
          ExpiresIn: 3600,
          RefreshToken: '234',
          IdToken: '345',
        };
      },
    ),
    login: function (phoneNumber: string, pin: string) {
      return {
        $metadata: {
          requestId: '234',
        },
        ChallengeParameters: {
          otpPrefix: 'XYZ',
        },
        Session: '123',
      };
    },
    verifyLoginOtp: function (
      sessionId: string,
      phoneNumber: string,
      otp: string,
    ) {
      throw new Error('Function not implemented.');
    },
    resetPin: function (
      accessToken: string,
      currentPin: string,
      newPin: string,
    ): Promise<boolean> {
      throw new Error('Function not implemented');
    },
    logout: function (refreshToken: string): Promise<boolean> {
      throw new Error('Function not implemented.');
    },
    listUsersWithFullMsisdn: function (customerId: string): Promise<any> {
      throw new Error('Function not implemented.');
    },
    forgotPinResetPassword: function (
      dto: ForgotPinResetDto,
    ): Promise<boolean> {
      throw new Error('Function not implemented.');
    },
    isLoginEligible: function (msisdnCountryCode: string, msisdn: string) {
      return Promise.resolve(true);
    },
    adminDeleteUser: function (cognitoId: string): Promise<boolean> {
      throw new Error('Function not implemented.');
    },
  };

  const mockDeviceService = createMock<DeviceService>();
  const mockConfigService = createMock<ConfigService>();
  const mockCustomerServiceClient = createMock<ICustomerServiceClient>();

  beforeEach(async () => {
    jest.clearAllMocks();
    mockConfigService.get.mockImplementation((name) => {
      switch (name) {
        case 'DISABLE_SIGNUP_DEVICE_BINDING':
          return 'false';

        case 'DISABLE_LOGIN_DEVICE_BINDING':
          return 'false';

        default:
          break;
      }
    });

    const mockCognitoDetailService = createMock<ICognitoDetailService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: IAuthService, useValue: mockAuthService },
        { provide: DeviceService, useValue: mockDeviceService },
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: ICustomerServiceClient,
          useValue: mockCustomerServiceClient,
        },
        {
          provide: ICognitoDetailService,
          useValue: mockCognitoDetailService,
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signup should return SignUp Presenter object', async () => {
    jest
      .spyOn(mockDeviceService, 'checkDeviceAlreadyBound')
      .mockResolvedValueOnce(false);
    const dto: SignUpDto = new SignUpDto();
    dto.msisdnCountryCode = '+256';
    dto.msisdn = '999999999';
    dto.pin = '111111';
    dto.confirmPin = dto.pin;
    dto.deviceId = mockDevice.deviceId;
    const response = await controller.registerPhoneNumber(dto);
    expect(response).toBeInstanceOf(StatusMessagePresenter);
    expect(response.data.jwt.accessToken).toEqual('123');
    expect(response.data.jwt.refreshToken).toEqual('234');
    expect(response.data.jwt.idToken).toEqual('345');
    expect(response.data.jwt.expiresIn).toEqual(3600);
  });
  it('signup should return SignUp Presenter object', async () => {
    jest
      .spyOn(mockDeviceService, 'checkDeviceAlreadyBound')
      .mockResolvedValueOnce(false);
    const dto: SignUpDto = new SignUpDto();
    dto.msisdnCountryCode = '+256';
    dto.msisdn = '999999999';
    dto.pin = '111111';
    dto.confirmPin = dto.pin;
    dto.deviceId = mockDevice.deviceId;
    const response = await controller.registerPhoneNumber(dto);
    expect(response).toBeInstanceOf(StatusMessagePresenter);
    expect(response.data.jwt.accessToken).toEqual('123');
    expect(response.data.jwt.refreshToken).toEqual('234');
    expect(response.data.jwt.idToken).toEqual('345');
    expect(response.data.jwt.expiresIn).toEqual(3600);
  });

  it('signup should return SignUp Presenter object if device is already bound BUT DISABLE_SIGNUP_DEVICE_BINDING=true', async () => {
    jest
      .spyOn(mockDeviceService, 'checkDeviceAlreadyBound')
      .mockResolvedValueOnce(true);
    controller['DISABLE_SIGNUP_DEVICE_BINDING'] = true;
    const dto: SignUpDto = new SignUpDto();
    dto.msisdnCountryCode = '+256';
    dto.msisdn = '999999999';
    dto.pin = '111111';
    dto.confirmPin = dto.pin;
    dto.deviceId = mockDevice.deviceId;
    const response = await controller.registerPhoneNumber(dto);
    expect(response).toBeInstanceOf(StatusMessagePresenter);
    expect(response.data.jwt.accessToken).toEqual('123');
    expect(response.data.jwt.refreshToken).toEqual('234');
    expect(response.data.jwt.idToken).toEqual('345');
    expect(response.data.jwt.expiresIn).toEqual(3600);
    controller['DISABLE_SIGNUP_DEVICE_BINDING'] = false;
  });

  it('signup should return error code and message if device is already bound', async () => {
    jest
      .spyOn(mockDeviceService, 'checkDeviceAlreadyBound')
      .mockResolvedValueOnce(true);
    const dto: SignUpDto = new SignUpDto();
    dto.msisdnCountryCode = '+256';
    dto.msisdn = '999999999';
    dto.pin = '111111';
    dto.confirmPin = dto.pin;
    dto.deviceId = mockDevice.deviceId;
    const response = await controller.registerPhoneNumber(dto);
    expect(response).toBeInstanceOf(StatusMessagePresenter);
    expect(response.status).toEqual(
      ResponseStatusCode.SIGNUP_DEVICE_ALREADY_BOUND,
    );
    expect(response.message).toEqual(
      ResponseMessage.SIGNUP_DEVICE_ALREADY_BOUND,
    );
  });

  //login
  it('login should return SessionIdPresenter if input correct', async () => {
    const dto: LoginDto = new LoginDto();
    dto.msisdnCountryCode = '+256';
    dto.msisdn = '999999999';
    dto.pin = '123123';
    const response = await controller.login(dto);
    expect(response).toBeInstanceOf(StatusMessagePresenter);
    expect(response.data).toBeInstanceOf(SessionIdPresenter);
    expect(response.data.sessionId).toEqual('123');
    expect(response.data.otp).toEqual('XYZ');
  });
  it('login service should be called with the correct arguments', async () => {
    const dto: LoginDto = new LoginDto();
    dto.msisdnCountryCode = '+256';
    dto.msisdn = '999999999';
    dto.pin = '123123';
    const phoneNumber = dto.msisdnCountryCode + dto.msisdn;
    jest
      .spyOn(mockCustomerServiceClient, 'getCustomerFromFullMsisdn')
      .mockResolvedValueOnce({
        preferredName: 'Janine',
      } as any as GetCustomerFromFullMsisdnPresenter);
    const spy = jest.spyOn(mockAuthService, 'login');
    await controller.login(dto);
    expect(spy).toHaveBeenCalledWith(phoneNumber, dto.pin, 'Janine');
  });
  it('login service should return appropriate error response if deviceId does not match', async () => {
    const dto: LoginDto = new LoginDto();
    dto.msisdnCountryCode = '+256';
    dto.msisdn = '999999999';
    dto.pin = '123123';
    dto.deviceId = 'differentDeviceId123';

    jest
      .spyOn(mockDeviceService, 'checkDeviceMatches')
      .mockResolvedValueOnce(false);
    const result = await controller.login(dto);
    expect(result).toEqual({
      status: ResponseStatusCode.DEVICE_ALREADY_BOUND,
      message: ResponseMessage.DEVICE_ALREADY_BOUND,
    });
  });
  it('login should return SessionIdPresenter if deviceId does not match BUT DISABLE_LOGIN_DEVICE_BINDING=true', async () => {
    controller['DISABLE_LOGIN_DEVICE_BINDING'] = true;
    const dto: LoginDto = new LoginDto();
    dto.msisdnCountryCode = '+256';
    dto.msisdn = '999999999';
    dto.pin = '123123';
    dto.deviceId = 'differentDeviceId123';

    jest
      .spyOn(mockDeviceService, 'checkDeviceMatches')
      .mockResolvedValueOnce(false);
    const response = await controller.login(dto);
    controller['DISABLE_LOGIN_DEVICE_BINDING'] = false;
    expect(response).toBeInstanceOf(StatusMessagePresenter);
    expect(response.data).toBeInstanceOf(SessionIdPresenter);
    expect(response.data.sessionId).toEqual('123');
    expect(response.data.otp).toEqual('XYZ');
  });

  //verify login otp
  it('verify login otp should return VerifyOtpTokenPresenter if login otp correct', async () => {
    const dto: VerifyLoginOtpDto = new VerifyLoginOtpDto();
    dto.msisdnCountryCode = '+256';
    dto.msisdn = '999999999';
    dto.sessionId = '123';
    dto.otp = '123123';
    const phoneNumber = dto.msisdnCountryCode + dto.msisdn;
    const spy = jest
      .spyOn(mockAuthService, 'verifyLoginOtp')
      .mockResolvedValueOnce({
        AuthenticationResult: {
          AccessToken: '123',
          IdToken: '123',
          RefreshToken: '123',
          ExpiresIn: 123,
        },
      });
    const result = await controller.verifyOtp(dto);
    expect(spy).toBeCalledWith(dto.sessionId, phoneNumber, dto.otp);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.data).toBeInstanceOf(VerifyOtpTokenPresenter);
  });
  it('verify login otp should return VerifyOtpTokenPresenter if login otp wrong', async () => {
    const dto: VerifyLoginOtpDto = new VerifyLoginOtpDto();
    dto.msisdnCountryCode = '+256';
    dto.msisdn = '999999999';
    dto.sessionId = '123';
    dto.otp = '123123';
    jest.spyOn(mockAuthService, 'verifyLoginOtp').mockResolvedValueOnce({
      $metadata: {
        requestId: '234',
      },
      ChallengeParameters: {
        otpPrefix: 'XYZ',
      },
      Session: '123',
    });
    const result = await controller.verifyOtp(dto);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.data.sessionId).toEqual('123');
    expect(result.data.otp).toEqual('XYZ');
  });

  //reset pin
  it('should reset pin successfully', async () => {
    const resetPinDto: ResetPinDto = {
      currentPin: '1234',
      newPin: '5678',
      confirmNewPin: '5678',
    };

    const mockReq = {
      headers: {
        authorization: 'Bearer valid_token',
      },
    };

    const expectedResult = new StatusMessagePresenter(
      ResponseStatusCode.SUCCESS,
      ResponseMessage.RESET_PIN_SUCCESS,
    );

    jest.spyOn(mockAuthService, 'resetPin').mockResolvedValueOnce(true);

    const result = await controller.resetPin(resetPinDto, mockReq);

    expect(mockAuthService.resetPin).toHaveBeenCalledWith(
      'valid_token',
      '1234',
      '5678',
    );
    expect(result).toEqual(expectedResult);
  });
  it('should throw correct error status if current pin is incorrect', async () => {
    const resetPinDto: ResetPinDto = {
      currentPin: '1234',
      newPin: '5678',
      confirmNewPin: '5678',
    };

    const mockReq = {
      headers: {
        authorization: 'Bearer valid_token',
      },
    };

    const expectedResult = new StatusMessagePresenter(
      ResponseStatusCode.RESET_PIN_FAIL,
      ResponseMessage.RESET_PIN_FAIL,
    );

    jest.spyOn(mockAuthService, 'resetPin').mockRejectedValueOnce(
      new NotAuthorizedException({
        $metadata: null,
        message: 'Incorrect username or password',
        // any additional properties or options specific to the exception
      }),
    );

    const result = await controller.resetPin(resetPinDto, mockReq);
    expect(result).toEqual(expectedResult);
  });
  it('should uncaught errors should be forwarded for the exception filter to catch', async () => {
    const resetPinDto: ResetPinDto = {
      currentPin: '1234',
      newPin: '5678',
      confirmNewPin: '5678',
    };

    const mockReq = {
      headers: {
        authorization: 'Bearer valid_token',
      },
    };

    jest.spyOn(mockAuthService, 'resetPin').mockRejectedValueOnce(new Error());

    const result = controller.resetPin(resetPinDto, mockReq);
    await expect(result).rejects.toThrowError();
  });

  it('should throw an UnauthorizedException if authorization header is invalid', async () => {
    const resetPinDto: ResetPinDto = {
      currentPin: '1234',
      newPin: '5678',
      confirmNewPin: '5678',
    };

    const mockReq = {
      headers: {
        authorization: 'invalid_token',
      },
    };

    const result = await controller.resetPin(resetPinDto, mockReq);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.status).toEqual(ResponseStatusCode.INVALID_TOKEN);
    expect(result.message).toEqual(ResponseMessage.INVALID_TOKEN);
  });

  it('should Return pin not match response if newpin and confirm new pin does not match', async () => {
    const resetPinDto: ResetPinDto = {
      currentPin: '1234',
      newPin: '5678',
      confirmNewPin: '0987',
    };

    const mockReq = {
      headers: {
        authorization: 'Bearer valid_token',
      },
    };

    const result = await controller.resetPin(resetPinDto, mockReq);
    expect(result).toBeInstanceOf(StatusMessagePresenter);
    expect(result.status).toEqual(ResponseStatusCode.PIN_CONFIRM_PIN_MISMATCH);
    expect(result.message).toEqual(ResponseMessage.PIN_CONFIRM_PIN_MISTMATCH);
  });

  //logout
  it('logout should return statusMessagePresenter', async () => {
    jest.spyOn(mockAuthService, 'logout').mockResolvedValueOnce(true);
    const logoutDto = new LogoutDto();
    logoutDto.refreshToken = 'sample';
    const response = await controller.logout(logoutDto);
    expect(response).toBeInstanceOf(StatusMessagePresenter);
  });

  //Delete Cognito User
  it('List devices should return statusMessagePresenter, success case', async () => {
    jest
      .spyOn(controller['deviceService'], 'listDevices')
      .mockResolvedValueOnce([mockDevice]);
    const response = await controller.listDevices('customerId123');
    expect(response).toBeInstanceOf(StatusMessagePresenter);
    expect(response.status).toEqual(ResponseStatusCode.SUCCESS);
  });
  it('List devices should return statusMessagePresenter, failure case', async () => {
    jest
      .spyOn(controller['deviceService'], 'listDevices')
      .mockResolvedValueOnce(null);
    const response = await controller.listDevices('customerId123');
    expect(response).toBeInstanceOf(StatusMessagePresenter);
    expect(response.status).toEqual(ResponseStatusCode.FAIL);
  });

  //Delete Cognito User
  it('Delete Cognito User should return statusMessagePresenter, success case', async () => {
    jest
      .spyOn(controller['cognitoDetailService'], 'deleteCognitoCredentials')
      .mockResolvedValueOnce(mockCognitoDetail);
    const response = await controller.deleteCognitoCredentials('customerId123');
    expect(response).toBeInstanceOf(StatusMessagePresenter);
    expect(response.status).toEqual(ResponseStatusCode.SUCCESS);
  });
  it('Delete Cognito User failure case', async () => {
    jest
      .spyOn(controller['cognitoDetailService'], 'deleteCognitoCredentials')
      .mockResolvedValueOnce(null);
    const response = await controller.deleteCognitoCredentials('customerId123');
    expect(response).toBeInstanceOf(StatusMessagePresenter);
    expect(response.status).toEqual(ResponseStatusCode.FAIL);
  });

  //
});
