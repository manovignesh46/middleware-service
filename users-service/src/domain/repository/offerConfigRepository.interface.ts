import { IOfferConfig } from '../model/offerConfig.interface';

export abstract class IOfferConfigRepository {
  abstract findOfferId(offerId: string): Promise<IOfferConfig>;
  abstract save(offerConfig: IOfferConfig): Promise<IOfferConfig>;
}
