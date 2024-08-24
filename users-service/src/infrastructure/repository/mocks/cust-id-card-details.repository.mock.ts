import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ICustIdCardDetails } from '../../../domain/model/custIdCardDetails.interface';
import { mockCustIdCardDetails } from '../../../domain/model/mocks/cust-id-card-details.mock';
import { ICustIdCardDetailsRepository } from '../../../domain/repository/custIdCardDetailsRepository.interface';

export const mockCustIdCardDetailsRepository: ICustIdCardDetailsRepository = {
  findByCustId: function (custId: string): Promise<ICustIdCardDetails> {
    if (custId === '123') return Promise.resolve(mockCustIdCardDetails);
  },
  save: function (
    custIdCardDetails: ICustIdCardDetails,
  ): Promise<ICustIdCardDetails> {
    return Promise.resolve(mockCustIdCardDetails);
  },
  findByCustIdOrFail: function (custId: string): Promise<ICustIdCardDetails> {
    return Promise.resolve(mockCustIdCardDetails);
  },
};
