import { ICustTelco } from '../model/custTelco.interface';
import { ICustTelcoTransaction } from '../model/custTelcoTransaction.interface';

export abstract class ITelcoService {
  abstract findTelcoTransaction(
    leadId: string,
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<ICustTelcoTransaction>;
  abstract findTelcoKYC(
    leadId: string,
    msisdnCountryCode: string,
    msisdn: string,
    nin: string,
  ): Promise<ICustTelco>;
}
