import { ISmsService } from '../../domain/services/smsService.interface';
import { PublishCommand } from '@aws-sdk/client-sns';
import { SNSClient } from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { IContentRepository } from '../../domain/repository/contentRepository.interface';
import { ISMSLogRepository } from '../../domain/repository/smsLogRepository.interface';
import { IContent } from '../../domain/model/content.interface';
import { SMSLog } from '../entities/smsLog.entity';
import { ISMSLog } from '../../domain/model/smsLog.interface';
import { ICredentialHelper } from '../../domain/services/credential.service.interface';

@Injectable()
export class SmsService implements ISmsService {
  private REGION: string;
  private ACCESS_KEY_ID: string;
  private SECRET_KEY: string;
  snsClient: SNSClient;

  private readonly logger = new Logger(SmsService.name);
  constructor(
    private readonly contentRepository: IContentRepository,
    private readonly smsLogRepository: ISMSLogRepository,
    private configService: ConfigService,
    private credentialHelper: ICredentialHelper,
  ) {
    this.REGION = this.configService.get<string>('AWS_REGION');
    const awsCredentials = this.credentialHelper.getCredentials();
    this.snsClient = new SNSClient({
      credentials: awsCredentials,
      region: this.REGION,
    });
  }
  async sendSmsWithReplacable(
    phoneNumber: string,
    contentName: string,
    replacble: any,
  ) {
    //     INSERT INTO main."content"
    // ("contentName", "contentType", "message", "messageType")
    // VALUES('OTP_SMS', 'OTP', 'Your OTP is : ${otp}', 'text');

    const content: IContent = await this.contentRepository.findByContentName(
      contentName,
    );

    if (content !== null) {
      const message: string = content.message.replace(
        /\${(\w+)}/g,
        (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
          replacble.hasOwnProperty(placeholderWithoutDelimiters)
            ? replacble[placeholderWithoutDelimiters]
            : placeholderWithDelimiters,
      );
      await this.sendSms(phoneNumber, message);

      const smsLog: ISMSLog = new SMSLog(
        contentName,
        phoneNumber,
        message,
        content.contentType,
      );
      await this.smsLogRepository.save(smsLog);
    } else {
      console.error('Content name not found : ' + contentName);
    }
  }

  async sendSms(phoneNumber: string, message: string) {
    this.logger.log(this.sendSms.name);
    const params = {
      Message: message /* required */,
      PhoneNumber: phoneNumber, //PHONE_NUMBER, in the E.164 phone number structure
    };

    try {
      const data = await this.snsClient.send(new PublishCommand(params));
      this.logger.log('sendSMS Success.', data);
      return data; // For unit tests.
    } catch (err) {
      this.logger.error('sendSMS Error', err.stack);
      throw err;
    }
  }
}
