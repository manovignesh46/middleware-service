import { EndpointArnStatus } from '../../infrastructure/services/aws-sns.service';

export abstract class ISNSService {
  abstract createPlatformApplicationEndpoint(
    firebaseToken: string,
    platformApplicationArn?: string,
  ): Promise<string>;
  abstract subscribeEndpointToTopic(
    endpointArn: string,
    topicArn: string,
  ): Promise<{ topicArn: string; subscriptionArn: string }>;
  abstract getTopicArnsFromNames(topicNames: string[]): Promise<string[]>;
  abstract unsubscribeEndpointFromTopic(subscriptionArn: string): Promise<any>;
  abstract deleteEndpoint(endpointArn: string): Promise<any>;
  abstract isValidEndpointArn(
    endpointArn: string,
    firebaseToken: string,
  ): Promise<EndpointArnStatus>;
  abstract updateEndpointAttributes(
    endpointArn: string,
    newFirebaseToken: string,
  ): Promise<any>;
}
