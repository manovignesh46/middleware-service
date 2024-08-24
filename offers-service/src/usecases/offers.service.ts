import { Injectable } from '@nestjs/common';
import { IOfferRepository } from '../domain/repository/offerRepository.interface';
import { IOfferService } from '../domain/services/offerService.interface';

@Injectable()
export class OfferService implements IOfferService {
  constructor(private offerRepository: IOfferRepository) {}
}
