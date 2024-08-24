import { LMSLoanCalculatorDTO } from '../../infrastructure/controllers/requests/dtos/LMSLoanCalculator.dto';
import { LMSFormData } from '../../infrastructure/controllers/requests/dtos/lmsFormData.dto';
import { LOSRepayLoanDto } from '../../infrastructure/controllers/requests/dtos/repay-loan.dto';

export abstract class ILMSService {
  abstract dashboard(productType: string, fullMsisdn: string): Promise<any>;
  abstract repayLoan(repayLoanDto: LOSRepayLoanDto): Promise<any>;
  abstract loanCalculator(
    losLoanCalculatorDTO: LMSLoanCalculatorDTO,
  ): Promise<any>;
  abstract loanDetailStatement(msisdn: string, loanId: string): Promise<any>;
  abstract applicationFormData(
    loanId: string,
    payload: any,
  ): Promise<LMSFormData>;
}
