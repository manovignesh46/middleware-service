import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IAuthService } from './domain/services/authService.interface';
import { AuthController } from './infrastructure/controllers/auth/auth.controller';
import { HealthController } from './infrastructure/controllers/health/health.controller';
import { AwsCognitoAuthService } from './usecases/awsCognitoAuth.service';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { ControllerLoggerMiddleware } from './middlewares/controllerLogger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ControllerLoggingInterceptor } from './interceptors/controllerLogger.interceptor';
import { ICustomerServiceClient } from './domain/services/customerClient.interface';
import { CustomerServiceClient } from './infrastructure/services/customerClient.service';
import { ICredentialHelper } from './domain/services/credential.service.interface';
import { CredentialHelper } from './infrastructure/services/credential.service';
import { NotificationServiceClient } from './infrastructure/services/notification-service-client/notifications-service-client.service';
import { TypeOrmConfigService } from './config/typeormPostgresConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './infrastructure/entities/device.entity';
import { CognitoDetail } from './infrastructure/entities/cognito-detail.entity';
import { ICognitoDetailRepository } from './domain/repositories/cognito-detail-repository.interface';
import { CognitoDetailRepository } from './infrastructure/repository/cognito-detail.repository';
import { IDeviceRepository } from './domain/repositories/device-repository.interface';
import { DeviceRepository } from './infrastructure/repository/device.repository';
import { DeviceService } from './infrastructure/services/device.service';
import { ICognitoDetailService } from './domain/services/cognito-detail.service.interface';
import { CognitoDetailService } from './infrastructure/services/cognito-detail.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TerminusModule,
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService, imports: [] }),
    TypeOrmModule.forFeature([Device, CognitoDetail]),
    HttpModule,
  ],
  controllers: [AuthController, HealthController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ControllerLoggingInterceptor },
    { provide: IAuthService, useClass: AwsCognitoAuthService },
    {
      provide: IAuthService,
      useClass: AwsCognitoAuthService,
    },
    {
      provide: ICustomerServiceClient,
      useClass: CustomerServiceClient,
    },
    { provide: ICredentialHelper, useClass: CredentialHelper },
    NotificationServiceClient,
    { provide: ICognitoDetailRepository, useClass: CognitoDetailRepository },
    { provide: IDeviceRepository, useClass: DeviceRepository },
    DeviceService,
    { provide: ICognitoDetailService, useClass: CognitoDetailService },
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ControllerLoggerMiddleware).forRoutes('*');
  }
}
