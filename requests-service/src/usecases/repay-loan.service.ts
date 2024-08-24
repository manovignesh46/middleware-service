import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { LoanRepaymentStatus } from '../domain/enum/loan-repayment-status.enum';
import { ResponseStatusCode } from '../domain/enum/responseStatusCode.enum';
import { ICustLoanRepaymentRecord } from '../domain/model/cust-loan-repayment-record.model';
import { ICustLoanRepaymentRecordRepository } from '../domain/repository/cust-loan-repayment-record.repository.interface';
import { ICustomerServiceClient } from '../domain/service/customer-service-client.service.interface';
import { IRepayLoanService } from '../domain/service/repay-loan.service.interface';
import { IRequestToLMSService } from '../domain/service/requestToLMSService.interface';
import { LMSRepayResponse } from '../infrastructure/controllers/requests/dtos/lmsRepayResponse.dto';
import { LoanRepayStatusDTO } from '../infrastructure/controllers/requests/dtos/loanRepayStatus.dto';
import { RepayLoanDto } from '../infrastructure/controllers/requests/dtos/repay-loan.dto';
import {
  LoanRepayStatusNotSuccess,
  LoanRepayStatusPresenter,
  LoanRepayStatusSuccess,
} from '../infrastructure/controllers/requests/presenters/loanRepayStatus.presenter';
import { RepayLoanPresenter } from '../infrastructure/controllers/requests/presenters/repay-loan.presenter';
import { RepayLoanUpdatePresenter } from '../infrastructure/controllers/requests/presenters/repayLoanUpdate.presenter';
import { CustLoanRepaymentRecord } from '../infrastructure/entities/cust-loan-repayment-record.entity';
import { IContentService } from '../domain/content.service.interface';
import { SendNotificationDto } from '../infrastructure/service/notification-service-client/dto/send-notification.dto';
import { SourceMicroservice } from '../infrastructure/service/notification-service-client/enum/source-microservice.enum';
import { TargetType } from '../infrastructure/service/notification-service-client/enum/target-type.enum';
import { NotificationServiceClient } from '../infrastructure/service/notification-service-client/notifications-service-client.service';

@Injectable()
export class RepayLoanService implements IRepayLoanService {
  private readonly logger = new Logger(RepayLoanService.name);

  constructor(
    private requestToLMSService: IRequestToLMSService,
    private customerServiceClient: ICustomerServiceClient,
    private custRepaymentRecordRepository: ICustLoanRepaymentRecordRepository,
    private notificationServiceClient: NotificationServiceClient,
    private contentService: IContentService,
  ) {}

  async repayLoanStatus(
    custId: string,
    loanRepayStatusDTO: LoanRepayStatusDTO,
  ): Promise<LoanRepayStatusPresenter> {
    const { requestId } = loanRepayStatusDTO;

    const custLoanRepayRecord: ICustLoanRepaymentRecord =
      await this.custRepaymentRecordRepository.getRepayRecord(requestId);

    if (custLoanRepayRecord) {
      if (
        custLoanRepayRecord.loanRepaymentStatus === LoanRepaymentStatus.SUCCESS
      ) {
        const presenter = new LoanRepayStatusSuccess();
        presenter.status = ResponseStatusCode.SUCCESS;
        presenter.amountPaid = custLoanRepayRecord.amountPaid;
        presenter.loanDueDate = custLoanRepayRecord.loanDueDate;
        presenter.outstandingBalance = custLoanRepayRecord.outstandingBalance;
        presenter.outstandingFee = custLoanRepayRecord.outstandingFee;
        presenter.outstandingInterest = custLoanRepayRecord.outstandingInterest;
        presenter.outstandingPrincipal =
          custLoanRepayRecord.outstandingPrincipal;
        presenter.paidDate = custLoanRepayRecord.paidDate;

        return presenter;
      } else if (
        custLoanRepayRecord.loanRepaymentStatus === LoanRepaymentStatus.PENDING
      ) {
        const presenter: LoanRepayStatusNotSuccess =
          new LoanRepayStatusNotSuccess();
        presenter.status = ResponseStatusCode.REPAYMENT_STATUS_PENDING;
        presenter.requestId = custLoanRepayRecord.id;
        presenter.transactionId = custLoanRepayRecord.transactionId;
        presenter.externalTransactionId =
          custLoanRepayRecord.externalTransactionId;
        presenter.referenceId = custLoanRepayRecord.referenceId;
        presenter.offerId = custLoanRepayRecord.offerId;

        return presenter;
      } else {
        const presenter: LoanRepayStatusNotSuccess =
          new LoanRepayStatusNotSuccess();
        if (
          custLoanRepayRecord.code === 6411 &&
          custLoanRepayRecord.message === 'TARGET_AUTHORIZATION_ERROR'
        ) {
          presenter.status = 6411;
        } else {
          presenter.status = ResponseStatusCode.REPAYMENT_STATUS_REJECTED;
        }
        presenter.requestId = custLoanRepayRecord.id;
        presenter.transactionId = custLoanRepayRecord.transactionId;
        presenter.externalTransactionId =
          custLoanRepayRecord.externalTransactionId;
        presenter.referenceId = custLoanRepayRecord.referenceId;
        presenter.statusReason = custLoanRepayRecord.statusReason;

        return presenter;
      }
    }

    const presenter = new LoanRepayStatusPresenter();
    presenter.status = ResponseStatusCode.REPAYMENT_STATUS_FAILURE;

    return presenter;
  }

