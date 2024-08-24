import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeormPostgresConfig';
import { ICustomerServiceClient } from './domain/service/customer-service-client.service.interface';
import { ILOSService } from './domain/service/losService.interface';
import { RepayLoanService } from './usecases/repay-loan.service';
import { IRepayLoanService } from './domain/service/repay-loan.service.interface';
import { RequestsController } from './infrastructure/controllers/requests/requests.controller';
import { CustomerServiceClient } from './infrastructure/service/customers-service-client.service';
import { LOSService } from './infrastructure/service/los.service';
import { CustLoansApplied } from './infrastructure/entities/cust-loans-applied.entity';
import { ICustLoansAppliedRepository } from './domain/repository/cust-loans-applied-respository.interface';
import { CustLoansAppliedRepository } from './infrastructure/repository/cust-loans-applied.repository';
import { IRequestService } from './domain/service/request-service.interface';
import { RequestService } from './usecases/request.service';
import { IRequestToLOSService } from './domain/service/requestToLOSService.interface';
import { RequestToLOSService } from './usecases/requestToLOS.service';
import { ICustLoanRepaymentRecordRepository } from './domain/repository/cust-loan-repayment-record.repository.interface';
import { CustLoanRepaymentRecordRepository } from './infrastructure/repository/cust-loan-repayment-record.repository';
import { CustLoanRepaymentRecord } from './infrastructure/entities/cust-loan-repayment-record.entity';
import { ILMSService } from './domain/service/lmsService.interface';
import { LMSService } from './infrastructure/service/lms.service';
import { IRequestToLMSService } from './domain/service/requestToLMSService.interface';
import { RequestToLMSService } from './usecases/requestToLMS.service';
import { NotificationServiceClient } from './infrastructure/service/notification-service-client/notifications-service-client.service';
import { IContentService } from './domain/content.service.interface';
import { ContentService } from './infrastructure/service/content.service';
import { IContentRepository } from './domain/repository/content-repository.interface';
import { ContentRepository } from './infrastructure/repository/content.repository';
import { Content } from './infrastructure/entities/content.entity';
import { FAQ } from './infrastructure/entities/faq.entity';
import { IFAQRepository } from './domain/repository/faqRepository.interface';
import { FAQRepository } from './infrastructure/repository/faq.repository';
import { PolicyDocsService } from './usecases/policy-docs.service';
import { IS3ClientService } from './domain/service/s3-client-service.interface';
import { S3ClientService } from './infrastructure/service/s3-client.service';
import { ICredentialHelper } from './domain/service/credential.service.interface';
import { CredentialHelper } from './infrastructure/service/credential.service';
import { RequestOperation } from './infrastructure/entities/requestOperation.entity';
import { IRequestOperationRepository } from './domain/repository/requestOperationsRepository.interface';
import { RequestOperationRepository } from './infrastructure/repository/requestOperation.repository';
import { IRequestToLOSRepository } from './domain/repository/request-to-los.repository.interface';
import { RequestToLOSRepository } from './infrastructure/repository/request-to-los.repository';
import { RequestToLOS } from './infrastructure/entities/request-to-los.entity';
import { FormData } from './infrastructure/entities/form-data.entity';
import { IFormDataRepository } from './domain/repository/form-data.repository.interface';
import { FormDataRepository } from './infrastructure/repository/form-data.repository';
import { PDFRender } from './infrastructure/service/pdfRender.service';
import { IPDFRenderService } from './domain/service/IPDFRender.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.register({
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status == 500; // LOS returns 500 when getting loan statement if loanId invalid
      },
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService, imports: [] }),
    TypeOrmModule.forFeature([
      CustLoansApplied,
      CustLoanRepaymentRecord,
      Content,
      FAQ,
      RequestOperation,
      RequestToLOS,
      FormData,
    ]),
  ],
  controllers: [RequestsController],
  providers: [
    ConfigService,
    HttpModule,
    { provide: IRepayLoanService, useClass: RepayLoanService },
    { provide: ILOSService, useClass: LOSService },
    { provide: ICustomerServiceClient, useClass: CustomerServiceClient },
    { provide: ILOSService, useClass: LOSService },
    {
      provide: ICustLoansAppliedRepository,
      useClass: CustLoansAppliedRepository,
    },
    { provide: IRequestService, useClass: RequestService },
    { provide: IRequestToLOSService, useClass: RequestToLOSService },
    {
      provide: ICustLoanRepaymentRecordRepository,
      useClass: CustLoanRepaymentRecordRepository,
    },
    { provide: ILMSService, useClass: LMSService },
    { provide: IRequestToLMSService, useClass: RequestToLMSService },
    NotificationServiceClient,
    { provide: IContentService, useClass: ContentService },
    { provide: IContentRepository, useClass: ContentRepository },
    { provide: IFAQRepository, useClass: FAQRepository },
    PolicyDocsService,
    { provide: IS3ClientService, useClass: S3ClientService },
    { provide: ICredentialHelper, useClass: CredentialHelper },
    {
      provide: IRequestOperationRepository,
      useClass: RequestOperationRepository,
    },
    { provide: IPDFRenderService, useClass: PDFRender },
    { provide: IRequestToLOSRepository, useClass: RequestToLOSRepository },
    { provide: IFormDataRepository, useClass: FormDataRepository },
  ],
})
export class RequestsModule {}
