import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { IContentService } from '../domain/content.service.interface';
import { FormType } from '../domain/enum/form-type.enum';
import { ICustLoansApplied } from '../domain/model/cust-loans-applied.interface';
import { IFormData } from '../domain/model/form-data.interface';
import { IRequestOperation } from '../domain/model/requestOperation.interface';
import { ICustLoansAppliedRepository } from '../domain/repository/cust-loans-applied-respository.interface';
import { IFAQRepository } from '../domain/repository/faqRepository.interface';
import { IFormDataRepository } from '../domain/repository/form-data.repository.interface';
import { IRequestOperationRepository } from '../domain/repository/requestOperationsRepository.interface';
import { IPDFRenderService } from '../domain/service/IPDFRender.service';
import { ICustomerServiceClient } from '../domain/service/customer-service-client.service.interface';
import { IRequestService } from '../domain/service/request-service.interface';
import { IRequestToLMSService } from '../domain/service/requestToLMSService.interface';
import { IRequestToLOSService } from '../domain/service/requestToLOSService.interface';
import { IS3ClientService } from '../domain/service/s3-client-service.interface';
import { LMSLoanCalculatorRespDTO } from '../infrastructure/controllers/requests/dtos/LMSLoanCalculatorResp.dto';
import { ApplyLoansDTO } from '../infrastructure/controllers/requests/dtos/applyLoans.dto';
import { CustomerIdCardDetailsDTO } from '../infrastructure/controllers/requests/dtos/customerIdCardDetails.dto';
import { LMSFormData } from '../infrastructure/controllers/requests/dtos/lmsFormData.dto';
import { LoanCalculatorDTO } from '../infrastructure/controllers/requests/dtos/loanCalculator.dto';
import { OfferDetailsDTO } from '../infrastructure/controllers/requests/dtos/offerDetails.dto';
import { SelfieLivenessDTO } from '../infrastructure/controllers/requests/dtos/selfieLiveness.dto';
import { StudentDetailsDTO } from '../infrastructure/controllers/requests/dtos/studentDetails.dto';
import { SubmitLoansDTO } from '../infrastructure/controllers/requests/dtos/submitLoans.dto';
import {
  ApplyLoansPresenter,
  OfferDetail,
} from '../infrastructure/controllers/requests/presenters/apply-loans.presenter';
import { DownloadPresenter } from '../infrastructure/controllers/requests/presenters/download.presenter';
import {
  FAQPresenter,
  FAQdto,
} from '../infrastructure/controllers/requests/presenters/faq.presenter';
import {
  LoanCalculatorPresenter,
  transformLoanCalculator,
} from '../infrastructure/controllers/requests/presenters/loanCalculator.presenter';
import { LoanDetailsStatementPresenter } from '../infrastructure/controllers/requests/presenters/loanDetailStatement.presenter';
import { LoanStatementPresenter } from '../infrastructure/controllers/requests/presenters/loanStatement.presenter';
import { SubmitLoansPresenter } from '../infrastructure/controllers/requests/presenters/submit-loans.presenter';
import { CustLoansApplied } from '../infrastructure/entities/cust-loans-applied.entity';
import { FAQ } from '../infrastructure/entities/faq.entity';
import { FormData } from '../infrastructure/entities/form-data.entity';
import { RequestOperation } from '../infrastructure/entities/requestOperation.entity';
import { SendNotificationDto } from '../infrastructure/service/notification-service-client/dto/send-notification.dto';
import { SourceMicroservice } from '../infrastructure/service/notification-service-client/enum/source-microservice.enum';
import { TargetType } from '../infrastructure/service/notification-service-client/enum/target-type.enum';
import { NotificationServiceClient } from '../infrastructure/service/notification-service-client/notifications-service-client.service';
import { DefaultData } from './defaultData';

@Injectable()
export class RequestService implements IRequestService {
  private readonly logger = new Logger(RequestService.name);

