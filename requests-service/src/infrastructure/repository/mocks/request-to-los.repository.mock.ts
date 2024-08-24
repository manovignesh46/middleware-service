import { mockRequestToLOS } from '../../../domain/model/mocks/request-to-los.mock';
import { IRequestToLOS } from '../../../domain/model/request-to-los.interface';
import { IRequestToLOSRepository } from '../../../domain/repository/request-to-los.repository.interface';

export const mockRequestToLOSRepository: IRequestToLOSRepository = {
  create: function (requestToLOS: IRequestToLOS): Promise<IRequestToLOS> {
    return Promise.resolve({ ...mockRequestToLOS, ...requestToLOS });
  },
};
