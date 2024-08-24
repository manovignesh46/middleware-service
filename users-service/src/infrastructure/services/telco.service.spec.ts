import { of } from 'rxjs';
import { ITelcoService } from '../../domain/services/telcoService.interface';
import { generateMockTelcoKycRespDTO } from '../controllers/customers/dtos/telcoKycResp.dto.spec';
import { Test, TestingModule } from '@nestjs/testing';
import { TelcoService } from './telco.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ICustTelcoRepository } from '../../domain/repository/custTelcoRepository.interface';
import { ICustTelco } from '../../domain/model/custTelco.interface';
import { MockData } from './mockData';
import { ICustTelcoTransactionRepository } from '../../domain/repository/custTelcoTransactionRepository.interface';
import { ICustTelcoTransaction } from '../../domain/model/custTelcoTransaction.interface';

describe('TelcoService', () => {
  let service: ITelcoService;

  const mockHttpService = {
    get: jest
      .fn()
      .mockImplementation(() => of({ data: [generateMockTelcoKycRespDTO()] })),
  };

  const mockCustTelcoRepo: ICustTelcoRepository = {
    findByLeadId: function (leadId: string): Promise<ICustTelco> {
      return Promise.resolve(MockData.mockCustTelcoEnitytData);
    },
    save: function (custTelco: ICustTelco): Promise<ICustTelco> {
      return Promise.resolve(MockData.mockCustTelcoEnitytData);
    },
    findByFullMsisdnAndLeadId: function (
      msisdnCountryCode: string,
      msisdn: string,
      leadId: string,
    ): Promise<ICustTelco> {
      return Promise.resolve(MockData.mockCustTelcoEnitytData);
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

  const mockCustTelcoTransactionRepo: ICustTelcoTransactionRepository = {
    findByLeadId: function (leadId: string): Promise<ICustTelcoTransaction> {
      return Promise.resolve(MockData.mockCustTelcoTransactionEntityData);
    },
    save: function (
      custTelcoTransaction: ICustTelcoTransaction,
    ): Promise<ICustTelcoTransaction> {
      return Promise.resolve(MockData.mockCustTelcoTransactionEntityData);
    },
    update: function (
      custTelcoTransaction: ICustTelcoTransaction,
    ): Promise<ICustTelcoTransaction> {
      return Promise.resolve(MockData.mockCustTelcoTransactionEntityData);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ITelcoService, useClass: TelcoService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ICustTelcoRepository, useValue: mockCustTelcoRepo },
        {
          provide: ICustTelcoTransactionRepository,
          useValue: mockCustTelcoTransactionRepo,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<ITelcoService>(ITelcoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call the TelcoService findTelcoKYC', async () => {
    const result = await service.findTelcoKYC(
      '1234',
      '+256',
      '1234567890',
      'NIN123456789',
    );
    expect(result).toEqual(MockData.mockCustTelcoEnitytData);
  });

  it('should call the TelcoService findTelcoTransaction', async () => {
    const result = await service.findTelcoTransaction(
      '1234',
      '+256',
      '1234567890',
    );
    expect(result).toEqual(MockData.mockCustTelcoTransactionEntityData);
  });
});
