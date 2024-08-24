import { ICustDedup } from '../model/custDedup.interface';

export abstract class ICustDedupRepository {
  abstract create(custDedup: ICustDedup): Promise<ICustDedup>;
}
