import { FAQ } from '../../infrastructure/entities/faq.entity';

export abstract class IFAQRepository {
  abstract getAllFAQs(): Promise<FAQ[]>;
}
