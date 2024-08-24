import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiBodyWithJWTBearerToken } from '../../../decorators/api-body-with-jwt.decorator';
import { JWTClaim } from '../../../decorators/jwt-claim.decorator';
import { User } from '../../../decorators/request-user.decorator';
import { StatusMessageWrapper } from '../../../decorators/status-message-wrapper';
import { ResponseMessage } from '../../../domain/enum/response-status-message.enum';
import { ResponseStatusCode } from '../../../domain/enum/responseStatusCode.enum';
import { IRepayLoanService } from '../../../domain/service/repay-loan.service.interface';
import { IRequestService } from '../../../domain/service/request-service.interface';
import { IpBlacklistingInterceptor } from '../../../interceptors/ip-blacklisting.interceptor';
import {
  PolicyDOCData,
  PolicyDocsService,
} from '../../../usecases/policy-docs.service';
import { ApplyLoansDTO } from './dtos/applyLoans.dto';
import { LoanCalculatorDTO } from './dtos/loanCalculator.dto';
import { RepayLoanDto } from './dtos/repay-loan.dto';
import { SubmitLoansDTO } from './dtos/submitLoans.dto';
import { ApplyLoansPresenter } from './presenters/apply-loans.presenter';
import { DownloadPresenter } from './presenters/download.presenter';
import { FAQPresenter } from './presenters/faq.presenter';
import { LoanCalculatorPresenter } from './presenters/loanCalculator.presenter';
import { LoanDetailsStatementPresenter } from './presenters/loanDetailStatement.presenter';
import { LoanStatementPresenter } from './presenters/loanStatement.presenter';
import { RepayLoanPresenter } from './presenters/repay-loan.presenter';
import { StatusMessagePresenter } from './presenters/statusMessage.presenter';
import { SubmitLoansPresenter } from './presenters/submit-loans.presenter';
import { LMSRepayResponse } from './dtos/lmsRepayResponse.dto';
import { RepayLoanUpdatePresenter } from './presenters/repayLoanUpdate.presenter';
import { LoanRepayStatusDTO } from './dtos/loanRepayStatus.dto';
import { LoanRepayStatusPresenter } from './presenters/loanRepayStatus.presenter';
import { stat } from 'fs';

@Controller('/v1/requests')
export class RequestsController {
  constructor(
    private repayLoanService: IRepayLoanService,
    private readonly requestService: IRequestService,
    private readonly policyDocsService: PolicyDocsService,
  ) {}

  private readonly logger = new Logger(RequestsController.name);

  @Post('loans/apply')
  @ApiTags('Loan Application')
  @ApiBodyWithJWTBearerToken({ type: ApplyLoansDTO })
  @StatusMessageWrapper(
    ApplyLoansPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUCCESS,
  )
  async applyLoans(
    @User() custId: string,
    @Body() applyLoansDTO: ApplyLoansDTO,
  ) {
    const presenter: ApplyLoansPresenter = await this.requestService.applyLoans(
      custId,
      applyLoansDTO,
    );

    return new StatusMessagePresenter(
      ResponseStatusCode.SUCCESS,
      ResponseMessage.SUCCESS,
      presenter,
    );
  }

