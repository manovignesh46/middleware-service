import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { OtpAction } from '../../domain/enum/otp-action.enum';
import { ResponseMessage } from '../../domain/enum/responseMessage.enum';
import { ICustPrimaryDetails } from '../../domain/model/custPrimaryDetails.interface';
import { IGeneralOtp } from '../../domain/model/general-otp.interface';
import { IContentRepository } from '../../domain/repository/contentRepository.interface';
import { ICustPrimaryDetailsRepository } from '../../domain/repository/custPrimaryDetailsRepository.interface';
import { IGeneralOtpRepository } from '../../domain/repository/general-otp-repository.interface';
import { generateOTP, getTimeToUnlockMinutes } from '../../usecases/helpers';
import { ErrorMessage } from '../controllers/common/errors/enums/errorMessage.enum';
import { OtpExpiredError } from '../controllers/common/errors/otpExpired.error';
import { OtpLockedError } from '../controllers/common/errors/otpLocked.error';
import { OtpNotExpiredError } from '../controllers/common/errors/otpNotExpired.error';
import { GeneralOtpVerifyDto } from '../controllers/customers/dtos/general-otp-verify.dto';
import { GeneralOtp } from '../entities/general-otp.entity';
import { SendNotificationDto } from './notifiction-service-client/dto/send-notification.dto';
import { SourceMicroservice } from './notifiction-service-client/enum/source-microservice.enum';
import { TargetType } from './notifiction-service-client/enum/target-type.enum';
import { NotificationServiceClient } from './notifiction-service-client/notifications-service-client.service';

@Injectable()
export class GeneralOtpService {
  private OTP_VALID_SECONDS: number;
  private REGISTER_OTP_MAX_RETRIES: number;
  private OTP_LOCKED_COOLOFF_SECONDS: number;
  private IS_HARDCODED_OTP: boolean;
  private logger = new Logger(GeneralOtpService.name);
  constructor(
    private readonly generalOtpRepository: IGeneralOtpRepository,
    private readonly configService: ConfigService,
    private readonly notificationServiceClient: NotificationServiceClient,
    private readonly contentRepository: IContentRepository,
    private readonly custPrimaryDetailsRepository: ICustPrimaryDetailsRepository,
  ) {
    this.OTP_VALID_SECONDS =
      this.configService.get<number>('OTP_VALID_SECONDS');
    this.REGISTER_OTP_MAX_RETRIES = this.configService.get<number>(
      'REGISTER_OTP_MAX_RETRIES',
    );
    this.OTP_LOCKED_COOLOFF_SECONDS = this.configService.get<number>(
      'OTP_LOCKED_COOLOFF_SECONDS',
    );
    this.IS_HARDCODED_OTP =
      this.configService.get<string>('IS_HARDCODED_OTP') === 'true' || false;
  }
  async triggerOtp(
    customerId: string,
    fullMsisdn: string,
    otpAction: OtpAction,
  ) {
    this.logger.log(this.triggerOtp.name);
    const otp: IGeneralOtp =
      await this.generalOtpRepository.getByCustomerIdAndOtpAction(
        customerId,
        otpAction,
      );

    let otpToSend: IGeneralOtp;
    if (otp) {
      // Exceeded Failed Attempts, set isLockedDate
      // const isExpired = this.checkIsExpired(otp); //isExpired is not used
      const { isLocked, updatedOtp } = await this.checkIsLocked(otp);
      if (isLocked) {
        const timeToUnlockMinutes = getTimeToUnlockMinutes(
          otp.lockedAt,
          this.OTP_LOCKED_COOLOFF_SECONDS,
        );
        throw new OtpLockedError(ErrorMessage.OTP_LOCK, timeToUnlockMinutes);
      }

      //throws error if otp sending is locked
      await this.checkIsOtpSentLocked(updatedOtp);

      // OTP to send
      otpToSend = updatedOtp;
      otpToSend.fullMsisdn = fullMsisdn; //update msisdn in case it was different for last OTP
    } else {
      //No Existing OTP of same action create new otp
      const newOtp = new GeneralOtp();
      newOtp.customerId = customerId;
      newOtp.otpAction = otpAction;
      newOtp.fullMsisdn = fullMsisdn;
      newOtp.failedAttempts = 0;
      newOtp.otpSentCount = 0;

      otpToSend = await this.generalOtpRepository.create(newOtp);
    }
    otpToSend.expiredAt = new Date(Date.now() + this.OTP_VALID_SECONDS * 1000);
    otpToSend.otpValue = generateOTP(this.IS_HARDCODED_OTP);
    otpToSend.sentAt = null;
    otpToSend.verifiedAt = null;
    otpToSend.otpVerifiedKey = null;
    otpToSend.otpVerifiedKeyExpiredAt = null;

    this.generalOtpRepository.update(otpToSend);

    const customerPrimaryDetails =
      await this.custPrimaryDetailsRepository.getByCustomerId(customerId);
    await this.sendOtpSms(otpToSend, customerPrimaryDetails);
    otpToSend.otpSentCount = otpToSend.otpSentCount += 1;
    const isTooManyOtpSent = this.checkIsTooManyOtpSent(otpToSend);
    if (isTooManyOtpSent) {
      otpToSend.otpSentLockedAt = new Date();
    }
    otpToSend = await this.generalOtpRepository.update({
      ...otpToSend,
      sentAt: new Date(), // mark as sent
    });
    //when 3 otps have been sent, it locks further sending of otp but Current otp can still be verified
    return otpToSend;
  }

