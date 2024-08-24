import {
  SRPClient,
  calculateSignature,
  getNowString,
} from 'amazon-user-pool-srp-client';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ChallengeNameType,
  AuthFlowType,
  CognitoIdentityProvider,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
  SetUserMFAPreferenceCommand,
  SetUserMFAPreferenceCommandInput,
  SignUpCommand,
  SignUpCommandInput,
  RespondToAuthChallengeCommandInput,
  RespondToAuthChallengeCommand,
  ChangePasswordCommand,
  RevokeTokenCommand,
  ListUsersCommand,
  SignUpCommandOutput,
  ListUsersCommandOutput,
  AdminSetUserPasswordCommand,
  AdminDeleteUserCommand,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { IAuthService } from '../domain/services/authService.interface';
import { ICustomerServiceClient } from '../domain/services/customerClient.interface';
import { StatusMessagePresenter } from '../infrastructure/controllers/common/statusMessage.presenter';
import { createHmac } from 'crypto';
import { ResponseStatusCode } from '../domain/enum/responseStatusCode.enum';
import { PinConfirmPinMismatchError } from '../infrastructure/controllers/common/errors/pin-confirm-pin-mismatch.error';
import { LeadNotEnhancedError } from '../infrastructure/controllers/common/errors/lead-not-enhanced.error';
import { CustomerAlreadyExistsError } from '../infrastructure/controllers/common/errors/customer-already-exists.error';
import { ICredentialHelper } from '../domain/services/credential.service.interface';
import { UserNotFoundError } from '../infrastructure/controllers/common/errors/user-not-found';
import { ForgotPinResetDto } from '../infrastructure/controllers/auth/dtos/forgot-pin-reset-password.dto';
import { CognitoDetail } from '../infrastructure/entities/cognito-detail.entity';
import { IDevice } from '../domain/models/device.interface';
import { ICognitoDetailRepository } from '../domain/repositories/cognito-detail-repository.interface';
import { DeviceStatus } from '../domain/enum/deviceStatus.enum';
import { GetCustomerFromFullMsisdnPresenter } from '../infrastructure/controllers/auth/customer/get-customer-from-full-msisdn.presenter';
import { ClientStatus } from '../domain/enum/customer/clientStatus.enum';

@Injectable()
export class AwsCognitoAuthService implements IAuthService {
  private provider: CognitoIdentityProvider;
  private clientId: string;
  private clientSecret: string;
  private region: string;
  private userPoolId: string;
  private otpAutoReadKey: string;
  constructor(
    private configService: ConfigService,
    private customerServiceClient: ICustomerServiceClient,
    private credentialHelper: ICredentialHelper,
    private cognitoDetailsRepository: ICognitoDetailRepository,
  ) {
    this.clientId = configService.get<string>('COGNITO_CLIENT_ID');
    this.clientSecret = configService.get<string>('COGNITO_CLIENT_SECRET');
    this.region = configService.get<string>('REGION');
    this.userPoolId = configService.get<string>('COGNITO_USER_POOL_ID');
    this.otpAutoReadKey = configService.get<string>('OTP_AUTO_READ_KEY');
    const awsCredentials = this.credentialHelper.getCredentials();
    this.provider = new CognitoIdentityProvider({
      credentials: awsCredentials,
      region: this.region,
    });
  }

  private readonly logger = new Logger(AwsCognitoAuthService.name);

  // returns true if pin successfully reset, else throws error
  async resetPin(
    accessToken: string,
    currentPin: string,
    newPin: string,
  ): Promise<boolean> {
    this.logger.log(this.resetPin.name);
    const input = {
      PreviousPassword: currentPin,
      ProposedPassword: newPin,
      AccessToken: accessToken,
    };
    const command = new ChangePasswordCommand(input);
    const response = await this.provider.send(command);
    if (response?.$metadata) {
      return true;
    }
    return false;
  }

