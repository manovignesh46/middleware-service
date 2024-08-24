import { ICustScoringData } from '../model/custScoringData.interface';

export abstract class ICustScoringDataRepository {
  abstract findByLeadId(leadId: string): Promise<ICustScoringData>;

  abstract save(custScoringData: ICustScoringData): Promise<ICustScoringData>;
}
