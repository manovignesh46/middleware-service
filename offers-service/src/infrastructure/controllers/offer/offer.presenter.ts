import { ApiProperty } from '@nestjs/swagger';
import { IOffer } from '../../../domain/model/offer.interface';
import { BasePresenter } from '../common/basePresenter';

// should there be an IOfferPresenter?
export class OfferPresenter extends BasePresenter {
  @ApiProperty()
  id: string;

  constructor(offer: IOffer) {
    super();
    this.id = offer.id;
    this.createdAt = offer.createdAt;
    this.updatedAt = offer.updatedAt;
  }
}
