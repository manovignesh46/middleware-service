import { IBase } from './base.interface';
import { SourceMicroservice } from './enum/source-microservice.enum';
import { TargetType } from './enum/target-type.enum';

export interface INotification extends IBase {
  id: string;
  customerId: string;
  target: string;
  targetType: TargetType;
  messageHeader: string;
  message: string;
  priority: number;
  sourceMicroservice: SourceMicroservice;
  response: string;
  snsMessageId: string;
  sentAt: Date;
  pushDeliveryStatus: string;
  pushDeliveredAt: Date;
  pushViewedStatus: string;
  pushViewedAt: Date;
}
