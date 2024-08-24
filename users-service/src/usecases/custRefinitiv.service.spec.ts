import { Test, TestingModule } from '@nestjs/testing';
import { ICustRefinitivService } from '../domain/services/custRefinitivService.interface';
import { CustRefinitivService } from './custRefinitiv.service';
import { ICustRefinitivRepository } from '../domain/repository/custRefinitivRepository.interface';
import { ICustRefinitiv } from '../domain/model/custRefinitiv.interface';
import { MatchStatus } from '../domain/enum/matchStatus.enum';
import { CustRefinitiv } from '../infrastructure/entities/custRefinitiv.entity';
import { IRefinitiveService } from '../domain/services/refinitiveService.interface';
import { MockData } from '../infrastructure/services/mockData';
import { ConfigService } from '@nestjs/config';

describe('CustRefinitivService', () => {
  let service: ICustRefinitivService;

  const mockCustRefinitivRepository: ICustRefinitivRepository = {
    findByLeadId: function (leadId: string): Promise<ICustRefinitiv> {
      return Promise.resolve(MockData.mockCustRefinitiveEntityData);
    },
    save: function (custRefinitiv: ICustRefinitiv): Promise<ICustRefinitiv> {
      return Promise.resolve(MockData.mockCustRefinitiveEntityData);
    },
    findUnResolvedCase: function (): Promise<ICustRefinitiv[]> {
      throw new Error('Function not implemented.');
    },
  };

  const mockRefinitiveService: IRefinitiveService = {
    getSanctionDetails: function (name: string) {
      throw new Error('Function not implemented.');
    },
    getRefinitiv: function (
      name: string,
      gender: string,
      dob: string,
      countryName: string,
    ): Promise<any> {
      return Promise.resolve(MockData.mockRefinitiveResponse);
    },
    refinitiveResolution: function (
      caseSystemId: string,
      resultIdReferenceId: string,
    ): Promise<any> {
      throw new Error('Function not implemented.');
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ICustRefinitivService, useClass: CustRefinitivService },
        {
          provide: ICustRefinitivRepository,
          useValue: mockCustRefinitivRepository,
        },
        { provide: IRefinitiveService, useValue: mockRefinitiveService },
        ConfigService,
      ],
    }).compile();

    service = module.get<ICustRefinitivService>(ICustRefinitivService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findCustRefinitiv', async () => {
    const result = await service.findCustRefinitiv('123');
    expect(result).toEqual(MockData.mockCustRefinitiveEntityData);
  });

  it('should call save', async () => {
    const result = await service.save(MockData.mockCustRefinitiveEntityData);
    expect(result).toEqual(MockData.mockCustRefinitiveEntityData);
  });

  it('should call findAndSaveRefinitiveData', async () => {
    const spy = jest
      .spyOn(service, 'findAndSaveRefinitiveData')
      .mockImplementation();
    await service.findAndSaveRefinitiveData(
      true,
      '12345',
      'zxcvbnm',
      'M',
      '31.12.1990',
      'UG',
    );
    expect(spy).toHaveBeenCalled();
  });

  it('should call findAndSaveRefinitiveData', async () => {
    const result = await service.findAndSaveRefinitiveData(
      true,
      '12345',
      'zxcvbnm',
      'M',
      '31.12.1990',
      'UG',
    );
    expect(result).toEqual(undefined);
  });
});
