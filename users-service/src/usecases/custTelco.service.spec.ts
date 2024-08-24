import { Test, TestingModule } from '@nestjs/testing';
import { ICustTelcoService } from '../domain/services/custTelcoService.interface';
import { CustTelcoService } from './custTelco.service';
import { ICustTelcoRepository } from '../domain/repository/custTelcoRepository.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { MatchStatus } from '../domain/enum/matchStatus.enum';
import { CustTelco } from '../infrastructure/entities/custTelco.entity';
import { mockCustTelco } from '../domain/model/mocks/cust-telco.mock';

describe('CustTelcoService', () => {
  let service: ICustTelcoService;

  const mockCustTelcoRepository: ICustTelcoRepository = {
    findByLeadId: function (leadId: string): Promise<ICustTelco> {
      return Promise.resolve(mockCustTelco);
    },
    save: function (custTelco: ICustTelco): Promise<ICustTelco> {
      return Promise.resolve(mockCustTelco);
    },
    findByFullMsisdnAndLeadId: function (
      msisdnCountryCode: string,
      msisdn: string,
      leadId: string,
    ): Promise<ICustTelco> {
      return Promise.resolve(mockCustTelco);
    },
    findByLeadIdList: function (leadIdList: string[]): Promise<ICustTelco[]> {
      throw new Error('Function not implemented.');
    },
    updateCustTelcoList: function (
      custTelco: ICustTelco[],
    ): Promise<ICustTelco[]> {
      throw new Error('Function not implemented.');
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ICustTelcoService, useClass: CustTelcoService },
        { provide: ICustTelcoRepository, useValue: mockCustTelcoRepository },
      ],
    }).compile();

    service = module.get<ICustTelcoService>(ICustTelcoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findCustTelco', async () => {
    const result = await service.findCustTelco('123');
    expect(result).toEqual(mockCustTelco);
  });
});
