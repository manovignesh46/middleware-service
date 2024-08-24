import { ICustRefinitiv } from '../model/custRefinitiv.interface';

export abstract class ICustRefinitivRepository {
  abstract findByLeadId(leadId: string): Promise<ICustRefinitiv>;
  abstract save(custRefinitiv: ICustRefinitiv): Promise<ICustRefinitiv>;
  abstract findUnResolvedCase(): Promise<ICustRefinitiv[]>;
}
