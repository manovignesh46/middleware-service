import {
  NotAuthorizedException,
  UserNotFoundException,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBadRequestResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiBodyWithJWTBearerToken } from '../../../decorators/api-body-with-jwt.decorator';
import { StatusMessageWrapper } from '../../../decorators/status-message-wrapper.decorator';
import { OtpAction } from '../../../domain/enum/otp-action.enum';
import { ResponseMessage } from '../../../domain/enum/responseMessage.enum';
import { ResponseStatusCode } from '../../../domain/enum/responseStatusCode.enum';
import { IDevice } from '../../../domain/models/device.interface';
import { IAuthService } from '../../../domain/services/authService.interface';
import { ICognitoDetailService } from '../../../domain/services/cognito-detail.service.interface';
import { ICustomerServiceClient } from '../../../domain/services/customerClient.interface';
import { InternalAuthGuard } from '../../../guards/internal-auth-guard';
import { DeviceService } from '../../services/device.service';
import { CustomerAlreadyExistsError } from '../common/errors/customer-already-exists.error';
import { ErrorMessage } from '../common/errors/enums/errorMessage.enum';
import { LeadNotEnhancedError } from '../common/errors/lead-not-enhanced.error';
import { UserNotFoundError } from '../common/errors/user-not-found';
import { StatusMessagePresenter } from '../common/statusMessage.presenter';
import {
  LoginDto,
  ResetPinDto,
  SignUpDto,
  VerifyLoginOtpDto,
  LogoutDto,
} from './auth.dto';
import {
  SessionIdPresenter,
  SignUpPresenter,
  VerifyOtpTokenPresenter,
} from './auth.presenter';
import { GetCustomerFromFullMsisdnPresenter } from './customer/get-customer-from-full-msisdn.presenter';
import {
  ForgotPinResetDto,
  GeneralResetPinDto,
} from './dtos/forgot-pin-reset-password.dto';
import { RegisterNewDeviceGeneralDto } from './dtos/register-new-device-general.dto';
import { ListDevicesPresenter } from './presenters/list-devices.presenter';

@Controller('v1/auth')
export class AuthController {
  private DISABLE_SIGNUP_DEVICE_BINDING: boolean;
  private DISABLE_LOGIN_DEVICE_BINDING: boolean;
  constructor(
    private readonly authService: IAuthService,
    private deviceService: DeviceService,
    private customerServiceClient: ICustomerServiceClient,
    private cognitoDetailService: ICognitoDetailService,
    private configService: ConfigService,
  ) {
    this.DISABLE_SIGNUP_DEVICE_BINDING =
      configService.get<string>('DISABLE_SIGNUP_DEVICE_BINDING') === 'true';
    this.DISABLE_LOGIN_DEVICE_BINDING =
      configService.get<string>('DISABLE_LOGIN_DEVICE_BINDING') === 'true';

    if (this.DISABLE_SIGNUP_DEVICE_BINDING)
      this.logger.log(
        `DISABLE_SIGNUP_DEVICE_BINDING: ${this.DISABLE_SIGNUP_DEVICE_BINDING}`,
      );

    if (this.DISABLE_LOGIN_DEVICE_BINDING)
      this.logger.log(
        `DISABLE_LOGIN_DEVICE_BINDING: ${this.DISABLE_LOGIN_DEVICE_BINDING}`,
      );
  }
  private logger = new Logger(AuthController.name);

