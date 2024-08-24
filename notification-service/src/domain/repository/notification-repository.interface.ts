import { INotification } from '../model/notification.interface';

export abstract class INotificationRepository {
  abstract create(notification: INotification): Promise<INotification>;
  abstract update(notification: INotification): Promise<INotification>;
  abstract findByTarget(target: string): Promise<INotification[]>;
  abstract findById(id: string): Promise<INotification>;
}
