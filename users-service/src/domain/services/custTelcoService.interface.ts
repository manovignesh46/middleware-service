import { ICustTelco } from '../model/custTelco.interface';

export abstract class ICustTelcoService {
  abstract findCustTelco(leadId: string): Promise<ICustTelco>;
  abstract save(custTelco: ICustTelco): Promise<ICustTelco>;
}
