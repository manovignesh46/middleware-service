import { ICustTelco } from '../model/custTelco.interface';

export abstract class ICustTelcoRepository {
  abstract findByLeadId(leadId: string): Promise<ICustTelco>;
  abstract save(custTelco: ICustTelco): Promise<ICustTelco>;
  abstract findByFullMsisdnAndLeadId(
    msisdnCountryCode: string,
    msisdn: string,
    leadId: string,
  ): Promise<ICustTelco>;
  abstract findByLeadIdList(leadIdList: string[]): Promise<ICustTelco[]>;
  abstract updateCustTelcoList(custTelco: ICustTelco[]): Promise<ICustTelco[]>;
}