  private LOAN_STATEMENT_BUCKET_NAME: string;
  private LOAN_APPLICATION_BUCKET_NAME: string;
  constructor(
    private readonly custLoansAppliedRepository: ICustLoansAppliedRepository,
    private readonly customerServiceClient: ICustomerServiceClient,
    private readonly requestToLOSService: IRequestToLOSService,
    private readonly requestToLMSService: IRequestToLMSService,
    private notificationServiceClient: NotificationServiceClient,
    private readonly contentService: IContentService,
    private readonly faqRespository: IFAQRepository,
    private readonly pdfRender: IPDFRenderService,
    private readonly s3Client: IS3ClientService,
    private readonly requestOperationRepository: IRequestOperationRepository,
    private readonly configService: ConfigService,
    private readonly formDataRepository: IFormDataRepository,
  ) {
    this.LOAN_STATEMENT_BUCKET_NAME = this.configService.get<string>(
      'LOAN_STATEMENT_BUCKET_NAME',
    );
    this.LOAN_APPLICATION_BUCKET_NAME = this.configService.get<string>(
      'LOAN_APPLICATION_BUCKET_NAME',
    );
  }

  async getAllFAQs(): Promise<FAQPresenter> {
    const faqList: FAQ[] = await this.faqRespository.getAllFAQs();
    let faqMap: any = {};
    const presenter: FAQPresenter = new FAQPresenter();
    if (!faqList.length) {
      // save default
      faqMap = DefaultData.faqData;
      // faqMap = JSON.parse(this.configService.get<any>('DEFAULT_FAQ'));
    } else {
      let faqs: FAQdto[] = [];
      for await (const faq of faqList) {
        const faqDto: FAQdto = new FAQdto();
        faqDto.faq = faq.faq;
        faqDto.ans = faq.faqAns;

        if (faqMap[faq.category]) {
          faqs = faqMap[faq.category];
        } else {
          faqs = [];
        }

        faqs.push(faqDto);
        faqMap[faq.category] = faqs;
      }
    }
    presenter.faqs = faqMap;
    return presenter;
  }

  async terminateOngoingLoan(custId: string): Promise<boolean> {
    const resp: boolean = await this.customerServiceClient.terminateOngoingLoan(
      custId,
    );
    if (resp) {
      return await this.cancelWorkflow(custId);
    }
    return resp;
  }

  async cancelWorkflow(custId: string): Promise<boolean> {
    const custLoansAppliedList: ICustLoansApplied[] =
      await this.custLoansAppliedRepository.findByCustId(custId);
    const {
      msisdnCountryCode,
      msisdn,
      preferredName,
      platformApplicationEndpoint,
      availableCreditLimit,
    } = await this.customerServiceClient.getMsisdn(custId);

    const fullMsisdn = msisdnCountryCode + msisdn;
    for await (const custLoanApplied of custLoansAppliedList) {
      custLoanApplied.isTerminated = true;
      await this.custLoansAppliedRepository.save(custLoanApplied);
      const { roi } = await this.customerServiceClient.getOfferDetails(
        custLoanApplied.offerId,
      );
      this.logger.log('available credit limit : ' + availableCreditLimit);
      const { message, messageHeader } =
        await this.contentService.getLoanTerminatedMessage(
          preferredName,
          availableCreditLimit,
          (Number(roi) * 100).toString(),
        );
      this.logger.log('New codes are up');
      this.logger.log('New messgae : ' + message);
      const sendNotificationDto: SendNotificationDto = {
        target: fullMsisdn,
        targetType: TargetType.PHONE_NUMBER,
        messageHeader,
        message,
        customerId: custId,
        sourceMicroservice: SourceMicroservice.REQUESTS,
        priority: 9,
      };
      this.notificationServiceClient.sendNotification(sendNotificationDto);

      //Send Push Notification
      if (platformApplicationEndpoint) {
        const sendPushNotificationDto: SendNotificationDto = {
          target: platformApplicationEndpoint,
          targetType: TargetType.ENDPOINT_ARN,
          messageHeader,
          message,
          customerId: custId,
          // fullMsisdn: fullMsisdn,
          sourceMicroservice: SourceMicroservice.REQUESTS,
          priority: 9,
        };
        this.notificationServiceClient.sendNotification(
          sendPushNotificationDto,
        );
      }
    }
    return true;
  }

