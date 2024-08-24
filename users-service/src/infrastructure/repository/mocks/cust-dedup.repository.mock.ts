import { ICustDedup } from '../../../domain/model/custDedup.interface';
import { ICustDedupRepository } from '../../../domain/repository/custDedupRespository.interface';

export const mockCustDedupRepository: ICustDedupRepository = {
  create(custDedup: ICustDedup): Promise<ICustDedup> {
    return Promise.resolve(custDedup);
  },
};
