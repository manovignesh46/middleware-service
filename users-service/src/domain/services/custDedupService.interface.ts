import { DedupStatus } from '../enum/dedupStatus.enum';
import { ICustOtp } from '../model/custOtp.interface';

export abstract class ICustDedupService {
  abstract checkWIPDedup(
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
    email: string,
  ): Promise<{ responseStatus: DedupStatus; custOtp: ICustOtp | undefined }>;

  abstract checkDedupInternal(
    leadId: string,
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
    email: string,
  ): Promise<DedupStatus>;
}