  async loanCalculator(
    custId: string,
    loanCalculatorDTO: LoanCalculatorDTO,
  ): Promise<LoanCalculatorPresenter> {
    const { msisdnCountryCode, msisdn, preferredName } =
      await this.customerServiceClient.getMsisdn(custId);

    const fullMsisdn = msisdnCountryCode + msisdn;
    const loanCalculatorResponse: LMSLoanCalculatorRespDTO =
      await this.requestToLMSService.loanCalculator(
        fullMsisdn,
        loanCalculatorDTO,
      );

    const presenter = await transformLoanCalculator(loanCalculatorResponse);

    return presenter;
  }

  async submitLoans(
    custId: string,
    submitLoansDTO: SubmitLoansDTO,
  ): Promise<SubmitLoansPresenter> {
    this.logger.log(this.submitLoans.name);

    const {
      msisdnCountryCode,
      msisdn,
      preferredName,
      platformApplicationEndpoint,
    } = await this.customerServiceClient.getMsisdn(custId);

    const fullMsisdn = msisdnCountryCode + msisdn;
    const targetApiUuid = await this.customerServiceClient.getTargetApiUUID(
      custId,
    );

    const studentDetailsDTO: StudentDetailsDTO =
      await this.customerServiceClient.getStudentDetails(
        submitLoansDTO.studentPCOId,
        custId,
      );

    const custLoanApplied: ICustLoansApplied =
      await this.custLoansAppliedRepository.findByPCOId(
        submitLoansDTO.studentPCOId,
        custId,
      );

    custLoanApplied.loanStatus = 'Loan Submitted';
    custLoanApplied.loanInterestAmount =
      submitLoansDTO.agreedLoanBoundaries.totalInterestAmount.toString();

    custLoanApplied.loanRepayFrequecy =
      submitLoansDTO.agreedLoanBoundaries.repaymentFrequency;
    custLoanApplied.loanRepayAmount =
      submitLoansDTO.agreedLoanBoundaries.repaymentAmount;
    custLoanApplied.loanTotalAmountPayable =
      submitLoansDTO.agreedLoanBoundaries.totalAmountPayable;
    custLoanApplied.loanFees = submitLoansDTO.agreedLoanBoundaries.feeAmount;
    custLoanApplied.loanPreferedPaymentOn =
      submitLoansDTO.agreedLoanBoundaries.repaymentPreferredOn;
    // custLoanApplied.loanLastPaymentDate = submitLoansDTO.agreedLoanBoundaries.lastRepayment;
    custLoanApplied.loanTenureInstallments =
      submitLoansDTO.agreedLoanBoundaries.tenor;
    custLoanApplied.loanTotalAmount =
      submitLoansDTO.agreedLoanBoundaries.requiredAmount;

    await this.custLoansAppliedRepository.save(custLoanApplied);

    submitLoansDTO.agreedLoanBoundaries?.repaymentFrequency.toLowerCase;
    await this.requestToLOSService.submitLoans(
      targetApiUuid,
      submitLoansDTO.agreedLoanBoundaries.requiredAmount,
      submitLoansDTO.studentPCOId,
      custLoanApplied.offerId,
      submitLoansDTO.agreedLoanBoundaries?.tenor,
      submitLoansDTO.agreedLoanBoundaries?.repaymentFrequency,
      submitLoansDTO.agreedLoanBoundaries?.repaymentFrequency.toLowerCase() ===
        'weekly'
        ? submitLoansDTO.agreedLoanBoundaries?.repaymentPreferredOn
        : '',
      custId,
    );

    const { message, messageHeader } =
      await this.contentService.getSubmitLoanSuccessMsg(preferredName);

    const sendNotificationDto: SendNotificationDto = {
      target: fullMsisdn,
      targetType: TargetType.PHONE_NUMBER,
      messageHeader,
      message,
      customerId: custId,
      sourceMicroservice: SourceMicroservice.REQUESTS,
      priority: 9,
    };
    this.notificationServiceClient.sendNotification(sendNotificationDto);

    //Send Push Notification
    if (platformApplicationEndpoint) {
      const sendPushNotificationDto: SendNotificationDto = {
        target: platformApplicationEndpoint,
        targetType: TargetType.ENDPOINT_ARN,
        messageHeader,
        message,
        customerId: custId,
        // fullMsisdn: fullMsisdn
        sourceMicroservice: SourceMicroservice.REQUESTS,
        priority: 9,
      };
      this.notificationServiceClient.sendNotification(sendPushNotificationDto);
    }

    const submitLoansPresenter: SubmitLoansPresenter =
      new SubmitLoansPresenter();
    submitLoansPresenter.loanAmount =
      submitLoansDTO.agreedLoanBoundaries.requiredAmount;
    submitLoansPresenter.schoolCode = studentDetailsDTO.studentSchoolCode;
    submitLoansPresenter.studentName = studentDetailsDTO.studentFullName;
    submitLoansPresenter.studentClass = studentDetailsDTO.studentClass;

    return submitLoansPresenter;
  }

