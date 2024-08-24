import { ICustIdCardDetails } from '../model/custIdCardDetails.interface';

export abstract class ICustIdCardDetailsRepository {
  abstract findByCustId(custId: string): Promise<ICustIdCardDetails>;
  abstract findByCustIdOrFail(custId: string): Promise<ICustIdCardDetails>;

  abstract save(
    custIdCardDetails: ICustIdCardDetails,
  ): Promise<ICustIdCardDetails>;
}