  async repayLoanUpdate(
    repayLoanUpdate: LMSRepayResponse,
  ): Promise<RepayLoanUpdatePresenter> {
    this.logger.log('Reached repay loan update methodd');
    this.logger.log(repayLoanUpdate);
    const { code, data, status, message } = repayLoanUpdate;

    const presenter: RepayLoanUpdatePresenter = new RepayLoanUpdatePresenter();

    let custLoanRepayRecord: ICustLoanRepaymentRecord =
      await this.custRepaymentRecordRepository.getById(data.request_id);
    presenter.requestId = data.request_id;

    if (custLoanRepayRecord) {
      //2000 response - parse data values and store in DB
      if (code === 2000) {
        this.logger.log('Inside 2000 block');
        const {
          amount_paid,
          external_transaction_id,
          outstanding_balance,
          outstanding_fee,
          outstanding_interest,
          outstanding_principal,
          paid_date,
          reference_id,
          status_reason,
          transaction_id,
          yabx_txn_id,
          loan_due_date,
        } = data;

        let parsedStatus: LoanRepaymentStatus;
        switch (status?.toUpperCase()) {
          case 'SUCCESS':
            parsedStatus = LoanRepaymentStatus.SUCCESS;
            break;
          case 'FAILURE':
            parsedStatus = LoanRepaymentStatus.FAILED;
          default:
            parsedStatus = LoanRepaymentStatus.FAILED;
            break;
        }

        custLoanRepayRecord.transactionId = transaction_id;
        custLoanRepayRecord.externalTransactionId = external_transaction_id;
        custLoanRepayRecord.statusReason = status_reason;
        custLoanRepayRecord.loanRepaymentStatus = parsedStatus;
        custLoanRepayRecord.amountPaid = amount_paid;
        custLoanRepayRecord.paidDate = paid_date;
        custLoanRepayRecord.outstandingBalance = outstanding_balance;
        custLoanRepayRecord.outstandingPrincipal = outstanding_principal;
        custLoanRepayRecord.outstandingInterest = outstanding_interest;
        custLoanRepayRecord.outstandingFee = outstanding_fee;
        custLoanRepayRecord.referenceId = reference_id;
        custLoanRepayRecord.loanDueDate = loan_due_date
          ? moment(loan_due_date, 'YYYY-MM-DD', true).toDate()
          : null;
        custLoanRepayRecord.message = message;
        custLoanRepayRecord.status = status;
        custLoanRepayRecord.code = code;

        custLoanRepayRecord = await this.custRepaymentRecordRepository.save(
          custLoanRepayRecord,
        );
        presenter.status = 'SUCCESS';
      } else if (code === 6411) {
        custLoanRepayRecord.statusReason = data.status_reason;
        custLoanRepayRecord.message = message;
        custLoanRepayRecord.status = status;
        custLoanRepayRecord.code = code;

        custLoanRepayRecord = await this.custRepaymentRecordRepository.save(
          custLoanRepayRecord,
        );

        presenter.status = 'SUCCESS';
      }
    } else {
      presenter.status = 'FAILURE';
    }

    //Send Notification
    try {
      const {
        msisdnCountryCode,
        msisdn,
        platformApplicationEndpoint,
        preferredName,
      } = await this.customerServiceClient.getMsisdn(
        custLoanRepayRecord.customerId,
      );

      //get message content
      let message: string;
      let messageHeader: string;

      switch (code) {
        case 2000:
          ({ message, messageHeader } =
            await this.contentService.getRepayUpdatedSuccessMessage(
              preferredName,
              repayLoanUpdate.data.reference_id?.toString(),
              presenter.status,
            ));
          break;
        case 6411:
          ({ message, messageHeader } =
            await this.contentService.getRepayUpdatedInsufficientFundsMessage(
              preferredName,
              repayLoanUpdate.data.reference_id?.toString(),
              presenter.status,
            ));
        default:
          ({ message, messageHeader } =
            await this.contentService.getRepayUpdatedFailedMessage(
              preferredName,
              repayLoanUpdate.data.reference_id?.toString(),
              presenter.status,
            ));
          break;
      }

      //send push notification
      if (platformApplicationEndpoint) {
        const sendPushDto: SendNotificationDto = {
          target: platformApplicationEndpoint,
          targetType: TargetType.ENDPOINT_ARN,
          messageHeader,
          message,
          customerId: custLoanRepayRecord.customerId,
          sourceMicroservice: SourceMicroservice.REQUESTS,
          priority: 9,
        };
        this.notificationServiceClient.sendNotification(sendPushDto);
      }
    } catch (e) {
      this.logger.error(e);
    }

    return presenter;
  }

