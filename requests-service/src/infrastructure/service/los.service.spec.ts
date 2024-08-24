import { HttpService } from '@nestjs/axios';
import { ILOSService } from '../../domain/service/losService.interface';
import { LOSService } from './los.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LOSOutcomeDTO } from '../controllers/requests/dtos/losOutcome.dto';
import { of } from 'rxjs';

describe('LOSService', () => {
  let service: ILOSService;

  const mockLOSResponse = {
    uuid: '1a98eab5-f03e-4cbd-b439-6c633b74024a',
    actions: [
      {
        uuid: '57ecde5a-e1ef-45e3-ae6b-3c73d4ed91d0',
        action: 'Lead Creation',
        workflow_item: {
          id: 78,
          partner_configuration_id: 1,
          workflow_id: 53,
          target_type: 'Customer',
          target_id: 88,
          payload: {
            NIN: '93858944833493',
            name: 'Harshith',
            email: 'harshith@yabx.co',
            msisdn: '8147728808',
            lead_id: '3434',
            customer_id: 88,
            lead_status: 'created',
            partner_code: 'yabxstaging_in',
            product_type: 'installment',
            target_msisdn: '8147728808',
          },
          status: 'running',
          uuid: '1a98eab5-f03e-4cbd-b439-6c633b74024a',
          created_at: '2023-04-05T07:52:02.116Z',
          updated_at: '2023-04-05T07:52:02.147Z',
          msisdn: '8147728808',
        },
        payload: {
          NIN: '93858944833493',
          name: 'Harshith',
          email: 'harshith@yabx.co',
          msisdn: '8147728808',
          lead_id: '3434',
          customer_id: 88,
          lead_status: 'created',
          partner_code: 'yabxstaging_in',
          product_type: 'installment',
          target_msisdn: '8147728808',
        },
      },
    ],
  };

  const mockHttpService = {
    get: jest.fn().mockImplementation(() => of({ data: mockLOSResponse })),
    post: jest.fn().mockImplementation(() => of({ data: mockLOSResponse })),
    put: jest.fn().mockImplementation(() => of({ data: null })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ILOSService, useClass: LOSService },
        { provide: HttpService, useValue: mockHttpService },
        ConfigService,
      ],
    }).compile();

    service = module.get<ILOSService>(ILOSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call the LOSService service', async () => {
    const secUUID: string = mockLOSResponse['actions'][0]['uuid'];
    const spy = jest.spyOn(service, 'interactionOutcome').mockImplementation();
    const dto: LOSOutcomeDTO = new LOSOutcomeDTO();
    await service.interactionOutcome(secUUID, dto);
    expect(spy).toHaveBeenCalled();
  });

  it('LOS interactionOutcome', async () => {
    const secUUID: string = mockLOSResponse['actions'][0]['uuid'];
    const dto: LOSOutcomeDTO = new LOSOutcomeDTO();
    const result = await service.interactionOutcome(secUUID, dto);
    expect(result).toEqual(false);
  });

  it('LOS interactionTarget', async () => {
    const targetUUID: string = mockLOSResponse['uuid'];
    const result = await service.interactionTarget(targetUUID);
    expect(result).toEqual(mockLOSResponse);
  });
});
