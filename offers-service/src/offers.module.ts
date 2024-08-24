import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeormPostgresConfig';
import { OffersController } from './infrastructure/controllers/offer/offers.controller';
import { Offer } from './infrastructure/entities/offer.entity';
import { OfferService } from './usecases/offers.service';
import * as dotenv from 'dotenv';
import { IOfferRepository } from './domain/repository/offerRepository.interface';
import { IOfferService } from './domain/services/offerService.interface';
import { OffersRepository } from './infrastructure/repository/offers-repository';
import { SoapModule, SoapModuleOptions } from 'nestjs-soap';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { ControllerLoggingInterceptor } from './interceptors/controllerLogger.interceptor';
import { SoapService } from './infrastructure/services/soap-client.service';
import { ControllerLoggerMiddleware } from './middlewares/controllerLogger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => dotenv.config()],
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TypeOrmModule.forFeature([Offer]),
    SoapModule.forRootAsync({
      clientName: 'SUNLYTE_CLIENT',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<SoapModuleOptions> => ({
        clientName: 'SUNLYTE_CLIENT',
        uri: configService.get<string>('SOAP_URI'),
      }),
    }),
  ],
  controllers: [OffersController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ControllerLoggingInterceptor },
    { provide: IOfferRepository, useClass: OffersRepository },
    { provide: IOfferService, useClass: OfferService },
    SoapService,
  ],
})
export class OffersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ControllerLoggerMiddleware).forRoutes('*');
  }
}