  async logout(refreshToken: string): Promise<boolean> {
    const input = {
      // RevokeTokenRequest
      Token: refreshToken,
      ClientId: this.clientId,
      ClientSecret: this.clientSecret,
    };
    const command = new RevokeTokenCommand(input);
    const response = await this.provider.send(command);
    if (response?.$metadata) {
      return true;
    }
    return false;
  }
  async registerPhoneNumber(
    msisdnCountryCode: string,
    msisdn: string,
    pin: string,
    confirmPin: string,
    deviceId: string,
    deviceName: string,
    email?: string,
  ) {
    this.logger.log(this.registerPhoneNumber.name);
    if (pin !== confirmPin) {
      throw new PinConfirmPinMismatchError('Pin and confirmPin do not match');
    }

    /* Connect Customer Service to check if LEAD_ENHANCED and create customer primary details */
    const response: StatusMessagePresenter =
      await this.customerServiceClient.createCustomerFromEnhancedLead(
        msisdnCountryCode,
        msisdn,
      );
    if (response?.status === ResponseStatusCode.LEAD_NOT_ENHANCED) {
      this.logger.log(LeadNotEnhancedError.name);
      throw new LeadNotEnhancedError('Lead Not Enhanced');
    } else if (response?.status === ResponseStatusCode.USERNAME_EXISTS) {
      this.logger.log(CustomerAlreadyExistsError.name);
      throw new CustomerAlreadyExistsError(
        'Customer with Matching Lead id exists',
      );
    } else if (response.status === ResponseStatusCode.USER_NOT_FOUND) {
      throw new UserNotFoundError('No Such User found');
    }
    const customerId = response.data.id;
    const fullPhoneNumber = msisdnCountryCode + msisdn;
    let signUpResponse: SignUpCommandOutput;
    try {
      signUpResponse = await this.signUpAwsHelper(
        fullPhoneNumber,
        pin,
        customerId,
        email,
      );
      this.logger.log('customer created in cognito with cognito response:');
      this.logger.debug(signUpResponse);
    } catch (err) {
      this.logger.error('error when creating customer in cognito');
      this.logger.log('delete customer from customerPrimaryDetails Table');
      this.customerServiceClient.deleteCustomer(customerId);
      throw err;
    }
    if (signUpResponse?.UserConfirmed) {
      // Create Device
      const newDevice: IDevice = {
        deviceId: deviceId,
        isActive: true,
        deviceName: deviceName,
        deviceStatus: DeviceStatus.ACTIVE,
        deviceStatusDate: new Date(),
      } as IDevice;

      // Create Cognito Detail
      const newCognitoDetail: CognitoDetail = {
        customerId: customerId,
        cognitoId: signUpResponse?.UserSub,
        msisdnCountryCode: msisdnCountryCode,
        msisdn: msisdn,
        devices: [newDevice],
      } as CognitoDetail;

      this.logger.log(
        `Creating New CognitoDetail customerId: ${customerId} with Device: ${deviceId}`,
      );
      //Save CognitoDetail with Device
      this.cognitoDetailsRepository.create(newCognitoDetail);

      const loginResponse = await this.signupLoginAwsHelper(
        fullPhoneNumber,
        pin,
      );
      const updateCustomerResponse =
        await this.customerServiceClient.updateCustomer(
          customerId,
          signUpResponse?.UserSub,
        );
      if (
        updateCustomerResponse &&
        updateCustomerResponse?.status !== ResponseStatusCode.SUCCESS
      ) {
        this.logger.error(
          `Error Updating cognitoId for user: ${customerId}. CognitoId is: ${signUpResponse?.UserSub}`,
        );
      }
      this.logger.debug(`${this.signupLoginAwsHelper.name} response`);
      this.logger.debug(loginResponse);
      const tokens = loginResponse.AuthenticationResult;
      // await this.enableMFAHelper(tokens.AccessToken);
      return tokens;
    }
  }

  async isLoginEligible(msisdnCountryCode: string, msisdn: string) {
    const fullMsisdn = msisdnCountryCode + msisdn;
    const custDetails: GetCustomerFromFullMsisdnPresenter =
      await this.customerServiceClient.getCustomerFromFullMsisdn(fullMsisdn);
    if (custDetails === null) return null;
    if (
      ClientStatus.OPTOUT === custDetails?.clientStatus ||
      ClientStatus.CLOSED === custDetails?.clientStatus
    ) {
      return false;
    }
    const cognitoDetails = await this.cognitoDetailsRepository.findByMsisdn(
      msisdnCountryCode,
      msisdn,
    );
    //cognitoId is null if otp-out for user has occured
    if (cognitoDetails && !cognitoDetails.cognitoId) {
      return false;
    }
    return true;
  }

  login(phoneNumber: string, pin: string, preferredName: string) {
    this.logger.log(this.login.name);
    return this.loginAwsHelper(phoneNumber, pin, preferredName);
  }

