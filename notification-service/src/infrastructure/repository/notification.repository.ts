import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INotification } from '../../domain/model/notification.interface';
import { INotificationRepository } from '../../domain/repository/notification-repository.interface';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<INotification>,
  ) {}
  findById(id: string): Promise<INotification> {
    return this.notificationRepository.findOne({ where: { id } });
  }
  create(notification: INotification): Promise<INotification> {
    return this.notificationRepository.save(notification);
  }
  async update(notification: INotification): Promise<INotification> {
    const oldNotification = this.findById(notification.id);
    return this.notificationRepository.save({
      ...oldNotification,
      ...notification,
    });
  }
  findByTarget(target: string): Promise<INotification[]> {
    return this.notificationRepository.findBy({ target });
  }
}
