import { LMSLoanCalculatorRespDTO } from '../../infrastructure/controllers/requests/dtos/LMSLoanCalculatorResp.dto';
import { LMSFormData } from '../../infrastructure/controllers/requests/dtos/lmsFormData.dto';
import { LoanCalculatorDTO } from '../../infrastructure/controllers/requests/dtos/loanCalculator.dto';
import { LoanDetailsStatementPresenter } from '../../infrastructure/controllers/requests/presenters/loanDetailStatement.presenter';
import { LoanStatementPresenter } from '../../infrastructure/controllers/requests/presenters/loanStatement.presenter';

export abstract class IRequestToLMSService {
  abstract getloanStatement(
    optId: string,
    fullMsisdn: string,
    custId: string,
  ): Promise<LoanStatementPresenter>;
  abstract repayLoan(
    requestId: string,
    customerId: string,
    fullMsisdn: string,
    productType: string,
    amount: number,
    instrumentId: string,
    variantId: string,
    externalReceiptId?: string,
  ): Promise<any>;

  abstract loanCalculator(
    fullMsisdn: string,
    loanCalculatorDTO: LoanCalculatorDTO,
  ): Promise<LMSLoanCalculatorRespDTO>;

  abstract loanStatementDetails(
    fullMsisdn: string,
    typeId: string,
    loanId: string,
    custId: string,
  ): Promise<LoanDetailsStatementPresenter>;

  abstract applicationFormData(
    loanId: string,
    fullMsisdn: string,
  ): Promise<LMSFormData>;
}
