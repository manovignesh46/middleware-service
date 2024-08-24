import { SourceMicroservice } from '../enum/source-microservice.enum';
import { TargetType } from '../enum/target-type.enum';
import { INotification } from '../notification.interface';

export const mockNotification: INotification = {
  id: '488b69d0-f413-41ac-89ea-75f49c0b2106',
  target: '+6512345678',
  targetType: TargetType.PHONE_NUMBER,
  messageHeader: 'Greeting To You',
  message: 'Hello World',
  response: 'Some Success Response',
  snsMessageId: 'message123',
  sentAt: new Date(Date.now()),
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now()),
  customerId: 'customer123',
  priority: 9,
  sourceMicroservice: SourceMicroservice.CUSTOMERS,
  pushDeliveryStatus: '',
  pushDeliveredAt: undefined,
  pushViewedStatus: '',
  pushViewedAt: undefined,
};
