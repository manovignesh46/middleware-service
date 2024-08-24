import { ListUsersCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { DeviceStatus } from '../domain/enum/deviceStatus.enum';
import { OtpAction } from '../domain/enum/otp-action.enum';
import { ResponseStatusCode } from '../domain/enum/responseStatusCode.enum';
import { ICognitoDetailRepository } from '../domain/repositories/cognito-detail-repository.interface';
import { mockCognitoDetailRepository } from '../domain/repositories/mocks/cognito-detail-repository.mock';
import { ICredentialHelper } from '../domain/services/credential.service.interface';
import { ICustomerServiceClient } from '../domain/services/customerClient.interface';
import { GetCustomerFromFullMsisdnPresenter } from '../infrastructure/controllers/auth/customer/get-customer-from-full-msisdn.presenter';
import { ForgotPinResetDto } from '../infrastructure/controllers/auth/dtos/forgot-pin-reset-password.dto';
import { CustomerAlreadyExistsError } from '../infrastructure/controllers/common/errors/customer-already-exists.error';
import { LeadNotEnhancedError } from '../infrastructure/controllers/common/errors/lead-not-enhanced.error';
import { UserNotFoundError } from '../infrastructure/controllers/common/errors/user-not-found';
import { StatusMessagePresenter } from '../infrastructure/controllers/common/statusMessage.presenter';
import { Device } from '../infrastructure/entities/device.entity';
import { AwsCognitoAuthService } from './awsCognitoAuth.service';

describe('AuthService', () => {
  let service: AwsCognitoAuthService;
  let signUpAwsHelperSpy: jest.SpyInstance<any, unknown[]>;
  let signupLoginAwsHelperSpy: jest.SpyInstance<any, unknown[]>;
  let loginAwsHelperSpy: jest.SpyInstance<any, unknown[]>;
  let enableMFAHelperSpy: jest.SpyInstance<any, unknown[]>;
  let providerSendSpy: jest.SpyInstance<any, unknown[]>;
  const deviceId = 'deviceId123';
  const deviceName = 'deviceName123';
  const mockHttpService = {
    get: jest.fn(() => {
      //returns an observable
      return of({
        data: {
          leadCurrentStatus: 'LEAD_ENHANCED',
        },
      });
    }),
  };

  const mockCustServiceClient: ICustomerServiceClient = {
    createCustomerFromEnhancedLead: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<StatusMessagePresenter<any>> {
      const customerId = '123';
      return Promise.resolve({
        status: 2000,
        data: { id: customerId },
      } as StatusMessagePresenter);
    },
    deleteCustomer: function (
      customerId: string,
    ): Promise<StatusMessagePresenter<any>> {
      return Promise.resolve({ status: 2000 } as StatusMessagePresenter);
    },
    updateCustomer: function (
      customerId: string,
      cognitoId: string,
    ): Promise<StatusMessagePresenter<any>> {
      return Promise.resolve({ status: 2000 } as StatusMessagePresenter);
    },
    checkOtpVerifiedKey: function (
      customerId: string,
      otpVerifiedKey: string,
      otpAction: OtpAction,
    ): Promise<StatusMessagePresenter<any>> {
      throw new Error('Function not implemented.');
    },
    getCustomerFromFullMsisdn: function (
      fullMsisdn: string,
    ): Promise<GetCustomerFromFullMsisdnPresenter> {
      throw new Error('Function not implemented.');
    },
    updatePushDevice: function (
      customerId: string,
      deviceId: string,
      deviceOs: string,
      deviceToken: string,
    ): Promise<StatusMessagePresenter<any>> {
      throw new Error('Function not implemented.');
    },
  };

  const mockCredentialHelper: ICredentialHelper = {
    getCredentials: function () {
      return;
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        AwsCognitoAuthService,
        { provide: ICustomerServiceClient, useValue: mockCustServiceClient },
        { provide: ICredentialHelper, useValue: mockCredentialHelper },
        {
          provide: ICognitoDetailRepository,
          useValue: mockCognitoDetailRepository,
        },
      ],
    }).compile();
    service = module.get<AwsCognitoAuthService>(AwsCognitoAuthService);
    loginAwsHelperSpy = jest.spyOn(
      AwsCognitoAuthService.prototype as any,
      'loginAwsHelper',
    );
    enableMFAHelperSpy = jest.spyOn(
      AwsCognitoAuthService.prototype as any,
      'enableMFAHelper',
    );
    signUpAwsHelperSpy = jest.spyOn(
      AwsCognitoAuthService.prototype as any,
      'signUpAwsHelper',
    );
    signupLoginAwsHelperSpy = jest.spyOn(
      AwsCognitoAuthService.prototype as any,
      'signupLoginAwsHelper',
    );
    providerSendSpy = jest.spyOn(service['provider'], 'send');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Sign Up
  it('should return tokens if all inputs valid', async () => {
    const msisdnCountryCode = '+256';
    const msisdn = '999999999';
    const pin = '123123';
    const confirmPin = '123123';
    const email = 'abc@abc.com';
    const deviceName = 'deviceName123';

    signUpAwsHelperSpy.mockResolvedValueOnce(
      Promise.resolve({ UserConfirmed: true }),
    );
    signupLoginAwsHelperSpy.mockResolvedValueOnce(
      Promise.resolve({
        AuthenticationResult: {
          AccessToken: '123',
          IdToken: '123',
          RefreshToken: '123',
        },
      }),
    );
    enableMFAHelperSpy.mockImplementationOnce(() => {
      return Promise.resolve();
    });
    providerSendSpy.mockImplementationOnce(() => {
      return Promise.resolve();
    });

    const result = await service.registerPhoneNumber(
      msisdnCountryCode,
      msisdn,
      pin,
      confirmPin,
      deviceId,
      deviceName,
      email,
    );
    expect(result).toEqual({
      AccessToken: '123',
      IdToken: '123',
      RefreshToken: '123',
    });
  });
  it('signUp should call signup, login and enableMfa helper functions', async () => {
    const msisdnCountryCode = '+256';
    const msisdn = '999999999';
    const pin = '123123';
    const confirmPin = '123123';
    const email = 'abc@abc.com';

    signUpAwsHelperSpy.mockResolvedValueOnce(
      Promise.resolve({ UserConfirmed: true }),
    );
    signupLoginAwsHelperSpy.mockResolvedValueOnce(
      Promise.resolve({
        AuthenticationResult: {
          AccessToken: '123',
          IdToken: '123',
          RefreshToken: '123',
        },
      }),
    );
    enableMFAHelperSpy.mockImplementationOnce(() => {
      return Promise.resolve();
    });
    providerSendSpy.mockImplementationOnce(() => {
      return Promise.resolve();
    });
    await service.registerPhoneNumber(
      msisdnCountryCode,
      msisdn,
      pin,
      confirmPin,
      deviceId,
      deviceName,
      email,
    );
    expect(signUpAwsHelperSpy).toBeCalledTimes(1);
    expect(signupLoginAwsHelperSpy).toBeCalledTimes(1);
  });
  it('should throw error if pin and confirm pins do not match', async () => {
    const msisdnCountryCode = '+256';
    const msisdn = '999999999';
    const pin = '123123';
    const confirmPin = '111111';

    const result = service.registerPhoneNumber(
      msisdnCountryCode,
      msisdn,
      pin,
      confirmPin,
      deviceId,
      deviceName,
    );
    await expect(result).rejects.toThrowError();
  });
  it('registerPhoneNumbershould throw error if leadCurrentStatus is not LEAD_ENHANCED', async () => {
    const msisdnCountryCode = '+256';
    const msisdn = '999999999';
    const pin = '123123';
    const confirmPin = '123123';

    jest
      .spyOn(mockCustServiceClient, 'createCustomerFromEnhancedLead')
      .mockResolvedValueOnce({
        status: ResponseStatusCode.LEAD_NOT_ENHANCED,
      } as StatusMessagePresenter);
    const result = service.registerPhoneNumber(
      msisdnCountryCode,
      msisdn,
      pin,
      confirmPin,
      deviceId,
      deviceName,
    );
    await expect(result).rejects.toThrowError(LeadNotEnhancedError);
  });
  it('registerPhoneNumbershould throw CustomerNotExistsError if response status is 4007', async () => {
    const msisdnCountryCode = '+256';
    const msisdn = '999999999';
    const pin = '123123';
    const confirmPin = '123123';

    providerSendSpy.mockImplementationOnce(() => Promise.resolve());

    jest
      .spyOn(mockCustServiceClient, 'createCustomerFromEnhancedLead')
      .mockResolvedValueOnce({
        status: ResponseStatusCode.USERNAME_EXISTS,
      } as StatusMessagePresenter);

    const result = service.registerPhoneNumber(
      msisdnCountryCode,
      msisdn,
      pin,
      confirmPin,
      deviceId,
      deviceName,
    );
    await expect(result).rejects.toThrowError(CustomerAlreadyExistsError);
  });
  it('registerPhoneNumbershould throw UserNotFoundError if response status is 4004', async () => {
    const msisdnCountryCode = '+256';
    const msisdn = '999999999';
    const pin = '123123';
    const confirmPin = '123123';

    providerSendSpy.mockImplementationOnce(() => Promise.resolve());

    jest
      .spyOn(mockCustServiceClient, 'createCustomerFromEnhancedLead')
      .mockResolvedValueOnce({
        status: ResponseStatusCode.USER_NOT_FOUND,
      } as StatusMessagePresenter);

    const result = service.registerPhoneNumber(
      msisdnCountryCode,
      msisdn,
      pin,
      confirmPin,
      deviceId,
      deviceName,
    );
    await expect(result).rejects.toThrowError(UserNotFoundError);
  });
  it('registerPhoneNumber should call customerServiceClient.deleteCustomer if cognito signup throws error', async () => {
    const msisdnCountryCode = '+256';
    const msisdn = '999999999';
    const pin = '123123';
    const confirmPin = '123123';

    providerSendSpy.mockImplementationOnce(() => Promise.reject(new Error()));

    const deleteCustomerSpy = jest.spyOn(
      mockCustServiceClient,
      'deleteCustomer',
    );

    const result = service.registerPhoneNumber(
      msisdnCountryCode,
      msisdn,
      pin,
      confirmPin,
      deviceId,
      deviceName,
    );
    await expect(result).rejects.toThrowError();
    expect(deleteCustomerSpy).toBeCalledTimes(1);
    expect(deleteCustomerSpy).toBeCalledWith('123');
  });
  it('registerPhoneNumber should create new cognitoDetail with correct argument', async () => {
    const msisdnCountryCode = '+256';
    const msisdn = '999999999';
    const pin = '123123';
    const confirmPin = '123123';
    signUpAwsHelperSpy.mockResolvedValueOnce(
      Promise.resolve({ UserConfirmed: true, UserSub: 'cognitoId123' }),
    );
    providerSendSpy.mockImplementationOnce(() => {
      return Promise.resolve();
    });
    signupLoginAwsHelperSpy.mockResolvedValueOnce(
      Promise.resolve({
        AuthenticationResult: {
          AccessToken: '123',
          IdToken: '123',
          RefreshToken: '123',
        },
      }),
    );
    const spy = jest.spyOn(mockCognitoDetailRepository, 'create');

    await service.registerPhoneNumber(
      msisdnCountryCode,
      msisdn,
      pin,
      confirmPin,
      deviceId,
      deviceName,
    );
    expect(spy).toBeCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith({
      cognitoId: 'cognitoId123',
      customerId: '123',
      devices: [
        {
          deviceId: 'deviceId123',
          isActive: true,
          deviceName: 'deviceName123',
          deviceStatus: DeviceStatus.ACTIVE,
          deviceStatusDate: expect.any(Date),
        },
      ],
      msisdn: '999999999',
      msisdnCountryCode: '+256',
    });
  });

  //Login
  it('service.login should call loginAwsHelper function', async () => {
    const phoneNumber = '+256999999999';
    const pin = '123123';
    providerSendSpy.mockResolvedValue(null);
    loginAwsHelperSpy.mockResolvedValueOnce({
      $metadata: {
        requestId: '234',
      },
      ChallengeResponses: {
        otpPrefix: 'XYZ',
      },
      Session: '123',
    });
    await service.login(phoneNumber, pin, 'Janine');
    expect(loginAwsHelperSpy).toBeCalledTimes(1);
    expect(loginAwsHelperSpy).toBeCalledWith(phoneNumber, pin, 'Janine');
  });

  //Verify Login
  it('service.verifyLogin should call provider.send', async () => {
    const sessionId = '123';
    const phoneNumber = '+256999999999';
    const otp = '123123';
    providerSendSpy.mockResolvedValue(null);
    await service.verifyLoginOtp(sessionId, phoneNumber, otp);
    expect(providerSendSpy).toBeCalledTimes(1);
  });

  //reset pin
  it('should return true if password change is successful', async () => {
    const accessToken = 'valid_access_token';
    const currentPin = '1234';
    const newPin = '5678';

    const commandResponse = {
      $metadata: {
        httpStatusCode: 200,
      },
    };

    providerSendSpy.mockResolvedValueOnce(commandResponse);

    const result = await service.resetPin(accessToken, currentPin, newPin);

    expect(providerSendSpy).toHaveBeenCalledTimes(1);
    expect(providerSendSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          AccessToken: accessToken,
          PreviousPassword: currentPin,
          ProposedPassword: newPin,
        },
      }),
    );
    expect(result).toEqual(true);
  });

  it('should return false if password change is not successful', async () => {
    const accessToken = 'valid_access_token';
    const currentPin = '1234';
    const newPin = '5678';

    providerSendSpy.mockResolvedValueOnce({});

    const result = await service.resetPin(accessToken, currentPin, newPin);

    expect(providerSendSpy).toHaveBeenCalledTimes(1);
    expect(providerSendSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          AccessToken: accessToken,
          PreviousPassword: currentPin,
          ProposedPassword: newPin,
        },
      }),
    );
    expect(result).toEqual(false);
  });
  it('should revoke token and return true if successful', async () => {
    // Arrange
    const refreshToken = 'test-refresh-token';
    const responseMetadata = { requestId: 'test-request-id' };
    // const expectedInput = {
    //   Token: refreshToken,
    //   ClientId: 'sample',
    // };
    // const expectedCommand = new RevokeTokenCommand(expectedInput);
    const expectedResponse = { $metadata: responseMetadata };
    providerSendSpy.mockResolvedValue(expectedResponse);

    // Act
    const result = await service.logout(refreshToken);

    // Assert
    expect(providerSendSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it('should return false if response has no metadata', async () => {
    // Arrange
    const refreshToken = 'test-refresh-token';
    const responseMetadata = undefined;
    // const expectedInput = {
    //   Token: refreshToken,
    //   ClientId: 'sample',
    // };
    // const expectedCommand = new RevokeTokenCommand(expectedInput);
    const expectedResponse = { $metadata: responseMetadata };
    providerSendSpy.mockResolvedValue(expectedResponse);

    // Act
    const result = await service.logout(refreshToken);

    // Assert
    expect(providerSendSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });
  describe('forgotPinResetPassword', () => {
    const dto: ForgotPinResetDto = {
      customerId: 'customer123',
      otpVerifiedKey: 'otpVerifiedKey123',
      newPin: '111111',
      confirmNewPin: '111111',
      otpAction: OtpAction.FORGOT_PIN,
    };
    it('Should Be successful', async () => {
      jest
        .spyOn(mockCustServiceClient, 'checkOtpVerifiedKey')
        .mockResolvedValueOnce({
          status: 2000,
          data: { isVerified: true, cognitoId: 'cognito123' },
        } as StatusMessagePresenter);

      providerSendSpy.mockResolvedValueOnce({ $metadata: 'hi' });
      const res = await service.forgotPinResetPassword(dto);
      expect(res).toEqual(true);
    });
    it('Should fail if isVerified is false', async () => {
      jest
        .spyOn(mockCustServiceClient, 'checkOtpVerifiedKey')
        .mockResolvedValueOnce({
          status: 4000,
          data: { isVerified: false },
        } as StatusMessagePresenter);

      providerSendSpy.mockResolvedValueOnce({ $metadata: 'hi' });
      const res = await service.forgotPinResetPassword(dto);
      expect(res).toEqual(false);
    });
    it('Should call awsClient to list users then reset password if cognitoId is Null', async () => {
      jest
        .spyOn(mockCustServiceClient, 'checkOtpVerifiedKey')
        .mockResolvedValueOnce({
          status: 2000,
          data: {
            isVerified: true,
            cognitoId: null,
            msisdnCountryCode: '+256',
            msisdn: '999999999',
          },
        } as StatusMessagePresenter);
      const updateCustSpy = jest.spyOn(mockCustServiceClient, 'updateCustomer');
      const mockListUsersResponse: ListUsersCommandOutput = {
        $metadata: undefined,
        Users: [
          { Attributes: [{ Name: 'sub', Value: 'nowIHaveACognitoId123' }] },
        ],
      };
      providerSendSpy.mockResolvedValueOnce(mockListUsersResponse); // first time is for ListUsers
      providerSendSpy.mockResolvedValueOnce({ $metadata: 'hi' }); // second time is for reset pin
      const res = await service.forgotPinResetPassword(dto);
      expect(providerSendSpy).toBeCalledTimes(2); //#1 listUsers, #2 resetPin
      expect(providerSendSpy).toHaveBeenCalledWith(
        //#1 listUsers
        expect.objectContaining({
          input: {
            AttributesToGet: ['sub', 'phone_number'],
            Filter: 'phone_number = "+256999999999"',
            UserPoolId: 'sample',
          },
        }),
      );
      expect(providerSendSpy).toHaveBeenCalledWith(
        //#2 resetPin
        expect.objectContaining({
          input: {
            Password: '111111',
            Permanent: true,
            UserPoolId: 'sample',
            Username: 'nowIHaveACognitoId123',
          },
        }),
      );
      expect(updateCustSpy).toBeCalledWith(
        'customer123',
        'nowIHaveACognitoId123',
      );
      expect(res).toEqual(true);
    });
  });

  it('adminDeleteUser true', async () => {
    const providerSpy = jest
      .spyOn(service['provider'], 'send')
      .mockResolvedValueOnce({ $metadata: 'some metadata' } as never);
    const res = await service.adminDeleteUser('cognitoId123');
    expect(providerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        input: { UserPoolId: 'sample', Username: 'cognitoId123' },
      }),
    );
    expect(res).toEqual(true);
  });
  it('adminDeleteUser true', async () => {
    jest.spyOn(service['provider'], 'send').mockResolvedValueOnce({} as never);
    const res = await service.adminDeleteUser('cognitoId123');
    expect(res).toEqual(false);
  });
});