  async verifyOtp(dto: GeneralOtpVerifyDto) {
    this.logger.log(this.verifyOtp.name);
    const { customerId, msisdnCountryCode, msisdn, otp, otpAction } = dto;
    const fullMsisdn = msisdnCountryCode + msisdn;
    let existingOtp =
      await this.generalOtpRepository.getByCustomerIdAndOtpAction(
        customerId,
        otpAction,
      );
    // Otp was never triggered
    if (!existingOtp) {
      throw new Error('No valid OTP session for user');
    }

    //Provided Msisdn does not match DB entry
    if (existingOtp.fullMsisdn !== fullMsisdn) {
      throw new Error('Stored and provided fullMsisdn do not match');
    }

    //OTP already verified
    if (existingOtp.verifiedAt) {
      throw new Error('OTP already verified please trigger a new OTP first');
    }

    // Exceeded Failed Attempts, set isLockedDate
    const isTooManyAttempts = this.checkIsTooManyAttempts(existingOtp);
    if (isTooManyAttempts) {
      this.logger.debug(
        `User ${customerId} has too many failed attempts, locking user`,
      );
      existingOtp.failedAttempts = 0;
      existingOtp.lockedAt = new Date(); //Next checkIsLocked will throw error
      existingOtp.expiredAt = null;
      existingOtp.sentAt = null;
      existingOtp = await this.generalOtpRepository.update(existingOtp);
    }

    const { isLocked, updatedOtp } = await this.checkIsLocked(existingOtp);

    //OTP Locked
    if (isLocked) {
      const timeToUnlockMinutes = getTimeToUnlockMinutes(
        existingOtp.lockedAt,
        this.OTP_LOCKED_COOLOFF_SECONDS,
      );
      throw new OtpLockedError(ErrorMessage.OTP_LOCK, timeToUnlockMinutes);
    }

    //OTP Expired
    const isExpired = this.checkIsExpired(existingOtp);
    if (isExpired) {
      throw new OtpExpiredError(ErrorMessage.OTP_EXPIRED);
    }

    //Valid OTP, to verify value
    const isCorrectOtp = updatedOtp.otpValue === otp;
    if (isCorrectOtp) {
      updatedOtp.verifiedAt = new Date();
      updatedOtp.otpVerifiedKey = randomUUID();
      updatedOtp.otpVerifiedKeyExpiredAt = new Date(
        Date.now() + this.OTP_VALID_SECONDS * 1000,
      );
      updatedOtp.expiredAt = null;
      updatedOtp.lockedAt = null;
      updatedOtp.otpSentLockedAt = null;
      updatedOtp.sentAt = null;
      updatedOtp.failedAttempts = 0;
      updatedOtp.otpSentCount = 0;
      this.generalOtpRepository.update(updatedOtp);
      return updatedOtp;
    } else {
      if (updatedOtp.otpSentLockedAt) {
        updatedOtp.lockedAt = updatedOtp.otpSentLockedAt;
        await this.generalOtpRepository.update(updatedOtp);
      }
      updatedOtp.failedAttempts += 1;
      this.generalOtpRepository.update(updatedOtp);
      return null;
    }
  }