  async verifyLoginOtp(sessionId: string, phoneNumber: string, otp: string) {
    this.logger.log(this.verifyLoginOtp.name);
    const params: RespondToAuthChallengeCommandInput = {
      ClientId: this.clientId,
      ChallengeName: ChallengeNameType.CUSTOM_CHALLENGE,
      Session: sessionId,
      ChallengeResponses: {
        USERNAME: phoneNumber,
        ANSWER: otp,
        SECRET_HASH: this.calculateSecretHash(
          phoneNumber,
          this.clientId,
          this.clientSecret,
        ),
      },
    };
    const command = new RespondToAuthChallengeCommand(params);
    const response = await this.provider.send(command);
    return response;
  }

  async forgotPinResetPassword(dto: ForgotPinResetDto): Promise<boolean> {
    const { customerId, otpVerifiedKey, otpAction, newPin, confirmNewPin } =
      dto;
    if (newPin !== confirmNewPin) {
      throw new Error('Pin and confirm pin do not match');
    }

    //Check validity of otpVerifiedKey
    const checkOtpVerifiedKeyResponse =
      await this.customerServiceClient.checkOtpVerifiedKey(
        customerId,
        otpVerifiedKey,
        otpAction,
      );
    this.logger.debug(checkOtpVerifiedKeyResponse);
    const { isVerified, msisdnCountryCode, msisdn } =
      checkOtpVerifiedKeyResponse?.data || {};
    let cognitoId = checkOtpVerifiedKeyResponse?.data?.cognitoId;
    if (isVerified) {
      //CognitoId should not be null, but just in case there was an error in Customers Service Storing cognitoId (sub) during SignUp
      if (!cognitoId) {
        this.logger.warn(`No Cognito Id for customer ${customerId}`);
        const fullMsisdn = msisdnCountryCode + msisdn;
        const users: ListUsersCommandOutput =
          await this.listUsersWithFullMsisdn(fullMsisdn);
        if (users && users.Users.length !== 1) {
          this.logger.error(`Error listing users with MSISDN: ${fullMsisdn}`);
        }

        //Extracting 'sub' value from listUsersCommandOutput. The unique Id for cognito user
        try {
          cognitoId = users.Users[0].Attributes.filter((attribute) => {
            return attribute.Name === 'sub';
          })[0].Value;
          this.logger.warn(
            `Successfully extracted cogntioId: ${cognitoId} for customerId: ${customerId}.`,
          );
          this.customerServiceClient.updateCustomer(customerId, cognitoId);
        } catch (err) {
          this.logger.error(
            `Failed to get cognitoId for customerId: ${customerId}.`,
          );
          this.logger.error('Cognito List Users Response:');
          this.logger.error(users);
          this.logger.error(err.stack);
          throw new Error(
            `Failed to get cognitoId (Sub) for customerId: ${customerId}.`,
          );
        }
      }

      //Check if cognitoId is now present
      if (cognitoId) {
        return await this.adminResetPinHelper(newPin, cognitoId);
      }
    }
    return false;
  }

  //private helper functions, will not be included in test coverage
  /* istanbul ignore next */
  private async signUpAwsHelper(
    phoneNumber: string,
    pin: string,
    customerId: string,
    email: string,
  ) {
    const signUpParams: SignUpCommandInput = {
      ClientId: this.clientId,
      Username: phoneNumber,
      Password: pin,
      SecretHash: this.calculateSecretHash(
        phoneNumber,
        this.clientId,
        this.clientSecret,
      ),
      UserAttributes: [],
    };
    signUpParams.UserAttributes.push({
      Name: 'custom:customerId',
      Value: customerId,
    });
    if (email) {
      signUpParams.UserAttributes.push({ Name: 'email', Value: email });
    }
    const command = new SignUpCommand(signUpParams);
    const signUpResponse = await this.provider.send(command);
    this.logger.debug(signUpResponse);
    return signUpResponse;
  }

  /* Istanbul ignore next */
  private calculateSecretHash(
    username: string,
    clientId: string,
    clientSecret: string,
  ) {
    const message = username + clientId;
    const hmac = createHmac('sha256', clientSecret);
    hmac.update(message);
    return hmac.digest('base64');
  }

