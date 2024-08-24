import {
  GetLoanApplicationContentInputDto,
  GetLoanApplicationContentOutputDto,
} from '../infrastructure/service/service-dtos/get-loan-application-content.dto';

export abstract class IContentService {
  abstract getSubmitLoanSuccessMsg(
    preferredName: string,
  ): Promise<{ message: string; messageHeader: string }>;
  abstract getLoanApplicationFormData(
    getLoanApplicationContentDto?: GetLoanApplicationContentInputDto,
  ): Promise<GetLoanApplicationContentOutputDto>;
  abstract getLoanTerminatedMessage(
    preferredName: string,
    loanAmount: number,
    interestRate: string,
  ): Promise<{ message: string; messageHeader: string }>;
  abstract getRepayUpdatedSuccessMessage(
    preferredName: string,
    loanId: string,
    status: string, //Success / Failure
  ): Promise<{ message: string; messageHeader: string }>;
  abstract getRepayUpdatedInsufficientFundsMessage(
    preferredName: string,
    loanId: string,
    status: string,
  ): Promise<{ message: string; messageHeader: string }>;
  abstract getRepayUpdatedFailedMessage(
    preferredName: string,
    loanId: string,
    status: string,
  ): Promise<{ message: string; messageHeader: string }>;
}