  async applyLoans(
    custId: string,
    applyLoansDTO: ApplyLoansDTO,
  ): Promise<ApplyLoansPresenter> {
    this.logger.log(this.applyLoans.name);

    const targetApiUuid = await this.customerServiceClient.getTargetApiUUID(
      custId,
    );

    const customerIdCardDetails: CustomerIdCardDetailsDTO =
      await this.customerServiceClient.getIdCardDetails(custId);
    const customerSelfieLiveness: SelfieLivenessDTO =
      await this.customerServiceClient.getCustomerSelfieLiveness(custId);
    const offerDetailsDTO: OfferDetailsDTO =
      await this.customerServiceClient.getOfferDetails(applyLoansDTO.offerId);

    if (
      targetApiUuid === null ||
      customerIdCardDetails === null ||
      customerSelfieLiveness === null ||
      offerDetailsDTO === null
    )
      return null;

    const offersDetail: OfferDetail = {
      offerId: offerDetailsDTO.offerId,
      offerName: offerDetailsDTO.offerName,
      offerDescription: offerDetailsDTO.offerDescription,
      offerImage: '',
      isActive: 'Active' === offerDetailsDTO.activeStatus,
      moreDetails: {
        tenure: offerDetailsDTO.tenure,
        roi: offerDetailsDTO.roi,
        repaymentFrequency: offerDetailsDTO.repaymentFrequency,
        noOfInstallment: offerDetailsDTO.noOfInstallment,
        limit: offerDetailsDTO.offerLimit,
        applicationfee: offerDetailsDTO.applicationFee,
      },
    };

    const presenter: ApplyLoansPresenter =
      await this.requestToLOSService.getLoanBoundaries(targetApiUuid);
    presenter.studentPCOId = applyLoansDTO.studentPCOId;
    presenter.offersDetail = offersDetail;

    await this.requestToLOSService.applyLoans(
      targetApiUuid,
      customerIdCardDetails,
      customerSelfieLiveness,
    );

    const loanBoundaries: any = {
      minLoanAmount: presenter.minLoanAmount,
      maxLoanAmount: presenter.maxLoanAmount,
    };

    const custLoanApplied: ICustLoansApplied = new CustLoansApplied();
    custLoanApplied.custId = custId;
    custLoanApplied.offerId = applyLoansDTO.offerId;
    custLoanApplied.PCOId = applyLoansDTO.studentPCOId;
    custLoanApplied.losLoansBoundaries = JSON.stringify(loanBoundaries);
    custLoanApplied.loanStatus = 'Loan Applied';

    await this.custLoansAppliedRepository.save(custLoanApplied);

    return presenter;
  }

