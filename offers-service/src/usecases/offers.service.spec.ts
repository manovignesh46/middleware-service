import { Test, TestingModule } from '@nestjs/testing';
import { IOffer } from '../domain/model/offer.interface';
import { IOfferRepository } from '../domain/repository/offerRepository.interface';
import { OfferService } from './offers.service';

describe('OffersService', () => {
  let service: OfferService;

  const mockOfferRepository: IOfferRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfferService,
        { provide: IOfferRepository, useValue: mockOfferRepository },
      ],
    }).compile();

    service = module.get<OfferService>(OfferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
