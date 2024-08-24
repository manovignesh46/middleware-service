import { TelcoTransactionResp } from '../../infrastructure/controllers/customers/dtos/telcoTransactionResp.dto';
import { ConfirmStudentDetailsPresenter } from '../../infrastructure/controllers/customers/presenters/confirmStudentDetails.presenter';
import { DashBoardPresenter } from '../../infrastructure/controllers/customers/presenters/dashBoard.presenter';
import { CustScoringData } from '../../infrastructure/entities/custScoringData.entity';
import { LeadStatus } from '../enum/leadStatus.enum';
import { IStudentDetails } from '../model/studentDetails.interface';

export abstract class ICustToLOSService {
  abstract createRepeatWorkflow(
    leadId: string,
    fullMsisdn: string,
  ): Promise<any>;

  abstract terminateOngoingLoans(
    custId: string,
    reason?: string,
  ): Promise<boolean>;

  abstract cancelLoanWorkflow(
    custId: string,
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<any>;

  abstract cancelOnboardingWorkflow(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<any>;

  abstract leadCreationInLOS(
    leadId: string,
    leadCurrentStatus: LeadStatus,
  ): Promise<any>;

  abstract leadVerifiedInLOS(leadId: string): Promise<any>;
  abstract leadEnhancedInLOS(
    leadId: string,
    custScoringData: CustScoringData,
    experianData: string,
    telcoTransactionReso: TelcoTransactionResp,
  ): Promise<any>;

  abstract pinCreationInLOS(leadId: string, pinCreated: boolean): Promise<any>;

  abstract getCustomerLoansFromLOS(
    custId: string,
    custloanStatus: boolean,
    offset: number,
    limit: number,
    startDate: string,
    endDate: string,
  ): Promise<any>;

  abstract dashBoardDetails(targetApiUUID: string): Promise<DashBoardPresenter>;

  abstract checkForRejection(leadId: string): Promise<any>;

  abstract updateStudentDetails(
    leadId: string,
    studentDetails: IStudentDetails,
    schoolAggregatoreName: string,
    computedAmount: string,
  ): Promise<ConfirmStudentDetailsPresenter>;
}
