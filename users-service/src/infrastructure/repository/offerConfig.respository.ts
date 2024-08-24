import { Injectable } from '@nestjs/common';
import { IOfferConfig } from '../../domain/model/offerConfig.interface';
import { IOfferConfigRepository } from '../../domain/repository/offerConfigRepository.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferConfig } from '../entities/offerConfig.entity';

@Injectable()
export class OfferConfigRepository implements IOfferConfigRepository {
  constructor(
    @InjectRepository(OfferConfig)
    private readonly offerConfigRepository: Repository<IOfferConfig>,
  ) {}

  findOfferId(offerId: string): Promise<IOfferConfig> {
    return this.offerConfigRepository.findOne({ where: { offerId } });
  }
  save(offerConfig: IOfferConfig): Promise<IOfferConfig> {
    return this.offerConfigRepository.save(offerConfig);
  }
}