  async repayLoan(
    customerId: string,
    fullMsisdn: string, //Cognito provided full MSISDN. May not be updated.
    repayLoanDto: RepayLoanDto,
  ): Promise<RepayLoanPresenter> {
    this.logger.log(this.repayLoan.name);

    //Get msisdn from customer service
    const { msisdnCountryCode, msisdn } =
      await this.customerServiceClient.getMsisdn(customerId);

    const fullPhoneNumber = msisdnCountryCode + msisdn;

    /* Todo product type should be mapped in middleware to the offer / variant type
    middleware needs to make a DB query to get the product type from offer id */
    const productType = 'Installment';
    const externalReceiptId =
      fullPhoneNumber + '_external_receipt_id_' + Date.now().toString();

    //save repayment request to DB
    let custRepaymentRecord: ICustLoanRepaymentRecord =
      new CustLoanRepaymentRecord();
    custRepaymentRecord.customerId = customerId;
    custRepaymentRecord.loanAccountNumber = repayLoanDto.loanAccountNumber;
    custRepaymentRecord.loanRepaymentAmount = repayLoanDto.paymentAmount;
    custRepaymentRecord.loanRepaymentMode = repayLoanDto.paymentMethod;
    custRepaymentRecord.loanRepaymentType = repayLoanDto.paymentType;
    custRepaymentRecord.offerId = repayLoanDto.offerId;
    custRepaymentRecord.loanRepaymentStatus = LoanRepaymentStatus.PENDING;

    custRepaymentRecord = await this.custRepaymentRecordRepository.save(
      custRepaymentRecord,
    );

    //Send Repay Loan Request
    let repayLoanLOSResponse: LMSRepayResponse;
    try {
      repayLoanLOSResponse = await this.requestToLMSService.repayLoan(
        custRepaymentRecord.id,
        customerId,
        fullPhoneNumber,
        productType,
        repayLoanDto.paymentAmount,
        repayLoanDto.loanAccountNumber,
        repayLoanDto.offerId,
        externalReceiptId,
      );
      this.logger.debug(repayLoanLOSResponse);

      const { code, data, message, status } = repayLoanLOSResponse;

      custRepaymentRecord.loanRepaymentStatus =
        repayLoanLOSResponse.status?.toUpperCase() ===
          LoanRepaymentStatus.FAILED || !repayLoanLOSResponse.status
          ? LoanRepaymentStatus.FAILED
          : repayLoanLOSResponse.status?.toUpperCase() ===
            LoanRepaymentStatus.PENDING
          ? LoanRepaymentStatus.PENDING
          : LoanRepaymentStatus.SUCCESS;

      if (code === 2000) {
        //Update Loan Repayment Status in DB
        custRepaymentRecord.loanRepaymentResponse =
          JSON.stringify(repayLoanLOSResponse);
        custRepaymentRecord.transactionId =
          repayLoanLOSResponse?.data?.transaction_id?.toString();
        custRepaymentRecord.statusReason =
          repayLoanLOSResponse?.data?.status_reason;
        custRepaymentRecord.referenceId =
          repayLoanLOSResponse?.data?.reference_id?.toString();
      }
      custRepaymentRecord = await this.custRepaymentRecordRepository.update(
        custRepaymentRecord,
      );

      let responseCode = code;
      if (code === 6411 && message !== 'TARGET_AUTHORIZATION_ERROR') {
        responseCode = 6602;
      }

      const repayLoanPresenter: RepayLoanPresenter = new RepayLoanPresenter(
        custRepaymentRecord.id,
        custRepaymentRecord?.transactionId,
        custRepaymentRecord.externalTransactionId,
        custRepaymentRecord.referenceId,
        custRepaymentRecord.offerId,
        responseCode || 500, //losStatusCode defaults to 500 in case LOS returns null in code property
      );

      return repayLoanPresenter;
    } catch (e) {
      this.logger.log(e.stack);
      custRepaymentRecord.loanRepaymentStatus = LoanRepaymentStatus.FAILED;
      this.custRepaymentRecordRepository.update(custRepaymentRecord);
      throw e;
    }
  }
}
