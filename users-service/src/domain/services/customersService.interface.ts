import { DashboardResponseDTO } from '../../infrastructure/controllers/customers/dtos/dashboardResponse.dto';
import { MTNOptOutDTO } from '../../infrastructure/controllers/customers/dtos/mtnOptOut.dto';
import { SubmitTicketDTO } from '../../infrastructure/controllers/customers/dtos/submitTicket.dto';
import { FSResponsePresenter } from '../../infrastructure/controllers/customers/presenters/fsResponse.presenter';
import { GetCustomerFromFullMsisdnPresenter } from '../../infrastructure/controllers/customers/presenters/get-customer-from-full-msisdn.presenter';
import { ProfilePersonalDataPresenter } from '../../infrastructure/controllers/customers/presenters/profilePersonalData.presenter';
import { WhitelistedSchoolPresenter } from '../../infrastructure/controllers/customers/presenters/whitelistedSchool.presenter';
import { ICustPrimaryDetails } from '../model/custPrimaryDetails.interface';

export abstract class ICustomersService {
  abstract getMsisdn(customerId: string): Promise<{
    msisdnCountryCode: string;
    msisdn: string;
    preferredName: string;
    availableCreditLimit: number;
  }>;
  abstract getTargetApiUuid(customerId: string): Promise<string>;
  abstract createCustomerFromEnhancedLead(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<ICustPrimaryDetails>;
  abstract getSanction(name: string);
  abstract deleteCustomer(customerId: string): Promise<ICustPrimaryDetails>;
  abstract updateCustomer(
    customerId: string,
    cognitoId: string,
  ): Promise<ICustPrimaryDetails>;
  abstract dashBoardDetails(customerId: string): Promise<DashboardResponseDTO>;
  abstract getCustFromFullMsisdn(
    fullMsisdn: string,
  ): Promise<GetCustomerFromFullMsisdnPresenter>;
  abstract getCustId(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<string>;

  abstract getProfilePersonalData(
    custId: string,
  ): Promise<ProfilePersonalDataPresenter>;

  abstract submitSupportTicket(
    files: Array<Express.Multer.File>,
    custId: string,
    submitTicketDTO: SubmitTicketDTO,
  ): Promise<number>;

  abstract getAllSupportTicketForCustId(
    custId: string,
  ): Promise<FSResponsePresenter[]>;

  abstract optOutCustomers(mtnOptOutDTO: MTNOptOutDTO): Promise<number>;

  abstract getWhitelistedSchoolList(): Promise<WhitelistedSchoolPresenter>;
}
