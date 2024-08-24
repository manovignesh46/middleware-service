import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IContentService } from '../../domain/content.service.interface';
import { IContentRepository } from '../../domain/repository/content-repository.interface';
import {
  GetLoanApplicationContentInputDto,
  GetLoanApplicationContentOutputDto,
} from './service-dtos/get-loan-application-content.dto';

@Injectable()
export class ContentService implements IContentService {
  private VARIANT_MIN_LOAN_AMOUNT;
  private VARIANT_MAX_LOAN_AMOUNT;
  private LATE_PAYMENT_PERCENT;
  private MISSED_REPAYMENT_PERCENT;
  private RESPONSE_TIME_SLA;
  private TERMS_AND_CONDITION;
  constructor(
    private readonly contentRepository: IContentRepository,
    private configService: ConfigService,
  ) {
    this.VARIANT_MIN_LOAN_AMOUNT = this.configService.get<string>(
      'VARIANT_MIN_LOAN_AMOUNT',
    );
    this.VARIANT_MAX_LOAN_AMOUNT = this.configService.get<string>(
      'VARIANT_MAX_LOAN_AMOUNT',
    );
    this.LATE_PAYMENT_PERCENT = this.configService.get<string>(
      'LATE_PAYMENT_PERCENT',
    );
    this.MISSED_REPAYMENT_PERCENT = this.configService.get<string>(
      'MISSED_REPAYMENT_PERCENT',
    );

    this.TERMS_AND_CONDITION = this.configService.get<string>(
      'TERMS_AND_CONDITION',
    );
    this.RESPONSE_TIME_SLA =
      this.configService.get<string>('RESPONSE_TIME_SLA');
  }

  async getRepayUpdatedSuccessMessage(
    preferredName: string,
    loanId: string,
    status: string,
  ) {
    let content;
    content = await this.contentRepository.findByContentName(
      'REPAY_LOAN_UPDATE_SUCCESS',
    );
    if (!content) {
      content = {
        messageHeader: 'Loan Repayment',
        message:
          'Dear ${preferredName}, your payment towards your Furaha School Fee loan has been received. Login to the Furaha App for more details.',
      };
    }

    return {
      messageHeader: content.messageHeader,
      message: content.message
        .replace('${preferredName}', preferredName)
        .replace('${loanId}', loanId)
        .replace('${status}', status),
    };
  }

  async getRepayUpdatedInsufficientFundsMessage(
    preferredName: string,
    loanId: string,
    status: string,
  ) {
    let content;
    content = await this.contentRepository.findByContentName(
      'REPAY_LOAN_UPDATE_INSUFFICIENT_FUNDS',
    );
    if (!content) {
      content = {
        messageHeader: 'Loan Repayment',
        message:
          'Dear ${preferredName}, your repayment request could not be completed due to insufficient funds. Please top up your mobile wallet and retry.',
      };
    }

    return {
      messageHeader: content.messageHeader,
      message: content.message
        .replace('${preferredName}', preferredName)
        .replace('${loanId}', loanId)
        .replace('${status}', status),
    };
  }
  async getRepayUpdatedFailedMessage(
    preferredName: string,
    loanId: string,
    status: string,
  ) {
    let content;
    content = await this.contentRepository.findByContentName(
      'REPAY_LOAN_UPDATE_INSUFFICIENT_FUNDS',
    );
    if (!content) {
      content = {
        messageHeader: 'Loan Repayment',
        message:
          'Dear ${preferredName}, your repayment request could not be completed now. Please retry after sometime.',
      };
    }

    return {
      messageHeader: content.messageHeader,
      message: content.message
        .replace('${preferredName}', preferredName)
        .replace('${loanId}', loanId)
        .replace('${status}', status),
    };
  }
  async getLoanTerminatedMessage(
    preferredName: string,
    loanAmount: number,
    interestRate: string,
  ): Promise<{ message: string; messageHeader: string }> {
    const message = await this.contentRepository.findByContentName(
      'LOAN_TERMINATED_BY_CUSTOMER',
    );

    return {
      message: message.message
        .replace('${preferredName}', preferredName)
        .replace('${loanAmount}', 'UGX ' + loanAmount?.toLocaleString())
        .replace('${interestRate}', interestRate),
      messageHeader: message.messageHeader,
    };
  }

  async getSubmitLoanSuccessMsg(
    preferredName: string,
  ): Promise<{ message: string; messageHeader: string }> {
    const message = await this.contentRepository.findByContentName(
      'LOAN_SUBMITTED',
    );
    return {
      message: message.message.replace(
        '${preferredName}',
        preferredName || 'User',
      ),
      messageHeader: message.messageHeader,
    };
  }

  async getLoanApplicationFormData(
    getLoanApplicationContentDto?: GetLoanApplicationContentInputDto,
  ): Promise<GetLoanApplicationContentOutputDto> {
    const {
      variantMinLoanAmount,
      variantMaxLoanAmount,
      latePaymentPercent,
      missedRepaymentPercent,
      responseTimeSla,
    } = getLoanApplicationContentDto || {};

    const aimAndBenefitsEntity = await this.contentRepository.findByContentName(
      'AIM_AND_BENEFITS_OF_PRODUCT',
    );
    const aimAndBenefits = aimAndBenefitsEntity.message
      .replace(
        '${VARIANT_MIN_LOAN_AMOUNT}',
        variantMinLoanAmount || this.VARIANT_MIN_LOAN_AMOUNT,
      )
      .replace(
        '${VARIANT_MAX_LOAN_AMOUNT}',
        variantMaxLoanAmount || this.VARIANT_MAX_LOAN_AMOUNT,
      )
      .replace(
        '${LATE_PAYMENT_PERCENT}',
        latePaymentPercent || this.LATE_PAYMENT_PERCENT,
      );
    const aimAndBenefitsLine1 = aimAndBenefits.split('||')[0];
    const aimAndBenefitsLine2 = aimAndBenefits.split('||')[1];

    const noteEntity = await this.contentRepository.findByContentName('NOTE');
    const note = noteEntity.message.replace(
      '${MISSED_REPAYMENT_PERCENT}',
      missedRepaymentPercent || this.MISSED_REPAYMENT_PERCENT,
    );
    const note1 = note.split('||')[0];
    const note2 = note.split('||')[1];

    const declarationEntity = await this.contentRepository.findByContentName(
      'DECLARATION',
    );
    const declaration = declarationEntity.message.replace(
      '${RESPONSE_TIME_SLA}',
      responseTimeSla || this.RESPONSE_TIME_SLA,
    );

    const declaration1 = declaration.split('||')[0];
    const declaration1_1 = declaration1.split('${break}')[0];
    const declaration1_2 = this.TERMS_AND_CONDITION;
    const declaration1_3 = declaration1.split('${break}')[1];
    const declaration1_4 = declaration1.split('${break}')[2];
    const declaration1_5 = declaration1.split('${break}')[3];
    const declaration1_6 = declaration1.split('${break}')[4];
    const declaration1_7 = declaration1.split('${break}')[5];

    const declaration2 = declaration.split('||')[1];
    return {
      aimAndBenefitsLine1,
      aimAndBenefitsLine2,
      note1,
      note2,
      declaration1_1,
      declaration1_2,
      declaration1_3,
      declaration1_4,
      declaration1_5,
      declaration1_6,
      declaration1_7,
      declaration2,
    };
  }
}