  @Post('signup')
  @ApiTags('Authentication')
  @ApiBody({ type: SignUpDto })
  @StatusMessageWrapper(
    SignUpPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.COGNITO_SIGN_UP_SUCCESS,
  )
  async registerPhoneNumber(@Body() signUpDto: SignUpDto) {
    const { msisdnCountryCode, msisdn, pin, confirmPin, deviceId, deviceName } =
      signUpDto;
    let email;
    if (signUpDto?.email !== '') {
      email = signUpDto.email;
    }
    const isDeviceAlreadyBound =
      await this.deviceService.checkDeviceAlreadyBound(deviceId);
    if (isDeviceAlreadyBound && !this.DISABLE_SIGNUP_DEVICE_BINDING) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SIGNUP_DEVICE_ALREADY_BOUND,
        ResponseMessage.SIGNUP_DEVICE_ALREADY_BOUND,
      );
    }
    try {
      const data = await this.authService.registerPhoneNumber(
        msisdnCountryCode,
        msisdn,
        pin,
        confirmPin,
        deviceId,
        deviceName,
        email || null,
      );
      const accessToken = data.AccessToken;
      const refreshToken = data.RefreshToken;
      const idToken = data.IdToken;
      const expiresIn = data.ExpiresIn;

      const signUpPresenter = new SignUpPresenter(
        accessToken,
        expiresIn,
        refreshToken,
        idToken,
      );
      const status = ResponseStatusCode.SUCCESS;
      const message = ResponseMessage.COGNITO_SIGN_UP_SUCCESS;

      const customer: GetCustomerFromFullMsisdnPresenter =
        await this.customerServiceClient.getCustomerFromFullMsisdn(
          msisdnCountryCode + msisdn,
        );
      if (isDeviceAlreadyBound && this.DISABLE_SIGNUP_DEVICE_BINDING) {
        await this.deviceService.deregisterAndRegisterDevice(
          customer.customerId,
          deviceId, //unlink from prevous user
          deviceId, //link to current user
          deviceName,
        );
      }
      await this.deviceService.updateLastDeviceSession(customer?.customerId);
      return new StatusMessagePresenter(status, message, {
        jwt: signUpPresenter,
      });
    } catch (e) {
      this.logger.error(e.stack);
      let status;
      let message;
      if (
        e instanceof CustomerAlreadyExistsError ||
        e instanceof UsernameExistsException
      ) {
        status = ResponseStatusCode.USERNAME_EXISTS;
        message = ResponseMessage.USERNAME_EXISTS;
      } else if (e instanceof LeadNotEnhancedError) {
        status = ResponseStatusCode.LEAD_NOT_ENHANCED;
        message = ResponseMessage.LEAD_NOT_ENHANCED;
      } else if (e instanceof UserNotFoundError) {
        status = ResponseStatusCode.USER_NOT_FOUND;
        message = ResponseMessage.USER_NOT_FOUND;
      } else {
        throw e;
      }
      return new StatusMessagePresenter(status, message);
    }
  }

  @Post('login')
  @ApiTags('Authentication')
  @ApiBody({ type: LoginDto })
  @StatusMessageWrapper(
    SessionIdPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.TRIGGER_LOGIN_SUCCESS,
  )
  @ApiBadRequestResponse({
    description: 'Request missing phoneNumber parameter',
  })
  async login(@Body() loginDto: LoginDto) {
    const { msisdnCountryCode, msisdn, pin, deviceId } = loginDto;

    //throws error if user login is locked
    await this.cognitoDetailService.canLogin(msisdnCountryCode, msisdn);

    const fullPhoneNumber = msisdnCountryCode + msisdn;
    const isLoginEligible: boolean = await this.authService.isLoginEligible(
      msisdnCountryCode,
      msisdn,
    );
    if (isLoginEligible === null) {
      return new StatusMessagePresenter(
        ResponseStatusCode.TRIGGER_LOGIN_FAIL,
        ResponseMessage.TRIGGER_LOGIN_FAIL,
        null,
      );
    }
    if (!isLoginEligible) {
      return new StatusMessagePresenter(
        ResponseStatusCode.LOGIN_OPTOUT_OR_CLOSED,
        ResponseMessage.LOGIN_OPTOUT_OR_CLOSED,
        null,
      );
    }

    const isDeviceIdMatch = await this.deviceService.checkDeviceMatches(
      msisdnCountryCode,
      msisdn,
      deviceId,
    );
    if (!isDeviceIdMatch && !this.DISABLE_LOGIN_DEVICE_BINDING) {
      return new StatusMessagePresenter(
        ResponseStatusCode.DEVICE_ALREADY_BOUND,
        ResponseMessage.DEVICE_ALREADY_BOUND,
      );
    }

    try {
      const { preferredName } =
        await this.customerServiceClient.getCustomerFromFullMsisdn(
          fullPhoneNumber,
        );
      const data = await this.authService.login(
        fullPhoneNumber,
        pin,
        preferredName || 'Valued Customer',
      );
      await this.cognitoDetailService.incrementOtpSentCount(
        msisdnCountryCode,
        msisdn,
      );
      const sessionIdPresenter = new SessionIdPresenter(data);
      const status = ResponseStatusCode.SUCCESS;
      const message = ResponseMessage.TRIGGER_LOGIN_SUCCESS;

      return new StatusMessagePresenter(status, message, sessionIdPresenter);
    } catch (e) {
      if (
        e instanceof NotAuthorizedException &&
        e.message === 'Incorrect username or password.'
      ) {
        await this.cognitoDetailService.incrementFailedAttempts(
          msisdnCountryCode,
          msisdn,
        );
        const status = ResponseStatusCode.TRIGGER_LOGIN_FAIL;
        const messaage = ResponseMessage.TRIGGER_LOGIN_FAIL;
        return new StatusMessagePresenter(status, messaage);
      } else if (e instanceof UserNotFoundException) {
        this.logger.error(e, e.stack);
        const status = ResponseStatusCode.TRIGGER_LOGIN_FAIL;
        const messaage = ResponseMessage.TRIGGER_LOGIN_FAIL;
        return new StatusMessagePresenter(status, messaage);
      }
      console.log(e, e.stack);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('verify-login-otp')
  @ApiTags('Authentication')
  @ApiBody({ type: VerifyLoginOtpDto })
  @StatusMessageWrapper(
    VerifyOtpTokenPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.VERIFY_LOGIN_OTP_SUCCESS,
  )
  @ApiBadRequestResponse({
    description: 'Request body missing sessionID / phoneNumber / otp',
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyLoginOtpDto) {
    const {
      sessionId,
      msisdnCountryCode,
      msisdn,
      otp,
      deviceId,
      deviceOs,
      deviceToken,
    } = verifyOtpDto;
    const fullPhoneNumber = msisdnCountryCode + msisdn;
    try {
      const data = await this.authService.verifyLoginOtp(
        sessionId,
        fullPhoneNumber,
        otp,
      );
      if (data.AuthenticationResult) {
        //reset failed login count once user successfully logs in
        await this.cognitoDetailService.resetFailedAttempts(
          msisdnCountryCode,
          msisdn,
        );
        const { AccessToken, ExpiresIn, RefreshToken, IdToken } =
          data.AuthenticationResult;
        const verifyOtpTokenPresenter = new VerifyOtpTokenPresenter(
          AccessToken,
          ExpiresIn,
          RefreshToken,
          IdToken,
        );

        const customer: GetCustomerFromFullMsisdnPresenter =
          await this.customerServiceClient.getCustomerFromFullMsisdn(
            msisdnCountryCode + msisdn,
          );

        await this.deviceService.updateLastDeviceSession(customer?.customerId);

        if (customer?.customerId && deviceId && deviceOs && deviceToken) {
          //Register Device for Push Notifications
          await this.customerServiceClient.updatePushDevice(
            customer.customerId,
            deviceId,
            deviceOs,
            deviceToken,
          );
        }

        const status = ResponseStatusCode.SUCCESS;
        const message = ResponseMessage.VERIFY_LOGIN_OTP_SUCCESS;
        return new StatusMessagePresenter(
          status,
          message,
          verifyOtpTokenPresenter,
        );
      } else {
        const sessionIdPresenter = new SessionIdPresenter(data);
        const status = ResponseStatusCode.OTP_FAIL;
        const message = ResponseMessage.OTP_FAIL;
        return new StatusMessagePresenter(status, message, sessionIdPresenter);
      }
    } catch (e) {
      console.log(e, e.stack);
      if (
        e instanceof NotAuthorizedException &&
        e.message === 'Incorrect username or password.'
      ) {
        const status = ResponseStatusCode.OTP_FAIL;
        const message = ResponseMessage.OTP_FAIL;
        return new StatusMessagePresenter(status, message);
      } else if (
        e instanceof NotAuthorizedException &&
        e.message === 'Invalid session for the user.'
      ) {
        const status = ResponseStatusCode.OTP_EXPIRED;
        const message = ResponseMessage.OTP_EXPIRED;
        return new StatusMessagePresenter(status, message);
      } else {
        throw e;
      }
    }
  }

  @Post('reset-pin')
  @ApiTags('Reset PIN')
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.RESET_PIN_SUCCESS,
  )
  async resetPin(@Body() resetPinDto: ResetPinDto, @Req() req) {
    if (resetPinDto.newPin !== resetPinDto.confirmNewPin) {
      const status = ResponseStatusCode.PIN_CONFIRM_PIN_MISMATCH;
      const message = ResponseMessage.PIN_CONFIRM_PIN_MISTMATCH;
      return new StatusMessagePresenter(status, message);
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const status = ResponseStatusCode.INVALID_TOKEN;
      const message = ResponseMessage.INVALID_TOKEN;
      return new StatusMessagePresenter(status, message);
    }

    const token = authHeader.substring(7); // remove 'Bearer ' from the beginning
    let isResetPinSuccess: boolean;
    try {
      isResetPinSuccess = await this.authService.resetPin(
        token,
        resetPinDto.currentPin,
        resetPinDto.newPin,
      );
    } catch (err) {
      this.logger.error(err);
      if (err instanceof NotAuthorizedException) {
        const status = ResponseStatusCode.RESET_PIN_FAIL;
        const message = ResponseMessage.RESET_PIN_FAIL;
        return new StatusMessagePresenter(status, message);
      }
      throw err;
    }
    if (isResetPinSuccess) {
      const status = ResponseStatusCode.SUCCESS;
      const message = ResponseMessage.RESET_PIN_SUCCESS;
      return new StatusMessagePresenter(status, message);
    }
  }
  @Post('logout')
  @ApiTags('Authentication')
  @ApiBodyWithJWTBearerToken({ type: LogoutDto })
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.LOGOUT_SUCCESS,
  )
  async logout(@Body() logoutDto: LogoutDto) {
    const refreshToken = logoutDto.refreshToken;
    try {
      const isLogoutSuccess = await this.authService.logout(refreshToken);
      if (isLogoutSuccess) {
        const status = ResponseStatusCode.SUCCESS;
        const message = ResponseMessage.LOGOUT_SUCCESS;
        return new StatusMessagePresenter(status, message);
      }
    } catch (err) {
      this.logger.error(err.stack);
      const status = ResponseStatusCode.LOGOUT_FAIL;
      const message = ResponseMessage.LOGOUT_FAIL;
      return new StatusMessagePresenter(status, message);
    }
  }

  @Post('reset-pin-general')
  @ApiTags('Reset PIN')
  @ApiBody({ type: ForgotPinResetDto })
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.RESET_PIN_SUCCESS,
  )
  async resetPinGeneral(@Body() dto: GeneralResetPinDto) {
    switch (dto.otpAction) {
      case OtpAction.FORGOT_PIN:
        const forgotPinResetDto: ForgotPinResetDto = dto as ForgotPinResetDto;
        const isVerified = await this.authService.forgotPinResetPassword(
          forgotPinResetDto,
        );
        if (isVerified) {
          return new StatusMessagePresenter(
            ResponseStatusCode.SUCCESS,
            ResponseMessage.RESET_PIN_SUCCESS,
          );
        } else {
          return new StatusMessagePresenter(
            ResponseStatusCode.RESET_PIN_FAIL,
            ResponseMessage.FORGOT_PIN_RESET_FAIL,
          );
        }
      default:
        break;
    }
  }

  @Post('register-new-device-general')
  @ApiTags('Register Device')
  @ApiBody({ type: RegisterNewDeviceGeneralDto })
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.REGISTER_DEVICE_SUCCESS,
  )
  async registerNewDeviceGeneral(@Body() dto: RegisterNewDeviceGeneralDto) {
    const {
      customerId,
      oldDeviceId,
      newDeviceId,
      newDeviceName,
      otpVerifiedKey,
    } = dto;

    const checkOtpVerifiedKeyResponse =
      await this.customerServiceClient.checkOtpVerifiedKey(
        customerId,
        otpVerifiedKey,
        OtpAction.NEW_DEVICE_REGISTRATION,
      );
    this.logger.debug(checkOtpVerifiedKeyResponse);
    const { isVerified } = checkOtpVerifiedKeyResponse?.data || {};

    if (!isVerified)
      return new StatusMessagePresenter(
        ResponseStatusCode.RESET_PIN_FAIL,
        ResponseMessage.REGISTER_NEW_DEVICE_OTP_VERIFICATION_KEY_FAIL,
      );

    let device: IDevice;
    if (oldDeviceId === newDeviceId) {
      return new StatusMessagePresenter(
        ResponseStatusCode.MATCHING_DEVICE_ID,
        ResponseMessage.MATCHING_DEVICE_ID,
      );
    }
    try {
      device = await this.deviceService.deregisterAndRegisterDevice(
        customerId,
        oldDeviceId,
        newDeviceId,
        newDeviceName,
      );
    } catch (e) {
      if ((e.message = ErrorMessage.NO_OLD_DEVICE)) {
        return new StatusMessagePresenter(
          ResponseStatusCode.NO_OLD_DEVICE,
          ResponseMessage.NO_OLD_DEVICE,
        );
      }
      throw e;
    }
    if (device) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.REGISTER_DEVICE_SUCCESS,
      );
    }
  }

  @Get('internal/list-devices/:customerid')
  @ApiTags('Internal Endpoints')
  @UseGuards(InternalAuthGuard)
  @StatusMessageWrapper(ListDevicesPresenter)
  async listDevices(@Param('customerid') customerId: string) {
    const deviceList = await this.deviceService.listDevices(customerId);
    if (deviceList && deviceList?.length > 0) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.SUCCESS,
        { deviceList },
      );
    } else {
      return new StatusMessagePresenter(
        ResponseStatusCode.FAIL,
        ResponseMessage.FAIL,
      );
    }
  }

  @Delete('internal/delete-cognito-user/:customerid')
  @ApiTags('Internal Endpoints')
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUCCESS,
  )
  @UseGuards(InternalAuthGuard) //ToDo change to @InternalEndpoint() when FUR-9007 is done
  async deleteCognitoCredentials(@Param('customerid') customerId: string) {
    try {
      const cognitoDetail =
        await this.cognitoDetailService.deleteCognitoCredentials(customerId);
      if (cognitoDetail) {
        return new StatusMessagePresenter(
          ResponseStatusCode.SUCCESS,
          ResponseMessage.SUCCESS,
        );
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
    return new StatusMessagePresenter(
      ResponseStatusCode.FAIL,
      ResponseMessage.FAIL,
    );
  }
}
