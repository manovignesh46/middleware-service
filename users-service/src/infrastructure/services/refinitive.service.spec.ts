import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RifinitiveService } from './refinitive.service';
import { HttpService } from '@nestjs/axios';
import { IRefinitiveService } from '../../domain/services/refinitiveService.interface';
import { of } from 'rxjs';
import { MockData } from './mockData';
import { IntegratorErrorMappingService } from '../../modules/error-mapping/integrator-error-mapping.service';
import { createMock } from '@golevelup/ts-jest';

describe('RifinitiveService', () => {
  let service: IRefinitiveService;

  const mockHttpService = {
    post: jest
      .fn()
      .mockImplementation(() =>
        of({ data: MockData.mockRefinitiveResponse, status: 200 }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: IRefinitiveService, useClass: RifinitiveService },
        { provide: HttpService, useValue: mockHttpService },
        {
          provide: IntegratorErrorMappingService,
          useValue: createMock<IntegratorErrorMappingService>(),
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<IRefinitiveService>(IRefinitiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should call the RifinitiveService service', async () => {
    const name = 'test';
    const spy = jest.spyOn(service, 'getSanctionDetails').mockImplementation();
    await service.getSanctionDetails(name);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the RifinitiveService service', async () => {
    const spy = jest.spyOn(service, 'getRefinitiv').mockImplementation();
    await service.getRefinitiv('Sudharshan', 'MALE', '1971-06-08', 'IND');
    expect(spy).toHaveBeenCalled();
  });

  it('should call the RifinitiveService service', async () => {
    const result = await service.getRefinitiv(
      'Sudharshan',
      'MALE',
      '1971-06-08',
      'IND',
    );
    expect(result).toEqual(MockData.mockRefinitiveResponse);
  });
});
