import { CustomerIdCardDetailsDTO } from '../../infrastructure/controllers/requests/dtos/customerIdCardDetails.dto';
import { SelfieLivenessDTO } from '../../infrastructure/controllers/requests/dtos/selfieLiveness.dto';
import { ApplyLoansPresenter } from '../../infrastructure/controllers/requests/presenters/apply-loans.presenter';

export abstract class IRequestToLOSService {
  abstract getLoanBoundaries(targetUUID: string): Promise<ApplyLoansPresenter>;

  abstract applyLoans(
    targetUUID: string,
    idCardDetailsDTO: CustomerIdCardDetailsDTO,
    selfieLivenessDTO: SelfieLivenessDTO,
  ): Promise<boolean>;

  abstract submitLoans(
    targetUUID: string,
    loanAmount: number,
    stundetPCOId: string,
    offerId: string,
    tenor: number,
    repaymentFreq: string,
    preferredPaymentDay: string,
    customerId: string,
  ): Promise<boolean>;
}
