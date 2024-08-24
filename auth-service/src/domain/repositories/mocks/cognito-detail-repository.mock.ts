import { ICognitoDetail } from '../../models/cognito-detail.interface';
import { mockCognitoDetail } from '../../models/mocks/cognito-details.mock';
import { ICognitoDetailRepository } from '../cognito-detail-repository.interface';

export const mockCognitoDetailRepository: ICognitoDetailRepository = {
  create: function (cognitoDetail: ICognitoDetail): Promise<ICognitoDetail> {
    return Promise.resolve(cognitoDetail);
  },
  delete: function (customerId: string): Promise<boolean> {
    return Promise.resolve(true);
  },
  findByCustomerId: function (customerId: string): Promise<ICognitoDetail> {
    return Promise.resolve({ ...mockCognitoDetail, customerId });
  },
  findByMsisdn: function (
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<ICognitoDetail> {
    return Promise.resolve({ ...mockCognitoDetail, msisdnCountryCode, msisdn });
  },
  update: function (cognitoDetail: ICognitoDetail): Promise<ICognitoDetail> {
    return Promise.resolve({ ...mockCognitoDetail, ...cognitoDetail });
  },
};
