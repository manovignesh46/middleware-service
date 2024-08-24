import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { LMSService } from './lms.service';
import { ILMSService } from '../../domain/services/lmsService.interface';
import { MockData } from './mockData';
import { IntegratorErrorMappingService } from '../../modules/error-mapping/integrator-error-mapping.service';
import { createMock } from '@golevelup/ts-jest';

describe('LMSService', () => {
  let service: ILMSService;

  const mockHttpService = {
    post: jest
      .fn()
      .mockImplementation(() => of({ data: MockData.mockLMSRespomse })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ILMSService, useClass: LMSService },
        { provide: HttpService, useValue: mockHttpService },
        {
          provide: IntegratorErrorMappingService,
          useValue: createMock<IntegratorErrorMappingService>(),
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<ILMSService>(ILMSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('LOS interactionTarget', async () => {
    const result = await service.dashboard('installment', '87687684');
    expect(result).toEqual(MockData.mockLMSRespomse.data);
  });
});