  /* istanbul ignore next */
  private async signupLoginAwsHelper(phoneNumber: string, pin: string) {
    const params: InitiateAuthCommandInput = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: phoneNumber,
        PASSWORD: pin,
        SECRET_HASH: this.calculateSecretHash(
          phoneNumber,
          this.clientId,
          this.clientSecret,
        ),
      },
    };
    const command = new InitiateAuthCommand(params);
    const response: InitiateAuthCommandOutput = await this.provider.send(
      command,
    );
    return response;
  }

  /* istanbul ignore next */
  private async loginAwsHelper(
    phoneNumber: string,
    pin: string,
    preferredName: string,
  ) {
    // Initiate SRP Auth
    const userPoolId = this.userPoolId.split('_')[1];
    const srp = new SRPClient(userPoolId);
    const srpA = srp.calculateA();
    const initiateAuthParams: InitiateAuthCommandInput = {
      AuthFlow: AuthFlowType.CUSTOM_AUTH,
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: phoneNumber,
        SECRET_HASH: this.calculateSecretHash(
          phoneNumber,
          this.clientId,
          this.clientSecret,
        ),
        CHALLENGE_NAME: 'SRP_A',
        SRP_A: srpA,
      },
    };
    const command = new InitiateAuthCommand(initiateAuthParams);
    const initiateAuthResponse = await this.provider.send(command);

    const userIdForSrp =
      initiateAuthResponse.ChallengeParameters.USER_ID_FOR_SRP;
    const srpB = initiateAuthResponse.ChallengeParameters.SRP_B;
    const salt = initiateAuthResponse.ChallengeParameters.SALT;
    const secretBlock = initiateAuthResponse.ChallengeParameters.SECRET_BLOCK;
    const hkdf = srp.getPasswordAuthenticationKey(
      userIdForSrp,
      pin,
      srpB,
      salt,
    );
    const dateNow = getNowString();
    const signatureString = calculateSignature(
      hkdf,
      userPoolId,
      userIdForSrp,
      secretBlock,
      dateNow,
    );
    const session = initiateAuthResponse.Session;

    // responsd to SRP (PASSWORD_VERIFIER)
    const respondToAuthParams: RespondToAuthChallengeCommandInput = {
      ClientId: this.clientId,
      ChallengeName: ChallengeNameType.PASSWORD_VERIFIER,
      ChallengeResponses: {
        PASSWORD_CLAIM_SIGNATURE: signatureString,
        PASSWORD_CLAIM_SECRET_BLOCK: secretBlock,
        TIMESTAMP: dateNow,
        USERNAME: userIdForSrp,
        SECRET_HASH: this.calculateSecretHash(
          userIdForSrp,
          this.clientId,
          this.clientSecret,
        ),
      },
      Session: session,
      ClientMetadata: {
        preferredName: preferredName,
        otpAutoReadKey: this.otpAutoReadKey,
      },
    };
    const respondToAuthCommand = new RespondToAuthChallengeCommand(
      respondToAuthParams,
    );
    const respondToAuthResponse = await this.provider.send(
      respondToAuthCommand,
    );
    return respondToAuthResponse;
  }

  /* istanbul ignore next */
  private async enableMFAHelper(accessToken: string) {
    const setUserMFAInput: SetUserMFAPreferenceCommandInput = {
      AccessToken: accessToken,
      SMSMfaSettings: {
        Enabled: true,
        PreferredMfa: true,
      },
    };
    const setUserMFACommand = new SetUserMFAPreferenceCommand(setUserMFAInput);
    const setUserMFAResponse = await this.provider.send(setUserMFACommand);
    return setUserMFAResponse;
  }

  async listUsersWithFullMsisdn(fullMsisdn: string) {
    const input = {
      // ListUsersRequest
      UserPoolId: this.userPoolId, // required
      AttributesToGet: [
        // SearchedAttributeNamesListType
        'sub',
        'phone_number',
      ],
      Filter: `phone_number = \"${fullMsisdn}\"`,
    };
    const command = new ListUsersCommand(input);
    const response = await this.provider.send(command);
    console.log(response);
    return response;
  }

  private async adminResetPinHelper(newPin: string, cognitoId: string) {
    const input = {
      // AdminSetUserPasswordRequest
      UserPoolId: this.userPoolId, // required
      Username: cognitoId, // required
      Password: newPin, // required
      Permanent: true,
    };

    const command = new AdminSetUserPasswordCommand(input);
    const response = await this.provider.send(command);
    this.logger.debug(response);
    if (response?.$metadata) {
      return true;
    }
    return false;
  }

  async adminDeleteUser(cognitoId: string): Promise<boolean> {
    this.logger.log(this.adminDeleteUser.name);
    const input = {
      UserPoolId: this.userPoolId,
      Username: cognitoId,
    };
    this.logger.debug(input);
    const command = new AdminDeleteUserCommand(input);
    try {
      const response = await this.provider.send(command);
      this.logger.debug(response);
      if (response?.$metadata) {
        return true;
      }
      return false;
    } catch (e) {
      this.logger.error(e);
      if (e instanceof UserNotFoundException) {
        return false; //don't throw error if it is a UserNotFoundException
      }
      throw e;
    }
  }
}
