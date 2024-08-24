import { Test, TestingModule } from '@nestjs/testing';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { ICustPrimaryDetailsService } from '../domain/services/custPrimaryDetailsService.interface';
import { CustPrimaryDetailsService } from './custPrimaryDetails.service';
import { CustPrimaryDetails } from '../infrastructure/entities/custPrimaryDetails.entity';

describe('CustPrimaryDetailsService', () => {
  let service;

  const mockCustPrimaryDetailsRespository: ICustPrimaryDetailsRepository = {
    findByNinMsisdnEmail: function (
      nationalIdNumber: string,
      msisdnCountryCode: string,
      msisdn: string,
      email: string,
    ): Promise<ICustPrimaryDetails[]> {
      return Promise.resolve([new CustPrimaryDetails()]);
    },
    create: function (
      custPrimaryDetails: ICustPrimaryDetails,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    getCustomerByLeadId: function (
      leadId: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    deleteCustomer: function (
      customerId: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    getCustomerByCustomerId: function (
      id: string,
    ): Promise<ICustPrimaryDetails> {
      return Promise.resolve(new CustPrimaryDetails());
    },
    getByCustomerId: function (
      customerId: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    findByNinMsisdn: function (
      nationalIdNumber: string,
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    updateCustomer: function (
      customer: ICustPrimaryDetails,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    getByEmail: function (
      email: string,
      custId: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    getZeroLoansCust: function (): Promise<ICustPrimaryDetails[]> {
      throw new Error('Function not implemented.');
    },
    findByMsisdn: function (
      msisdnCountryCode: string,
      msisdn: string,
    ): Promise<ICustPrimaryDetails> {
      throw new Error('Function not implemented.');
    },
    decrementIdExpiryDays: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
    getCustomersByIdExpiryDaysList: function (): Promise<
      ICustPrimaryDetails[]
    > {
      throw new Error('Function not implemented.');
    },
    setExpiredIdStatus: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ICustPrimaryDetailsService,
          useClass: CustPrimaryDetailsService,
        },
        {
          provide: ICustPrimaryDetailsRepository,
          useValue: mockCustPrimaryDetailsRespository,
        },
      ],
    }).compile();

    service = module.get<ICustPrimaryDetailsService>(
      ICustPrimaryDetailsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
