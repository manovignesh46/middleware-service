import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeormPostgresConfig';
import { INotificationRepository } from './domain/repository/notification-repository.interface';
import { ISNSService } from './domain/services/aws-sns-service.interface';
import { ICredentialHelper } from './domain/services/credential.service.interface';
import { NotificationController } from './infrastructure/controllers/notification.controller';
import { Notification } from './infrastructure/entities/notification.entity';
import { NotificationRepository } from './infrastructure/repository/notification.repository';
import { CredentialHelper } from './infrastructure/services/credential.service';
import { CustomerServiceClient } from './infrastructure/services/customer-service-client/customers-service-client.service';
import { SNSService } from './infrastructure/services/sns.service';
import { NotificationService } from './usecases/notification.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService, imports: [] }),
    TypeOrmModule.forFeature([Notification]),
    HttpModule,
  ],
  controllers: [NotificationController],
  providers: [
    { provide: ISNSService, useClass: SNSService },
    { provide: ICredentialHelper, useClass: CredentialHelper },
    { provide: INotificationRepository, useClass: NotificationRepository },
    NotificationService,
    CustomerServiceClient,
  ],
})
export class NotificationsModule {}
