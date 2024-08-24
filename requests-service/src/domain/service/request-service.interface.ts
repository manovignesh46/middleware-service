import { ApplyLoansDTO } from '../../infrastructure/controllers/requests/dtos/applyLoans.dto';
import { LoanCalculatorDTO } from '../../infrastructure/controllers/requests/dtos/loanCalculator.dto';
import { SubmitLoansDTO } from '../../infrastructure/controllers/requests/dtos/submitLoans.dto';
import { ApplyLoansPresenter } from '../../infrastructure/controllers/requests/presenters/apply-loans.presenter';
import { FAQPresenter } from '../../infrastructure/controllers/requests/presenters/faq.presenter';
import { LoanCalculatorPresenter } from '../../infrastructure/controllers/requests/presenters/loanCalculator.presenter';
import { LoanDetailsStatementPresenter } from '../../infrastructure/controllers/requests/presenters/loanDetailStatement.presenter';
import { DownloadPresenter } from '../../infrastructure/controllers/requests/presenters/download.presenter';
import { LoanStatementPresenter } from '../../infrastructure/controllers/requests/presenters/loanStatement.presenter';
import { SubmitLoansPresenter } from '../../infrastructure/controllers/requests/presenters/submit-loans.presenter';

export abstract class IRequestService {
  abstract applyLoans(
    custId: string,
    applyLoansDTO: ApplyLoansDTO,
  ): Promise<ApplyLoansPresenter>;

  abstract submitLoans(
    custId: string,
    submitLoansDTO: SubmitLoansDTO,
  ): Promise<SubmitLoansPresenter>;

  abstract loanStatements(
    custId: string,
    optId: string,
  ): Promise<LoanStatementPresenter>;

  abstract loanCalculator(
    custId: string,
    loanCalculatorDTO: LoanCalculatorDTO,
  ): Promise<LoanCalculatorPresenter>;

  abstract cancelWorkflow(custId: string): Promise<boolean>;
  abstract loanDetailsStatement(
    custId: string,
    typeId: string,
    loanId: string,
  ): Promise<LoanDetailsStatementPresenter>;

  abstract downloadLoanStatements(
    custId: string,
    typeId: string,
    loanId: string,
  ): Promise<DownloadPresenter>;

  abstract downloadLoanApplication(
    custId: string,
    typeId: string,
    loanId: string,
  ): Promise<DownloadPresenter>;

  abstract terminateOngoingLoan(custId: string): Promise<boolean>;

  abstract getAllFAQs(): Promise<FAQPresenter>;
}
