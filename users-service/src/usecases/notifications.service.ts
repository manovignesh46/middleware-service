import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpType } from '../domain/enum/otpType.enum';
import { IEmailService } from '../domain/services/emailService.interface';
import { INotificationService } from '../domain/services/notificationsService.interface';
import { ISmsService } from '../domain/services/smsService.interface';

/* istanbul ignore next */
@Injectable()
export class NotificationService implements INotificationService {
  private OTP_AUTO_READ_KEY: string;
  constructor(
    private readonly smsService: ISmsService,
    private readonly emailService: IEmailService,
    private readonly configService: ConfigService,
  ) {
    this.OTP_AUTO_READ_KEY = configService.get('OTP_AUTO_READ_KEY');
  }

  private readonly logger = new Logger(NotificationService.name);

  async sendOTPSms(
    preferredName: string,
    otp: string,
    otpType: OtpType,
    msisdnCountryCode: string,
    msisdn: string,
  ) {
    this.logger.log(this.sendOTPSms.name);
    const replacble = {
      otp: otp,
      preferredName: preferredName,
      otpAutoReadKey: this.OTP_AUTO_READ_KEY,
    };
    try {
      const fullPhoneNumber = msisdnCountryCode + msisdn;
      await this.smsService.sendSmsWithReplacable(
        fullPhoneNumber,
        'OTP_SMS',
        replacble,
      );
    } catch (err) {
      this.logger.error(err.stack);
      throw err;
    }
  }

  sendOTPEmail(otp: string, otpType: string, recipientEmail: string) {
    this.logger.log(this.sendOTPEmail.name);
    const otpMessage = 'Your OTP is: ' + otp;
    try {
      this.emailService.sendEmail(
        recipientEmail,
        'sender@email.com',
        otpMessage,
      );
    } catch (err) {
      this.logger.error(err.stack);
      throw err;
    }
  }
}
