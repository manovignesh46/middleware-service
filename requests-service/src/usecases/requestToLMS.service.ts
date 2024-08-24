import { Injectable, Logger } from '@nestjs/common';
import { IRequestToLMSService } from '../domain/service/requestToLMSService.interface';
import { ILMSService } from '../domain/service/lmsService.interface';
import {
  LoanStatementPresenter,
  getLoansDetails,
} from '../infrastructure/controllers/requests/presenters/loanStatement.presenter';
import { LoansLMSDTO } from '../infrastructure/controllers/requests/dtos/openLoans.dto';
import { LOSRepayLoanDto } from '../infrastructure/controllers/requests/dtos/repay-loan.dto';
import { LoanCalculatorDTO } from '../infrastructure/controllers/requests/dtos/loanCalculator.dto';
import { LMSLoanCalculatorDTO } from '../infrastructure/controllers/requests/dtos/LMSLoanCalculator.dto';
import {
  LoanDetailsStatementPresenter,
  typeConversion,
} from '../infrastructure/controllers/requests/presenters/loanDetailStatement.presenter';
import { ApplicationStatus } from '../domain/enum/application-status.enum';
import { IRequestToLOSRepository } from '../domain/repository/request-to-los.repository.interface';
import { IRequestToLOS } from '../domain/model/request-to-los.interface';
import { LMSFormData } from '../infrastructure/controllers/requests/dtos/lmsFormData.dto';

@Injectable()
export class RequestToLMSService implements IRequestToLMSService {
  constructor(
    private readonly lmsService: ILMSService,
    private requestToLosRepository: IRequestToLOSRepository,
  ) {}

  private logger = new Logger(RequestToLMSService.name);

  async applicationFormData(
    loanId: string,
    fullMsisdn: string,
  ): Promise<LMSFormData> {
    this.logger.log(this.applicationFormData.name);

    const payload = {
      msisdn: fullMsisdn,
      product_type: 'Installment',
    };

    return await this.lmsService.applicationFormData(loanId, payload);
  }

  async loanStatementDetails(
    fullMsisdn: string,
    typeId: string,
    loanId: string,
    custId: string,
  ): Promise<LoanDetailsStatementPresenter> {
    this.logger.log(this.loanStatementDetails.name);
    const loanStatementDetails: LoanDetailsStatementPresenter =
      await this.lmsService.loanDetailStatement(fullMsisdn, loanId);

    const requestToLos: IRequestToLOS = {
      customerId: custId,
      applicationStatus: ApplicationStatus.LOAN_STATEMENT_DETAILS,
      dataToCRM: fullMsisdn,
      respFromCRM: loanStatementDetails,
    } as any as IRequestToLOS;
    this.requestToLosRepository.create(requestToLos);

    return typeConversion(loanStatementDetails);
  }

  async loanCalculator(
    fullMsisdn: string,
    loanCalculatorDTO: LoanCalculatorDTO,
  ): Promise<any> {
    this.logger.log(this.loanCalculator.name);

    const losLoanCalculatorDTO: LMSLoanCalculatorDTO =
      new LMSLoanCalculatorDTO();
    losLoanCalculatorDTO.msisdn = fullMsisdn;
    losLoanCalculatorDTO.product_type = 'Installment';
    losLoanCalculatorDTO.requested_amount =
      loanCalculatorDTO.requiredLoanAmount;
    losLoanCalculatorDTO.variant_id = loanCalculatorDTO.offerId;
    losLoanCalculatorDTO.loan_tenure = loanCalculatorDTO.tenureMonths;
    losLoanCalculatorDTO.repayment_frequency =
      loanCalculatorDTO.repaymentFrequency;
    losLoanCalculatorDTO.preferred_payment_day = loanCalculatorDTO.preferredDay;

    return await this.lmsService.loanCalculator(losLoanCalculatorDTO);
  }

  async getloanStatement(
    optId: string,
    fullMsisdn: string,
    custId: string,
  ): Promise<LoanStatementPresenter> {
    this.logger.log(this.getloanStatement.name);
    const responseData: any = await this.lmsService.dashboard(
      'Installment',
      fullMsisdn,
    );

    const requestToLos: IRequestToLOS = {
      customerId: custId,
      applicationStatus: ApplicationStatus.GET_LOAN_LIST,
      dataToCRM: fullMsisdn,
      respFromCRM: responseData,
    } as any as IRequestToLOS;
    this.requestToLosRepository.create(requestToLos);

    const presenter: LoanStatementPresenter = new LoanStatementPresenter();

    if (optId === '1') {
      const openLoans: LoansLMSDTO[] = responseData['open_loans'];
      console.log(openLoans);
      if (openLoans == null || openLoans.length === 0) {
        return null;
      }
      presenter.activeLoans = await getLoansDetails(openLoans, true);
    } else if (optId === '2') {
      const closedLoans: LoansLMSDTO[] = responseData['closed_loans'];
      console.log(closedLoans);
      if (closedLoans == null || closedLoans.length === 0) {
        return null;
      }
      presenter.closedLoans = await getLoansDetails(closedLoans, false);
    }

    return presenter;
  }

  async repayLoan(
    requestId: string,
    customerId: string,
    fullMsisdn: string,
    productType: string,
    amount: number,
    instrumentId: string,
    variantId: string,
    externalReceiptId?: string,
  ) {
    this.logger.log(this.repayLoan.name);

    //construct request body for LOS Repay Loan API
    const inputDto = new LOSRepayLoanDto();
    inputDto.request_id = requestId;
    inputDto.msisdn = fullMsisdn;
    inputDto.product_type = productType;
    inputDto.amount = amount;
    inputDto.instrument_id = instrumentId;
    inputDto.variant_id = variantId;
    inputDto.external_receipt_id =
      externalReceiptId ||
      fullMsisdn + '_external_receipt_id_' + Date.now().toString();

    const response = await this.lmsService.repayLoan(inputDto);

    const requestToLos: IRequestToLOS = {
      customerId: customerId,
      applicationStatus: ApplicationStatus.REPAY_LOAN,
      dataToCRM: inputDto,
      respFromCRM: response,
    } as any as IRequestToLOS;

    this.requestToLosRepository.create(requestToLos);

    return response;
  }
}
