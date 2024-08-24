import { of } from 'rxjs';
import { IFSService } from '../../domain/services/fsService.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { FSService } from './freshService.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MockData } from './mockData';
import {
  FSCreateTicketDTO,
  FSCreateTicketWithEmail,
} from '../controllers/customers/dtos/fsCreateTicket.dto';

describe('FreshService', () => {
  let service: IFSService;

  const mockHttpService = {
    post: jest
      .fn()
      .mockImplementation(() => of({ data: MockData.mockCreateFSTicket })),
    get: jest
      .fn()
      .mockImplementation(() => of({ data: MockData.mockFSGetALLTicket })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: IFSService, useClass: FSService },
        { provide: HttpService, useValue: mockHttpService },
        ConfigService,
      ],
    }).compile();

    service = module.get<IFSService>(IFSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createTicket', async () => {
    const submit: FSCreateTicketWithEmail = {
      name: 'abhishek',
      phone: '79921312',
      subject: 'hi',
      description: 'welcom',
      category: 'Inquiry',
      sub_category: 'Loan Application',
      status: 2,
      priority: 1,
      source: 11,
      email: 'abhishek1@gmail.com',
      custom_fields: {
        customer_name: 'tommu',
      },
    };
    const result = await service.createTicket(null, false, submit);
    expect(result).toEqual(MockData.mockCreateFSTicket.ticket);
  });
  it('getTicketList', async () => {
    const result = await service.getTicketList(12345);
    expect(result).toEqual(MockData.mockFSGetALLTicket.tickets);
  });
});
