import { promises } from 'dns';
import { LMSRepayResponse } from '../../infrastructure/controllers/requests/dtos/lmsRepayResponse.dto';
import { LoanRepayStatusDTO } from '../../infrastructure/controllers/requests/dtos/loanRepayStatus.dto';
import { RepayLoanDto } from '../../infrastructure/controllers/requests/dtos/repay-loan.dto';
import { RepayLoanPresenter } from '../../infrastructure/controllers/requests/presenters/repay-loan.presenter';
import { RepayLoanUpdatePresenter } from '../../infrastructure/controllers/requests/presenters/repayLoanUpdate.presenter';
import { LoanRepayStatusPresenter } from '../../infrastructure/controllers/requests/presenters/loanRepayStatus.presenter';

export abstract class IRepayLoanService {
  abstract repayLoan(
    customerId: string,
    fullMsisdn: string,
    repayLoanDto: RepayLoanDto,
  ): Promise<RepayLoanPresenter>;

  abstract repayLoanUpdate(
    repayLoanUpdate: LMSRepayResponse,
  ): Promise<RepayLoanUpdatePresenter>;

  abstract repayLoanStatus(
    custId: string,
    loanRepayStatusDTO: LoanRepayStatusDTO,
  ): Promise<LoanRepayStatusPresenter>;
}