  async verifyOtpVerfiedKey(
    customerId: string,
    otpVerifiedKey: string,
    otpAction: OtpAction,
  ) {
    this.logger.log(this.verifyOtpVerfiedKey.name);
    const existingOtp: IGeneralOtp =
      await this.generalOtpRepository.getByCustomerIdAndOtpAction(
        customerId,
        otpAction,
      );
    if (!existingOtp) {
      this.logger.error(
        `No Existing OTP for this customerId: ${customerId} and otpAction: ${OtpAction}`,
      );
      throw new Error('No Valid OTP');
    }
    const isValid: boolean = this.checkOtpVerifiedKeyIsValid(
      existingOtp,
      otpVerifiedKey,
    );
    if (isValid) {
      this.logger.log('Key is Valid');
      //prevent reuse of the key for other requests
      await this.generalOtpRepository.update({
        ...existingOtp,
        otpVerifiedKey: null,
        otpVerifiedKeyExpiredAt: null,
      });
      return this.custPrimaryDetailsRepository.getByCustomerId(customerId);
    } else {
      this.logger.log('Invalid Key');
      return null;
    }
  }

  async sendOtpSms(
    otp: IGeneralOtp,
    customerPrimaryDetails: ICustPrimaryDetails,
  ) {
    this.logger.log(this.sendOtpSms.name);
    const messageTemplate = await this.contentRepository.findByContentName(
      'OTP_SMS',
    );
    const message = messageTemplate.message
      .replace('${otp}', otp.otpValue)
      .replace(
        '${preferredName}',
        customerPrimaryDetails.preferredName || 'Valued Customer',
      );
    const dto: SendNotificationDto = {
      target: otp.fullMsisdn,
      targetType: TargetType.PHONE_NUMBER,
      messageHeader: null, //No message header for OTP
      message,
      customerId: otp.customerId,
      sourceMicroservice: SourceMicroservice.CUSTOMERS,
      priority: 9,
    };
    await this.notificationServiceClient.sendNotification(dto);
  }

  checkIsAlreadyVerified(otp: IGeneralOtp) {
    this.logger.log(this.checkIsAlreadyVerified.name);
    return !!otp.verifiedAt;
  }

  checkIsExpired(otp: IGeneralOtp) {
    this.logger.log(this.checkIsExpired.name);
    if (otp.expiredAt) {
      return Date.now() > otp.expiredAt.getTime();
    }
    return true; // If expiry is null then treat as expired
  }

  async checkIsLocked(otp: IGeneralOtp) {
    this.logger.log(this.checkIsLocked.name);
    if (otp.lockedAt) {
      if (
        Date.now() >
        otp.lockedAt.getTime() + this.OTP_LOCKED_COOLOFF_SECONDS * 1000
      ) {
        otp.lockedAt = null;
        otp.otpSentLockedAt = null;
        otp.failedAttempts = 0;
        otp.otpSentCount = 0;
        otp = await this.generalOtpRepository.update(otp);
      } else {
        return { isLocked: true, updatedOtp: otp }; // OTP is still locked
      }
    }
    return { isLocked: false, updatedOtp: otp }; // OTP not locked
  }

  checkIsTooManyAttempts(otp: IGeneralOtp) {
    this.logger.log(this.checkIsTooManyAttempts.name);
    return this.REGISTER_OTP_MAX_RETRIES <= otp.failedAttempts;
  }

  checkIsTooManyOtpSent(otp: IGeneralOtp) {
    this.logger.log(this.checkIsTooManyOtpSent.name);
    return otp.otpSentCount >= this.REGISTER_OTP_MAX_RETRIES;
  }

  async checkIsOtpSentLocked(otp: IGeneralOtp) {
    this.logger.log(this.checkIsOtpSentLocked.name);
    if (otp.otpSentLockedAt) {
      const timeToUnlockMinutes = getTimeToUnlockMinutes(
        otp.otpSentLockedAt,
        this.OTP_LOCKED_COOLOFF_SECONDS,
      );

      //Already past OTP cooloff period
      if (timeToUnlockMinutes <= 0) {
        await this.generalOtpRepository.update({
          ...otp,
          otpSentCount: 0,
          otpSentLockedAt: null,
        });
      } else {
        throw new OtpLockedError(ResponseMessage.OTP_LOCK, timeToUnlockMinutes);
      }
    }
  }

  private checkOtpVerifiedKeyIsValid(otp: IGeneralOtp, keyToVerify: string) {
    const { verifiedAt, otpVerifiedKey, otpVerifiedKeyExpiredAt } = otp;
    if (!verifiedAt || !otpVerifiedKey || !otpVerifiedKeyExpiredAt) {
      return false; //OTP not yet verified
    }
    if (Date.now() > otpVerifiedKeyExpiredAt.getTime()) {
      return false; //OTP verification key already expired
    }
    return keyToVerify === otpVerifiedKey; // return true if keys match
  }
}
