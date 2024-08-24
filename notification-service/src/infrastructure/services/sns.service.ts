import { ConfigService } from '@nestjs/config';
import {
  PublishCommand,
  PublishCommandInput,
  PublishCommandOutput,
  SNSClient,
} from '@aws-sdk/client-sns';
import { Injectable } from '@nestjs/common';
import { ICredentialHelper } from '../../domain/services/credential.service.interface';
import { ISNSService } from '../../domain/services/aws-sns-service.interface';

@Injectable()
export class SNSService implements ISNSService {
  private client: SNSClient;
  constructor(
    private configService: ConfigService,
    credentialHelper: ICredentialHelper,
  ) {
    const credentials = credentialHelper.getCredentials();
    // Set the AWS Region.
    this.client = new SNSClient({
      credentials,
      region: configService.get<string>('AWS_REGION'),
    });
  }
  async sendSMS(phoneNumber: string, message: string) {
    const input: PublishCommandInput = {
      PhoneNumber: phoneNumber,
      Message: message, // required
      // Subject: 'STRING_VALUE',
    };
    const command = new PublishCommand(input);
    const response: PublishCommandOutput = await this.client.send(command);
    return response;
  }
  async sendPushNotification(
    pushId: string,
    endpointArn: string,
    message: string,
    messageHeader?: string,
  ) {
    const input: PublishCommandInput = {
      TargetArn: endpointArn,
      Message: JSON.stringify({
        title: messageHeader || 'Furaha Notification',
        body: message,
        data: {
          pushId: pushId,
        },
      }),
    };
    const command = new PublishCommand(input);
    const response: PublishCommandOutput = await this.client.send(command);
    return response;
  }
  async sendToTopic(topicArn: string, message: string, messageHeader?: string) {
    const input: PublishCommandInput = {
      TopicArn: topicArn,
      Message: JSON.stringify({
        title: messageHeader || 'Furaha Notification',
        body: message,
      }),
    };
    const command = new PublishCommand(input);
    const response: PublishCommandOutput = await this.client.send(command);
    return response;
  }
  isValidEndpointArn(endpointArn: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  isValidTopicArn(topicArn: string) {
    throw new Error('Method not implemented.');
  }
}
