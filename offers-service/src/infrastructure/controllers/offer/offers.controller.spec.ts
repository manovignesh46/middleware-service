import { Test, TestingModule } from '@nestjs/testing';
import { IOfferService } from '../../../domain/services/offerService.interface';
import { SoapService } from '../../services/soap-client.service';
import { createMock } from '@golevelup/ts-jest';
import { OffersController } from './offers.controller';

describe('OffersController', () => {
  let controller: OffersController;

  const mockOffersService: IOfferService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [
        { provide: IOfferService, useValue: mockOffersService },
        {
          provide: SoapService,
          useValue: createMock<SoapService>(),
        },
      ],
    }).compile();
    controller = module.get<OffersController>(OffersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
