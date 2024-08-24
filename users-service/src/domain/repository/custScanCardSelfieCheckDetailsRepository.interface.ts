import { ICustScanCardSelfieCheckDetails } from '../model/custScanCardSelfieCheckDetails.interface';

export abstract class ICustScanCardSelfieCheckDetailsRepository {
  abstract findByCustId(
    custId: string,
  ): Promise<ICustScanCardSelfieCheckDetails>;

  abstract save(
    custIdCardDetails: ICustScanCardSelfieCheckDetails,
  ): Promise<ICustScanCardSelfieCheckDetails>;
}