  async loanStatements(
    custId: string,
    optId: string,
  ): Promise<LoanStatementPresenter> {
    const { msisdnCountryCode, msisdn } =
      await this.customerServiceClient.getMsisdn(custId);
    const fullMsisdn = msisdnCountryCode + msisdn;
    const presenter: LoanStatementPresenter =
      await this.requestToLMSService.getloanStatement(
        optId,
        fullMsisdn,
        custId,
      );

    return presenter;
  }

  async loanDetailsStatement(
    custId: string,
    typeId: string,
    loanId: string,
  ): Promise<LoanDetailsStatementPresenter> {
    const { msisdnCountryCode, msisdn, preferredName } =
      await this.customerServiceClient.getMsisdn(custId);

    const fullMsisdn = msisdnCountryCode + msisdn;
    return await this.requestToLMSService.loanStatementDetails(
      fullMsisdn,
      typeId,
      loanId,
      custId,
    );
  }

  async downloadLoanStatements(
    custId: string,
    typeId: string,
    loanId: string,
  ): Promise<DownloadPresenter> {
    this.logger.log(this.downloadLoanStatements.name);
    let statusMsg: string;
    let presignedURL = '';
    const presenter = new DownloadPresenter();
    const detailStatementPresenter: LoanDetailsStatementPresenter =
      await this.loanDetailsStatement(custId, typeId, loanId);
    // const detailStatementPresenter: LoanDetailsStatementPresenter = MockData.mockLoanDetailsStatment;

    this.logger.log('detailStatementPresenter');
    this.logger.log(detailStatementPresenter);
    if (detailStatementPresenter) {
      if (detailStatementPresenter.loanTransactionsDetails) {
        const localPath: string = await this.pdfRender.createLoanStatement(
          detailStatementPresenter,
        );
        if (!localPath) {
          return null;
        }
        this.logger.log('localPath for the statment :: ' + localPath);
        const filename = localPath.substring(localPath.lastIndexOf('/') + 1);
        const destinationPath = `${custId}/${filename}`;
        const isUploaded: boolean = await this.s3Client.pushObjecttoS3(
          this.LOAN_STATEMENT_BUCKET_NAME,
          localPath,
          destinationPath,
        );
        if (isUploaded) {
          presignedURL = await this.s3Client.getObjectPresignedUrl(
            this.LOAN_STATEMENT_BUCKET_NAME,
            destinationPath,
          );
          this.logger.log(presignedURL);
          const requestOperation: IRequestOperation = new RequestOperation();
          requestOperation.opDate = new Date();
          requestOperation.opName = 'STATEMENT DOWNLOAD';
          requestOperation.opState = 'Success';
          requestOperation.custId = custId;
          requestOperation.remark = `Statement download link sent to customer - ${presignedURL.toString()},  Destination Path - ${destinationPath}`;

          this.requestOperationRepository.save(requestOperation);

          presenter.loanId = loanId;
          presenter.statementLink = presignedURL;
        }
        fs.unlinkSync(localPath);
      } else {
        statusMsg =
          'Statement is not generated as no transactions happened for this loan id.';
      }
    } else {
      statusMsg =
        'Loan statement details not found for this loan. Please contact customer support.';
    }
    presenter.statusMsg = statusMsg;
    return presenter;
  }

