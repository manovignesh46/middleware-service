import {
  CreatePlatformEndpointCommand,
  CreatePlatformEndpointCommandOutput,
  CreatePlatformEndpointInput,
  DeleteEndpointCommand,
  GetEndpointAttributesCommand,
  GetEndpointAttributesCommandInput,
  GetEndpointAttributesCommandOutput,
  ListTopicsCommand,
  ListTopicsCommandOutput,
  NotFoundException,
  SetEndpointAttributesCommand,
  SetEndpointAttributesCommandInput,
  SNSClient,
  SubscribeCommand,
  SubscribeCommandInput,
  SubscribeCommandOutput,
  UnsubscribeCommand,
  UnsubscribeCommandInput,
} from '@aws-sdk/client-sns';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISNSService } from '../../domain/services/aws-sns-service.interface';
import { ICredentialHelper } from '../../domain/services/credential.service.interface';

@Injectable()
export class SNSService implements ISNSService {
  private logger = new Logger(SNSService.name);
  private snsClient: SNSClient;
  private platformApplicationArn: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly credentialHelper: ICredentialHelper,
  ) {
    const awsCredentials = this.credentialHelper.getCredentials();
    this.snsClient = new SNSClient({
      credentials: awsCredentials,
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.platformApplicationArn = this.configService.get<string>(
      'PUSH_NOTIFICATION_PLATFORM_APPLICATION_ARN',
    );
  }

  async isValidEndpointArn(
    endpointArn: string,
    firebaseToken: string,
  ): Promise<EndpointArnStatus> {
    this.logger.log(this.isValidEndpointArn.name);
    const input: GetEndpointAttributesCommandInput = {
      // GetEndpointAttributesInput
      EndpointArn: endpointArn,
    };
    const command = new GetEndpointAttributesCommand(input);
    let response: GetEndpointAttributesCommandOutput;
    try {
      response = await this.snsClient.send(command);
      console.log('getEndpointAttr');
      console.log(response);
    } catch (err) {
      if (err instanceof NotFoundException) {
        return EndpointArnStatus.NOT_FOUND;
      } else throw err;
    }
    if (
      response.Attributes.Enabled === 'true' &&
      response.Attributes.Token === firebaseToken
    ) {
      return EndpointArnStatus.VALID;
    } else {
      return EndpointArnStatus.INVALID_ATTRIBUTES;
    }
  }

  //For details on create endpoint flow, reference https://docs.aws.amazon.com/sns/latest/dg/mobile-platform-endpoint.html#mobile-platform-endpoint-pseudo-code
  async createPlatformApplicationEndpoint(
    firebaseToken: string,
    platformApplicationArn?: string,
  ): Promise<string> {
    this.logger.log(this.createPlatformApplicationEndpoint.name);
    const input: CreatePlatformEndpointInput = {
      PlatformApplicationArn:
        platformApplicationArn || this.platformApplicationArn,
      Token: firebaseToken,
    };
    const command = new CreatePlatformEndpointCommand(input);
    const response: CreatePlatformEndpointCommandOutput =
      await this.snsClient.send(command);
    this.logger.log('Create Platform Application Endpoint SNS Response');
    this.logger.log(response);

    if (response?.EndpointArn) {
      return response.EndpointArn;
    } else {
      const errorMessage = 'Error creating PlatformApplicationEndpoint';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async subscribeEndpointToTopic(
    endpointArn: string,
    topicArn: string,
  ): Promise<{ topicArn: string; subscriptionArn: string }> {
    this.logger.log(this.subscribeEndpointToTopic.name);
    const input: SubscribeCommandInput = {
      TopicArn: topicArn,
      Protocol: 'application',
      Endpoint: endpointArn,
      ReturnSubscriptionArn: true,
    };
    const command = new SubscribeCommand(input);
    const response: SubscribeCommandOutput = await this.snsClient.send(command);
    this.logger.log('Subscribe Endpoint to Topic SNS Response:');
    this.logger.debug(response);
    if (response?.SubscriptionArn) {
      return { topicArn: topicArn, subscriptionArn: response.SubscriptionArn };
    } else {
      const errorMessage = 'Error subscribing endpoint to topic';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getTopicArnsFromNames(topicNames: string[]): Promise<string[]> {
    this.logger.log(this.getTopicArnsFromNames.name);
    const listTopicsCommand = new ListTopicsCommand({});
    const listTopicsResponse: ListTopicsCommandOutput =
      await this.snsClient.send(listTopicsCommand);
    this.logger.log('listTopicsResponse');
    this.logger.log(listTopicsResponse);

    const topicsNamesTrimmedLowercase = topicNames.map((topicName) =>
      topicName.toLowerCase().trim(),
    );
    const topicArns = listTopicsResponse.Topics.filter((topic) => {
      //topicName is the name of the topic (after the last colon in arn)
      //e.g. arn:aws:sns:ap-southeast-1:123456123456:testtopic
      const topicName = topic.TopicArn.split(':')[5].toLowerCase().trim();
      return topicsNamesTrimmedLowercase.includes(topicName);
    });
    return topicArns.map((topic) => topic.TopicArn);
  }

  async unsubscribeEndpointFromTopic(subscriptionArn: string): Promise<any> {
    this.logger.log(this.unsubscribeEndpointFromTopic.name);
    const input: UnsubscribeCommandInput = {
      SubscriptionArn: subscriptionArn,
    };
    const command = new UnsubscribeCommand(input);
    const response = await this.snsClient.send(command);
    this.logger.debug(response);
    return response;
  }

  //Make sure to delete any subsciptions before deleting the endpoint
  async deleteEndpoint(endpointArn: string): Promise<any> {
    this.logger.log(this.deleteEndpoint.name);
    this.logger.log(
      `Deleting Platform Application Endpoint ARN: ${endpointArn}`,
    );
    const input = {
      // DeleteEndpointInput
      EndpointArn: endpointArn, // required
    };
    const command = new DeleteEndpointCommand(input);
    const response = await this.snsClient.send(command);
    return response;
  }
  async updateEndpointAttributes(
    endpointArn: string,
    newFirebaseToken: string,
  ): Promise<any> {
    this.logger.log(this.updateEndpointAttributes.name);
    const input: SetEndpointAttributesCommandInput = {
      EndpointArn: endpointArn,
      Attributes: {
        Enabled: 'true',
        Token: newFirebaseToken,
      },
    };
    const command = new SetEndpointAttributesCommand(input);
    const response = await this.snsClient.send(command);
    this.logger.log('Update Endpoint Atrributes SNS Response:');
    this.logger.log(response);
    return response;
  }
}

export enum EndpointArnStatus {
  VALID = 'VALID',
  INVALID_ATTRIBUTES = 'INVALID_ATTRIBUTES',
  NOT_FOUND = 'NOT_FOUND',
}
