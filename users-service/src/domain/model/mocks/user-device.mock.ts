import { TopicSubscription } from '../../../infrastructure/entities/user-device.entity';
import { IdType, IUserDevice } from '../user-device.interface';
export const mockTopicSubscription = new TopicSubscription();
mockTopicSubscription.subscriptionArn = 'subscription1';
mockTopicSubscription.topicArn = 'topic1';
export const mockUserDevice: IUserDevice = {
  id: '17e3b105-e31a-46dd-9089-0f1327f35088',
  customerOrLeadId: 'customer123',
  idType: IdType.CUSTOMER,
  deviceId: 'device123',
  firebaseDeviceToken: 'firebase123',
  platformApplicationEndpoint: 'snsEndpoint123',
  subscribedSnsTopics: [mockTopicSubscription],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deviceOs: 'android',
};
