import { IBase } from './base.interface';

export enum IdType {
  CUSTOMER = 'CUSTOMER',
  LEAD = 'LEAD',
}

export interface ITopicSubscription extends IBase {
  userDeviceUUID: string;
  topicArn: string;
  subscriptionArn: string;
}

export interface IUserDevice extends IBase {
  id: string;
  customerOrLeadId: string;
  idType: IdType;
  deviceId: string;
  deviceOs: string;
  firebaseDeviceToken: string;
  platformApplicationEndpoint: string;
  subscribedSnsTopics: ITopicSubscription[];
  isActive: boolean;
}
