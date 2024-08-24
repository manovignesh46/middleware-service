import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3, SharedIniFileCredentials } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';
import { TypeOrmConfigService } from './config/typeormPostgresConfig';
import { IContentRepository } from './domain/repository/contentRepository.interface';
import { ICustDedupRepository } from './domain/repository/custDedupRespository.interface';
import { ICustIdCardDetailsRepository } from './domain/repository/custIdCardDetailsRepository.interface';
import { ICustOtpRepository } from './domain/repository/custOtpRepository.interface';
import { ICustPrimaryDetailsRepository } from './domain/repository/custPrimaryDetailsRepository.interface';
import { ICustRefinitivRepository } from './domain/repository/custRefinitivRepository.interface';
import { ICustScanCardSelfieCheckDetailsRepository } from './domain/repository/custScanCardSelfieCheckDetailsRepository.interface';
import { ICustScoringDataRepository } from './domain/repository/custScoringDataRepository.interface';
import { ICustTelcoRepository } from './domain/repository/custTelcoRepository.interface';
import { ICustToLOSRepository } from './domain/repository/custToLOSRepository.interface';
import { IOfferConfigRepository } from './domain/repository/offerConfigRepository.interface';
import { ISMSLogRepository } from './domain/repository/smsLogRepository.interface';
import { IStudentDetailsRepository } from './domain/repository/studentDetailsRepository.interface';
import { IUserDeviceRepository } from './domain/repository/user-device-repository.interface';
import { ISNSService } from './domain/services/aws-sns-service.interface';
import { ICredentialHelper } from './domain/services/credential.service.interface';
import { ICustDedupService } from './domain/services/custDedupService.interface';
import { ICustIdCardDetailsService } from './domain/services/custIdCardDetailsService.interface';
import { ICustOtpService } from './domain/services/custOtpService.interface';
import { ICustPrimaryDetailsService } from './domain/services/custPrimaryDetailsService.interface';
import { ICustRefinitivService } from './domain/services/custRefinitivService.interface';
import { ICustScoringDataService } from './domain/services/custScoringDataService.interface';
import { ICustTelcoService } from './domain/services/custTelcoService.interface';
import { ICustToLMSService } from './domain/services/custToLMSService.interface';
import { ICustToLOSService } from './domain/services/custToLOSService.interface';
import { ICustomersService } from './domain/services/customersService.interface';
import { IEmailService } from './domain/services/emailService.interface';
import { ILMSService } from './domain/services/lmsService.interface';
import { ILOSService } from './domain/services/losService.interface';
import { INotificationService } from './domain/services/notificationsService.interface';
import { IRefinitiveService } from './domain/services/refinitiveService.interface';
import { ISanctionService } from './domain/services/sanctionService.interface';
import { ISmsService } from './domain/services/smsService.interface';
import { IStudentDetailsService } from './domain/services/studentDetailsService.interface';
import { ITriggerOtpService } from './domain/services/triggerOtp.interface';
import { IVerifyOtpService } from './domain/services/verifyOtp.interface';
import { CustomersController } from './infrastructure/controllers/customers/customers.controller';
import { Content } from './infrastructure/entities/content.entity';
import { CustDedup } from './infrastructure/entities/custDedup.entity';
import { CustIdCardDetails } from './infrastructure/entities/custIdCardDetails.entity';
import { CustOtp } from './infrastructure/entities/custOtp.entity';
import { CustPrimaryDetails } from './infrastructure/entities/custPrimaryDetails.entity';
import { CustRefinitiv } from './infrastructure/entities/custRefinitiv.entity';
import { CustScanCardSelfieCheckDetails } from './infrastructure/entities/custScanCardSelfieCheckDetails.entity';
import { CustScoringData } from './infrastructure/entities/custScoringData.entity';
import { CustTelco } from './infrastructure/entities/custTelco.entity';
import { CustToLOS } from './infrastructure/entities/custToLOS.entity';
import { OfferConfig } from './infrastructure/entities/offerConfig.entity';
import { SMSLog } from './infrastructure/entities/smsLog.entity';
import { StudentDetails } from './infrastructure/entities/studentDetails.entity';
import { UserDevice } from './infrastructure/entities/user-device.entity';
import { ContentRepository } from './infrastructure/repository/content.repository';
import { CustDedupRepository } from './infrastructure/repository/custDedup.repository';
import { CustIdCardDetailsRepository } from './infrastructure/repository/custIdCardDetails.repository';
import { CustOtpRepository } from './infrastructure/repository/custOtp.repository';
import { CustPrimaryDetailsRepository } from './infrastructure/repository/custPrimaryDetails.repository';
import { CustRefinitivRepository } from './infrastructure/repository/custRefinitiv.repository';
import { CustScanCardSelfieCheckDetailsRepository } from './infrastructure/repository/custScanCardSelfieCheckDetails.repository';
import { CustScoringDataRepository } from './infrastructure/repository/custScoringData.repository';
import { CustTelcoRepository } from './infrastructure/repository/custTelco.repository';
import { custToLOSRepository } from './infrastructure/repository/custToLOS.repository';
import { OfferConfigRepository } from './infrastructure/repository/offerConfig.respository';
import { SMSLogRepository } from './infrastructure/repository/smsLog.repository';
import { StudentDetailsRepository } from './infrastructure/repository/studentDetails.repository';
import { UserDeviceRepository } from './infrastructure/repository/user-device.repository';
import { SNSService } from './infrastructure/services/aws-sns.service';
import { CredentialHelper } from './infrastructure/services/credential.service';
import { EmailService } from './infrastructure/services/email.service';
import { LMSService } from './infrastructure/services/lms.service';
import { LOSService } from './infrastructure/services/los.service';
import { PegPaySchoolAggregator } from './infrastructure/services/pegpay-school-aggregator.service';
import { RifinitiveService } from './infrastructure/services/refinitive.service';
import { S3ManagerService } from './infrastructure/services/s3-manager.service';
import { SchoolPaySchoolAggregatorService } from './infrastructure/services/schoolpay-school-aggregator.service';
import { NotificationServiceClient } from './infrastructure/services/notifiction-service-client/notifications-service-client.service';
import { IExperianService } from './domain/services/experian-service.interface';
import { ExperianService } from './infrastructure/services/experian.service';
import { ExperianData } from './infrastructure/entities/experian-data.entity';
import { IExperianDataRepository } from './domain/repository/experian-data-repository.interface';
import { ExperianDataRepository } from './infrastructure/repository/experian-data.repository';
import { SmsService } from './infrastructure/services/sms.service';
import { SoapService } from './infrastructure/services/soap-client.service';
import { ControllerLoggingInterceptor } from './interceptors/controllerLogger.interceptor';
import { ControllerLoggerMiddleware } from './middlewares/controllerLogger.middleware';
import { CustDedupService } from './usecases/custDedup.service';
import { CustIdCardDetailsService } from './usecases/custIdCardDetails.service';
import { CustOtpService } from './usecases/custOtp.service';
import { CustPrimaryDetailsService } from './usecases/custPrimaryDetails.service';
import { CustRefinitivService } from './usecases/custRefinitiv.service';
import { CustScoringDataService } from './usecases/custScoringData.service';
import { CustTelcoService } from './usecases/custTelco.service';
import { CustToLMSService } from './usecases/custToLMS.service';
import { CustToLOSService } from './usecases/custToLOS.service';
import { CustomersService } from './usecases/customers.service';
import { NotificationService } from './usecases/notifications.service';
import { SanctionService } from './usecases/sanction.service';
import { StudentDetailsService } from './usecases/studentDetails.service';
import { TriggerOtpService } from './usecases/triggerOtp.service';
import { VerifyOtpService } from './usecases/verifyOtp.service';
import { IRequestServiceClient } from './domain/services/requestServiceClient.service';
import { RequestServiceClient } from './infrastructure/services/requestServiceClient.service';
import { GeneralOtp } from './infrastructure/entities/general-otp.entity';
import { GeneralOtpService } from './infrastructure/services/general-otp.service';
import { IGeneralOtpRepository } from './domain/repository/general-otp-repository.interface';
import { GeneralOtpRepository } from './infrastructure/repository/general-otp.repository';
import { ForgotPinService } from './usecases/forgot-pin-service';
import { ICustTelcoTransactionRepository } from './domain/repository/custTelcoTransactionRepository.interface';
import { CustTelcoTransactionRepository } from './infrastructure/repository/custTelcoTransaction.repository';
import { CustTelcoTransaction } from './infrastructure/entities/custTelcoTransaction.entity';
import { ITelcoService } from './domain/services/telcoService.interface';
import { TelcoService } from './infrastructure/services/telco.service';
import { AggregatorWhiteListingService } from './infrastructure/services/aggregatorWhitelisting.service';
import { IWhitelistedStudentDetailsRepository } from './domain/repository/whitelistedStudentDetailsRepository.interface';
import { WhitelistedStudentDetailsRepository } from './infrastructure/repository/whitelistedStudentDetails.repository';
import { WhitelistedStudentDetails } from './infrastructure/entities/whitelistedStudentDetails.entity';
import { AuthServiceClient } from './infrastructure/services/auth-service-client/auth-service-client.service';
import { IIntegratorErrorMappingRepository } from './modules/error-mapping/integrator-error-repository.interface';
import { IntegratorErrorMappingRepository } from './modules/error-mapping/integrator-error-mapping.repository';
import { IntegratorErrorMappingEntity } from './modules/error-mapping/integrator-error-mapping.entity';
import { IntegratorErrorMappingService } from './modules/error-mapping/integrator-error-mapping.service';
import { CustFsRegistration } from './infrastructure/entities/custFsRegistration.entity';
import { ICustFsRegistrationRepository } from './domain/repository/custFsRegistrationRepository.interface';
import { CustFsRegistrationRepository } from './infrastructure/repository/custFsRegistration.repository';
import { IFSService } from './domain/services/fsService.interface';
import { FSService } from './infrastructure/services/freshService.service';
import { CustTicketDetails } from './infrastructure/entities/custTicketDetails.entity';
import { ICustTicketDetailsRepository } from './domain/repository/custTicketDetailsRepository.interface';
import { CustTicketDetailsRepository } from './infrastructure/repository/custTicketDetails.respository';
import { UserCronService } from './infrastructure/services/user.cron.service';
import { IContentService } from './domain/services/content.service.interface';
import { ContentService } from './infrastructure/services/content.service';
import { IIdExpiryCronService } from './domain/services/id-expiry-cron.service.interface';
import { IdExpiryCronService } from './usecases/id-expiry-cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MtnService } from './infrastructure/services/mtn.service';
import { IMtnService } from './domain/services/mtn.service.interface';
import { PushNotificationService } from './infrastructure/services/push-notification-service';
import { WhitelistedSchool } from './infrastructure/entities/whitelistedSchool.entity';
import { IWhitelistedSchoolRepository } from './domain/repository/whitelistedSchoolRepository.interface';
import { WhitelistedSchoolRepository } from './infrastructure/repository/whitelistedSchool.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        region: 'eu-west-1',
        credentials: new SharedIniFileCredentials({
          profile: 'furaha-dev',
        }),
      },
      services: [S3],
    }),
    HttpModule.register({
      validateStatus: function (status) {
        return true; //don't throw error in the event of 400 / 500 status codes
      },
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService, imports: [] }),
    TypeOrmModule.forFeature([
      CustToLOS,
      CustDedup,
      CustOtp,
      CustPrimaryDetails,
      StudentDetails,
      CustScoringData,
      CustTelco,
      CustRefinitiv,
      CustIdCardDetails,
      Content,
      CustScanCardSelfieCheckDetails,
      SMSLog,
      OfferConfig,
      UserDevice,
      ExperianData,
      GeneralOtp,
      WhitelistedStudentDetails,
      CustTelcoTransaction,
      IntegratorErrorMappingEntity,
      CustFsRegistration,
      CustTicketDetails,
      WhitelistedSchool,
    ]),
  ],
  controllers: [CustomersController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ControllerLoggingInterceptor },
    { provide: IRefinitiveService, useClass: RifinitiveService },
    { provide: ISanctionService, useClass: SanctionService },
    { provide: ICustomersService, useClass: CustomersService },
    { provide: IEmailService, useClass: EmailService },
    { provide: ISmsService, useClass: SmsService },
    { provide: INotificationService, useClass: NotificationService },
    { provide: ICustDedupRepository, useClass: CustDedupRepository },
    { provide: ICustOtpRepository, useClass: CustOtpRepository },
    { provide: ITriggerOtpService, useClass: TriggerOtpService },
    { provide: ICustToLOSRepository, useClass: custToLOSRepository },
    {
      provide: ICustPrimaryDetailsRepository,
      useClass: CustPrimaryDetailsRepository,
    },
    { provide: ICustToLOSService, useClass: CustToLOSService },
    { provide: ILOSService, useClass: LOSService },
    { provide: ICustOtpService, useClass: CustOtpService },
    { provide: ICustDedupService, useClass: CustDedupService },
    {
      provide: ICustPrimaryDetailsService,
      useClass: CustPrimaryDetailsService,
    },
    {
      provide: ICustPrimaryDetailsRepository,
      useClass: CustPrimaryDetailsRepository,
    },
    { provide: ICustOtpService, useClass: CustOtpService },
    { provide: ICustDedupService, useClass: CustDedupService },
    {
      provide: ICustPrimaryDetailsService,
      useClass: CustPrimaryDetailsService,
    },
    {
      provide: ICustScoringDataRepository,
      useClass: CustScoringDataRepository,
    },
    { provide: ICustScoringDataService, useClass: CustScoringDataService },
    { provide: ICustTelcoRepository, useClass: CustTelcoRepository },
    { provide: ICustTelcoService, useClass: CustTelcoService },
    { provide: ICustRefinitivRepository, useClass: CustRefinitivRepository },
    { provide: ICustRefinitivService, useClass: CustRefinitivService },
    { provide: IVerifyOtpService, useClass: VerifyOtpService },
    { provide: IStudentDetailsRepository, useClass: StudentDetailsRepository },
    { provide: IStudentDetailsService, useClass: StudentDetailsService },
    {
      provide: ICustScanCardSelfieCheckDetailsRepository,
      useClass: CustScanCardSelfieCheckDetailsRepository,
    },
    {
      provide: ICustIdCardDetailsRepository,
      useClass: CustIdCardDetailsRepository,
    },
    { provide: ICustIdCardDetailsService, useClass: CustIdCardDetailsService },
    { provide: IContentRepository, useClass: ContentRepository },
    { provide: ISMSLogRepository, useClass: SMSLogRepository },
    { provide: ICredentialHelper, useClass: CredentialHelper },
    { provide: IOfferConfigRepository, useClass: OfferConfigRepository },
    { provide: ILMSService, useClass: LMSService },
    { provide: ICustToLMSService, useClass: CustToLMSService },
    PegPaySchoolAggregator,
    SchoolPaySchoolAggregatorService,
    { provide: ISNSService, useClass: SNSService },
    ConfigService,
    S3ManagerService,
    HttpModule,
    SoapService,
    { provide: IUserDeviceRepository, useClass: UserDeviceRepository },
    NotificationServiceClient,
    { provide: IExperianService, useClass: ExperianService },
    {
      provide: IExperianDataRepository,
      useClass: ExperianDataRepository,
    },
    { provide: IRequestServiceClient, useClass: RequestServiceClient },
    GeneralOtpService,
    { provide: IGeneralOtpRepository, useClass: GeneralOtpRepository },
    {
      provide: ICustTelcoTransactionRepository,
      useClass: CustTelcoTransactionRepository,
    },
    { provide: ITelcoService, useClass: TelcoService },
    ForgotPinService,
    AggregatorWhiteListingService,
    {
      provide: IWhitelistedStudentDetailsRepository,
      useClass: WhitelistedStudentDetailsRepository,
    },
    {
      provide: ICustFsRegistrationRepository,
      useClass: CustFsRegistrationRepository,
    },
    {
      provide: ICustTicketDetailsRepository,
      useClass: CustTicketDetailsRepository,
    },
    {
      provide: IFSService,
      useClass: FSService,
    },
    AuthServiceClient,
    {
      provide: IIntegratorErrorMappingRepository,
      useClass: IntegratorErrorMappingRepository,
    },
    {
      provide: IContentService,
      useClass: ContentService,
    },
    IntegratorErrorMappingService,
    UserCronService,
    {
      provide: IIdExpiryCronService,
      useClass: IdExpiryCronService,
    },
    UserCronService,
    {
      provide: IMtnService,
      useClass: MtnService,
    },
    {
      provide: IWhitelistedSchoolRepository,
      useClass: WhitelistedSchoolRepository,
    },
    PushNotificationService,
  ],
})
export class CustomersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ControllerLoggerMiddleware).forRoutes('*');
  }
}