  @Post('loans/submit')
  @ApiTags('Loan Application')
  @ApiBodyWithJWTBearerToken({ type: SubmitLoansDTO })
  @StatusMessageWrapper(
    SubmitLoansPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUBMIT_SUCCESS,
  )
  async submitLoans(
    @User() custId: string,
    @Body() submitLoansDTO: SubmitLoansDTO,
  ) {
    const presenter: SubmitLoansPresenter =
      await this.requestService.submitLoans(custId, submitLoansDTO);
    if (presenter) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.SUBMIT_SUCCESS,
        presenter,
      );
    }
    return new StatusMessagePresenter(
      ResponseStatusCode.SUBMIT_FAILURE,
      ResponseMessage.SUBMIT_FAILURE,
      presenter,
    );
  }

  @Post('loans/repay')
  @UseInterceptors(IpBlacklistingInterceptor)
  @ApiTags('Loan Application')
  @ApiBodyWithJWTBearerToken({ type: RepayLoanDto })
  @StatusMessageWrapper(
    RepayLoanPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.REPAYMENT_SUCCESS_PENDING,
  )
  async repayLoan(
    @User() user: string,
    @JWTClaim('phone_number') fullMsisdn: string,
    @Body() repayLoanDto: RepayLoanDto,
  ) {
    this.logger.log(this.repayLoan.name);
    this.logger.log(`repaying loan for customer: ${user}`);
    let presenter: RepayLoanPresenter;
    try {
      presenter = await this.repayLoanService.repayLoan(
        user,
        fullMsisdn,
        repayLoanDto,
      );
    } catch (err) {
      this.logger.error(err.stack);
      throw err;
    }

    let status = presenter.losStatusCode;
    presenter.losStatusCode = undefined; // Don't send losStatusCode in responseBody
    let message: string;
    if (status == 2000) {
      message = ResponseMessage.REPAYMENT_SUCCESS_PENDING;
    } else if (status == 6601) {
      message = ResponseMessage.REPAYMENT_FAILURE_PREVIOUS_PAYMENT_PENDING;
    } else if (status === 6602) {
      status = 6411;
      message = ResponseMessage.REPAYMENT_FAILURE_GENERIC;
    } else if (status === 6411) {
      message = ResponseMessage.REPAYMENT_FAILURE;
    }
    return new StatusMessagePresenter(status, message, presenter);
  }

  @Post('loans/repay/update')
  @ApiTags('Loan Application')
  @ApiBody({ type: LMSRepayResponse })
  @StatusMessageWrapper(
    RepayLoanUpdatePresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.REPAYMENT_UPDATE_SUCCESS,
  )
  async repayLoanUpdate(@Body() repayLoanUpdate: LMSRepayResponse) {
    const presenter: RepayLoanUpdatePresenter =
      await this.repayLoanService.repayLoanUpdate(repayLoanUpdate);
    let status: number;
    let message: string;
    if (presenter.status == 'SUCCESS') {
      status = ResponseStatusCode.SUCCESS;
      message = ResponseMessage.REPAYMENT_UPDATE_SUCCESS;
    } else if (presenter.status === 'FAILURE') {
      status = ResponseStatusCode.FAIL;
      message = ResponseMessage.REPAYMENT_UPDATE_FAILURE;
    }
    return new StatusMessagePresenter(status, message, presenter);
  }

  @Post('loans/repay/status')
  @ApiTags('Loan Application')
  @ApiBodyWithJWTBearerToken({ type: LoanRepayStatusDTO })
  @StatusMessageWrapper(
    LoanRepayStatusPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.REPAYMENT_STATUS_SUCCESS,
  )
  async repayLoanStatus(
    @User() custId: string,
    @Body() loanRepayStatusDTO: LoanRepayStatusDTO,
  ) {
    let presenter: LoanRepayStatusPresenter =
      await this.repayLoanService.repayLoanStatus(custId, loanRepayStatusDTO);

    let status;
    let message;
    if (presenter.status === ResponseStatusCode.SUCCESS) {
      presenter.status = null;

      status = ResponseStatusCode.SUCCESS;
      message = ResponseMessage.REPAYMENT_STATUS_SUCCESS;
    } else if (
      presenter.status === ResponseStatusCode.REPAYMENT_STATUS_PENDING
    ) {
      status = ResponseStatusCode.REPAYMENT_STATUS_PENDING;
      message = ResponseMessage.REPAYMENT_STATUS_PENDING;
    } else if (
      presenter.status === ResponseStatusCode.REPAYMENT_STATUS_REJECTED ||
      presenter.status === 6411
    ) {
      if (presenter.status === 6411) {
        status = ResponseStatusCode.REPAYMENT_STATUS_REJECTED;
        message = ResponseMessage.REPAYMENT_FAILURE;
      }
      status = ResponseStatusCode.REPAYMENT_STATUS_REJECTED;
      message = ResponseMessage.REPAYMENT_FAILURE_GENERIC;
    } else {
      status = ResponseStatusCode.REPAYMENT_STATUS_FAILURE;
      message = ResponseMessage.REPAYMENT_STATUS_FAILURE;
      presenter = null;
    }

    if (presenter) {
      presenter.status = undefined;
    }
    return new StatusMessagePresenter(status, message, presenter);
  }

  @Get('loans/statements')
  @ApiTags('Statements / Forms')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    LoanStatementPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.ACTIVE_LOANS_SUCCESS,
  )
  async loansStatements(@User() custId: string, @Query('optId') optId: string) {
    const presenter: LoanStatementPresenter =
      await this.requestService.loanStatements(custId, optId);
    let status = ResponseStatusCode.SUCCESS;
    let message = ResponseMessage.ACTIVE_LOANS_SUCCESS;
    if (optId === '1' && presenter == null) {
      status = ResponseStatusCode.NO_ACTIVE_LOANS;
      message = ResponseMessage.NO_ACTIVE_LOANS;
    }
    return new StatusMessagePresenter(status, message, presenter);
  }

  @Post('loan/calculate')
  @ApiTags('Loan Application')
  @ApiBodyWithJWTBearerToken({ type: LoanCalculatorDTO })
  @StatusMessageWrapper(
    LoanCalculatorPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUCCESS,
  )
  async loanCalculator(
    @User() custId: string,
    @Body() loanCalculatorDTO: LoanCalculatorDTO,
  ) {
    const presenter: LoanCalculatorPresenter =
      await this.requestService.loanCalculator(custId, loanCalculatorDTO);
    const status = ResponseStatusCode.SUCCESS;
    const message = ResponseMessage.SUCCESS;
    return new StatusMessagePresenter(status, message, presenter);
  }

  @Get('cancel/workflow/:custId')
  @ApiTags('Loan Application')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    Boolean,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUCCESS,
  )
  async cancelWorkflow(@Param('custId') custId: string) {
    const data = await this.requestService.cancelWorkflow(custId);
    if (data) {
      const status = ResponseStatusCode.SUCCESS;
      const message = ResponseMessage.SUCCESS;
      return new StatusMessagePresenter(status, message, true);
    } else {
      return new StatusMessagePresenter(
        ResponseStatusCode.FAIL,
        ResponseMessage.TERMINATE_LOAN_FAILURE,
      );
    }
  }

  @Get('loan/statement/:typeId/:loanId')
  @ApiTags('Statements / Forms')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    LoanDetailsStatementPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUCCESS,
  )
  async loanDetailStatement(
    @User() custId: string,
    @Param('typeId') typeId: string,
    @Param('loanId') loanId: string,
  ) {
    const presenter: LoanDetailsStatementPresenter =
      await this.requestService.loanDetailsStatement(custId, typeId, loanId);
    const status = ResponseStatusCode.SUCCESS;
    const message = ResponseMessage.SUCCESS;
    return new StatusMessagePresenter(status, message, presenter);
  }

  @Get('loan/download/:typeId/:loanId')
  @ApiTags('Statements / Forms')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    DownloadPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.GENERATE_PDF_SUCCESS,
  )
  async downloadStatement(
    @User() custId: string,
    @Param('typeId') typeId: string,
    @Param('loanId') loanId: string,
  ) {
    let presenter: DownloadPresenter =
      await this.requestService.downloadLoanStatements(custId, typeId, loanId);

    let status = ResponseStatusCode.SUCCESS;
    let message: string = ResponseMessage.GENERATE_PDF_SUCCESS;
    if (!presenter || presenter?.statusMsg) {
      status = ResponseStatusCode.NO_STATEMENT_DOWNLOAD;
      message = presenter?.statusMsg || ResponseMessage.ERROR_GENERATING_PDF;
      presenter = undefined;
    }
    return new StatusMessagePresenter(status, message, presenter);
  }

  @Delete('loan/terminate')
  @ApiTags('Loan Application')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    Boolean,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.LOAN_TERMINATED,
  )
  async terminateOngoingLoan(@User() custId: string) {
    const resp: boolean = await this.requestService.terminateOngoingLoan(
      custId,
    );
    const status = ResponseStatusCode.SUCCESS;
    const message = ResponseMessage.LOAN_TERMINATED;
    return new StatusMessagePresenter(status, message, resp);
  }

  @Get('policy/faqs')
  @ApiTags('Policy Documents')
  @StatusMessageWrapper(
    FAQPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.FAQ_SUCCESS,
  )
  async faqs() {
    const resp: FAQPresenter = await this.requestService.getAllFAQs();
    const status = ResponseStatusCode.SUCCESS;
    const message = ResponseMessage.FAQ_SUCCESS;

    return new StatusMessagePresenter(status, message, resp.faqs);
  }

  @Get('/policy/docs')
  @ApiTags('Policy Documents')
  @StatusMessageWrapper(
    PolicyDOCData,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUCCESS,
  )
  async getPolicyDocs() {
    const data: PolicyDOCData = await this.policyDocsService.getPolicyDocs();
    if (
      !data?.termsAndConditions?.url &&
      !data?.privacyPolicy?.url &&
      !data?.aboutFuraha?.url
    ) {
      return new StatusMessagePresenter(
        ResponseStatusCode.NO_POLICY_DOCS,
        ResponseMessage.NO_POLICY_DOCS,
      );
    }
    if (
      !data?.termsAndConditions?.url ||
      !data?.privacyPolicy?.url ||
      !data?.aboutFuraha?.url
    ) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SOME_POLICY_DOCS,
        ResponseMessage.SOME_POLICY_DOCS,
        data,
      );
    }
    return new StatusMessagePresenter(
      ResponseStatusCode.SUCCESS,
      ResponseMessage.SUCCESS,
      data,
    );
  }

  @Get('loan/download/application/:typeId/:loanId')
  @ApiTags('Statements / Forms')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    DownloadPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.LOAN_APPLICATION_PDF_SUCCESS,
  )
  async downloadApplication(
    @User() custId: string,
    @Param('typeId') typeId: string,
    @Param('loanId') loanId: string,
  ) {
    let presenter: DownloadPresenter =
      await this.requestService.downloadLoanApplication(custId, typeId, loanId);

    let status = 2000;
    let message: string = ResponseMessage.LOAN_APPLICATION_PDF_SUCCESS;
    if (presenter.statusMsg) {
      status = ResponseStatusCode.NO_STATEMENT_DOWNLOAD;
      message = presenter.statusMsg;
      presenter = null;
    } else {
      presenter.statusMsg = undefined;
    }
    return new StatusMessagePresenter(status, message, presenter);
  }
}
