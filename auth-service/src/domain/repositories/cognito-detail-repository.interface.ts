import { ICognitoDetail } from '../models/cognito-detail.interface';

export abstract class ICognitoDetailRepository {
  abstract create(cognitoDetail: ICognitoDetail): Promise<ICognitoDetail>;
  abstract delete(customerId: string): Promise<boolean>;
  abstract findByCustomerId(customerId: string): Promise<ICognitoDetail>;
  abstract findByMsisdn(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<ICognitoDetail>;
  abstract update(cognitoDetail: ICognitoDetail): Promise<ICognitoDetail>;
}
