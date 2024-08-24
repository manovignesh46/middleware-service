import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseMessage } from '../../domain/enum/responseMessage.enum';
import { ICognitoDetailRepository } from '../../domain/repositories/cognito-detail-repository.interface';
import { IAuthService } from '../../domain/services/authService.interface';
import { ICognitoDetailService } from '../../domain/services/cognito-detail.service.interface';
import { getTimeToUnlockMinutes } from '../../exception-filters/helper';
import { OtpLockedError } from '../controllers/common/errors/otpLocked.error';

@Injectable()
export class CognitoDetailService implements ICognitoDetailService {
  LOGIN_OTP_MAX_RETRIES: number;
  OTP_LOCKED_COOLOFF_SECONDS: number;
  private logger: Logger = new Logger(CognitoDetailService.name);
  constructor(
    private configService: ConfigService,
    private repository: ICognitoDetailRepository,
    private awsCognitoService: IAuthService,
  ) {
    this.LOGIN_OTP_MAX_RETRIES =
      configService.get<number>('LOGIN_OTP_MAX_RETRIES') || 3;
    this.OTP_LOCKED_COOLOFF_SECONDS =
      configService.get<number>('OTP_LOCKED_COOLOFF_SECONDS') || 7200;
  }
  async canLogin(msisdnCountryCode: string, msisdn: string): Promise<boolean> {
    this.logger.log(this.canLogin.name);
    const cognitoDetail = await this.repository.findByMsisdn(
      msisdnCountryCode,
      msisdn,
    );
    if (cognitoDetail) {
      //exceeded max retries
      if (
        cognitoDetail.failedLoginAttempts >= this.LOGIN_OTP_MAX_RETRIES ||
        cognitoDetail.otpSentCount >= this.LOGIN_OTP_MAX_RETRIES
      ) {
        //is beyond the cooloff period
        if (
          cognitoDetail.loginLockedAt &&
          Date.now() >
            cognitoDetail.loginLockedAt.getTime() +
              this.OTP_LOCKED_COOLOFF_SECONDS * 1000
        ) {
          cognitoDetail.loginLockedAt = null;
          cognitoDetail.loginUnLockedAt = new Date();
          cognitoDetail.failedLoginAttempts = 0;
          cognitoDetail.otpSentCount = 0;

          await this.repository.update(cognitoDetail);
          return true;
        } else {
          const timeToUnlockMinutes = getTimeToUnlockMinutes(
            cognitoDetail.loginLockedAt,
            this.OTP_LOCKED_COOLOFF_SECONDS,
          );
          throw new OtpLockedError(
            ResponseMessage.LOGIN_LOCK,
            timeToUnlockMinutes,
          );
        }
      }
      return true;
    }
  }
  async incrementFailedAttempts(msisdnCountryCode: string, msisdn: string) {
    this.logger.log(this.incrementFailedAttempts.name);
    const cognitoDetail = await this.repository.findByMsisdn(
      msisdnCountryCode,
      msisdn,
    );
    await this.canLogin(msisdnCountryCode, msisdn);

    cognitoDetail.failedLoginAttempts += 1;
    if (
      cognitoDetail.failedLoginAttempts >= this.LOGIN_OTP_MAX_RETRIES &&
      !cognitoDetail.loginLockedAt
    ) {
      cognitoDetail.loginLockedAt = new Date();
    }
    await this.repository.update(cognitoDetail);
    if (cognitoDetail.loginLockedAt) {
      const timeToUnlockMinutes = getTimeToUnlockMinutes(
        cognitoDetail.loginLockedAt,
        this.OTP_LOCKED_COOLOFF_SECONDS,
      );
      throw new OtpLockedError(ResponseMessage.LOGIN_LOCK, timeToUnlockMinutes);
    }
  }

  async incrementOtpSentCount(msisdnCountryCode: string, msisdn: string) {
    this.logger.log(this.incrementOtpSentCount.name);
    const cognitoDetail = await this.repository.findByMsisdn(
      msisdnCountryCode,
      msisdn,
    );

    cognitoDetail.otpSentCount += 1;
    if (
      cognitoDetail.otpSentCount >= this.LOGIN_OTP_MAX_RETRIES &&
      !cognitoDetail.loginLockedAt
    ) {
      cognitoDetail.loginLockedAt = new Date();
    }
    await this.repository.update(cognitoDetail);
  }

  async resetFailedAttempts(msisdnCountryCode: string, msisdn: string) {
    this.logger.log(this.resetFailedAttempts.name);
    const cognitoDetail = await this.repository.findByMsisdn(
      msisdnCountryCode,
      msisdn,
    );
    if (cognitoDetail) {
      cognitoDetail.failedLoginAttempts = 0;
      cognitoDetail.otpSentCount = 0;
      cognitoDetail.loginLockedAt = null;
      await this.repository.update(cognitoDetail);
    }
  }

  async deleteCognitoCredentials(customerId: string) {
    this.logger.log(this.deleteCognitoCredentials.name);
    const cognitoDetail = await this.repository.findByCustomerId(customerId);
    if (cognitoDetail && cognitoDetail?.cognitoId) {
      const isUserDeleted = await this.awsCognitoService.adminDeleteUser(
        cognitoDetail.cognitoId,
      );
      if (!isUserDeleted) {
        this.logger.error(
          `Customer Id ${customerId} with Cognito ID ${cognitoDetail?.cognitoId} has no corresponding user in Cognito`,
        );
      }
      this.logger.debug('Setting Cognito Id to null in DB');
      cognitoDetail.cognitoId = null;
      await this.repository.update(cognitoDetail);
      return cognitoDetail;
    }
    this.logger.log(`No Credential to delete`);
    return null; //returns null if no such cognitoDetail or cognitoId col null (cognito user already deleted)
  }
}
