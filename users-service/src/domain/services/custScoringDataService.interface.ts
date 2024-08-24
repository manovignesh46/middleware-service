import { CreditScoreServiceDto } from '../../infrastructure/controllers/customers/dtos/creditScoreService.dto';
import { ICustScoringData } from '../model/custScoringData.interface';

export abstract class ICustScoringDataService {
  abstract findCustScoringData(
    leadId: string,
    custScoringData: ICustScoringData,
  ): Promise<CreditScoreServiceDto>;
}
