import { MTNConsentStatusDTO } from '../../infrastructure/controllers/customers/dtos/mtnConsentStatus.dto';
import { ICustOtp } from '../model/custOtp.interface';

export abstract class ICustOtpService {
  abstract findCustOTP(
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
    email: string,
  ): Promise<ICustOtp[]>;

  abstract mtnConsentStatus(
    mtnConsentStatusDTO: MTNConsentStatusDTO,
  ): Promise<boolean>;
}
