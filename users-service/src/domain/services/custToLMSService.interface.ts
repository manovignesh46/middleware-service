import { DashboardResponseDTO } from '../../infrastructure/controllers/customers/dtos/dashboardResponse.dto';
import { LMSTelcoResponseDTO } from '../../infrastructure/controllers/customers/dtos/lmsTelcoResponse.dto';
import { EKycPresenter } from '../../infrastructure/controllers/customers/presenters/ekyc.presenter';
import { ICustPrimaryDetails } from '../model/custPrimaryDetails.interface';
import { ICustTelco } from '../model/custTelco.interface';

export abstract class ICustToLMSService {
  abstract getDashboardDetails(
    custPrimaryDetails: ICustPrimaryDetails,
  ): Promise<DashboardResponseDTO>;

  abstract getEKycState(custId: string): Promise<EKycPresenter>;

  abstract getTelcoData(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<ICustTelco>;

  abstract purgeCustomer(msisdnList: string[]): Promise<string[]>;

  abstract optOutCustomer(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<number>;
}