  async downloadLoanApplication(
    custId: string,
    typeId: string,
    loanId: string,
  ): Promise<DownloadPresenter> {
    let formData: IFormData =
      await this.formDataRepository.getByCustIdLoanIdAndTypeId(
        custId,
        loanId,
        typeId === '1' ? 'ACTIVE' : 'CLOSED',
      );
    const presenter = new DownloadPresenter();
    if (formData && formData.s3PresignedUrl) {
      formData.requestCount += 1;
      formData = await this.formDataRepository.update(formData);

      const s3PresignedURL: string = await this.s3Client.getObjectPresignedUrl(
        formData.s3Bucket,
        formData.s3DocPath,
      );
      formData.s3PresignedUrl = s3PresignedURL;
      formData.s3UrlUpdatedAt = new Date();
      formData = await this.formDataRepository.update(formData);

      presenter.loanId = loanId;
      presenter.statementLink = formData.s3PresignedUrl;
    } else {
      // get msisdn for the custId
      const { msisdnCountryCode, msisdn, preferredName } =
        await this.customerServiceClient.getMsisdn(custId);
      const fullMsisdn = msisdnCountryCode + msisdn;

      //  make LMS call
      const losFormData: LMSFormData =
        await this.requestToLMSService.applicationFormData(loanId, fullMsisdn);
      if (!losFormData) {
        presenter.statusMsg =
          'System is busy, please retry the download after sometime or contact customer support.';
        return presenter;
      }

      // save to db formData
      formData = new FormData();

      formData.customerId = custId;
      formData.fullMsisdn = fullMsisdn;
      formData.loanId = loanId;
      formData.typeId = typeId === '1' ? 'ACTIVE' : 'CLOSED';
      formData.formData = JSON.stringify(losFormData);
      formData.formType = FormType.LOAN_APPLICATION_FORM;
      formData.formStatus = losFormData.applicationStatus;
      formData.s3Bucket = this.LOAN_APPLICATION_BUCKET_NAME;
      formData.requestCount = 1;

      // generate PDF and get its path
      const localPath = await this.pdfRender.createLoanApplicationForm(
        formData,
      );

      const filename = localPath.substring(localPath.lastIndexOf('/') + 1);
      const destinationPath = `${custId}/${filename}`;

      // TODO Abhishek remove this code after env var is fixed
      this.logger.log(
        'Bucket Name for loan Application form :: ',
        this.LOAN_APPLICATION_BUCKET_NAME,
      );
      if (!this.LOAN_APPLICATION_BUCKET_NAME)
        this.LOAN_APPLICATION_BUCKET_NAME = 'test-furaha-customer';

      this.logger.log(
        'Bucket Name after assginment for loan Application form :: ',
        this.LOAN_APPLICATION_BUCKET_NAME,
      );

      // store to s3
      const isUploaded: boolean = await this.s3Client.pushObjecttoS3(
        this.LOAN_APPLICATION_BUCKET_NAME,
        localPath,
        destinationPath,
      );

      if (!isUploaded) {
        presenter.statusMsg =
          'System is busy, please retry the download after sometime or contact customer support.';
        return presenter;
      }

      // generate presignedURL
      const presignedURL: string = await this.s3Client.getObjectPresignedUrl(
        this.LOAN_APPLICATION_BUCKET_NAME,
        destinationPath,
      );

      formData.s3DocPath = destinationPath;
      formData.s3PresignedUrl = presignedURL;
      formData.s3UrlUpdatedAt = new Date();
      this.formDataRepository.create(formData);

      fs.unlinkSync(localPath);

      // create entry to requestOperations
      const requestOperation: IRequestOperation = new RequestOperation();
      requestOperation.opDate = new Date();
      requestOperation.opName = 'LOAN APPLICATION DOWNLOAD';
      requestOperation.opState = 'Success';
      requestOperation.custId = custId;
      requestOperation.remark = `Loan application download link sent to customer - ${presignedURL.toString()},  Destination Path - ${destinationPath}`;

      this.requestOperationRepository.save(requestOperation);

      // responsd back
      presenter.loanId = loanId;
      presenter.statementLink = presignedURL;
    }
    return presenter;
  }
}
