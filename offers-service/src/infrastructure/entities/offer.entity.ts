import { IOffer } from '../../domain/model/offer.interface';

export class Offer implements IOffer {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
