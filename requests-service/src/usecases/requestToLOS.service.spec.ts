import { Test, TestingModule } from '@nestjs/testing';
import { LOSStatus } from '../domain/enum/losStatus.enum';
import { IRequestToLOSRepository } from '../domain/repository/request-to-los.repository.interface';
import { ILOSService } from '../domain/service/losService.interface';
import { IRequestToLOSService } from '../domain/service/requestToLOSService.interface';
import { generateMockCustomerIdCardDetails } from '../infrastructure/controllers/requests/dtos/CustomerIdCardDetails.dto.spec';
import { CustomerIdCardDetailsDTO } from '../infrastructure/controllers/requests/dtos/customerIdCardDetails.dto';
import { LOSOutcomeDTO } from '../infrastructure/controllers/requests/dtos/losOutcome.dto';
import { SelfieLivenessDTO } from '../infrastructure/controllers/requests/dtos/selfieLiveness.dto';
import { generateMockSelfieLivenessDTO } from '../infrastructure/controllers/requests/dtos/selfieLiveness.dto.spec';
import { ApplyLoansPresenter } from '../infrastructure/controllers/requests/presenters/apply-loans.presenter';
import { mockRequestToLOSRepository } from '../infrastructure/repository/mocks/request-to-los.repository.mock';
import { RequestToLOSService } from './requestToLOS.service';
import { IS3ClientService } from '../domain/service/s3-client-service.interface';
import { createMock } from '@golevelup/ts-jest';
import { S3ClientService } from '../infrastructure/service/s3-client.service';
import { ConfigService } from '@nestjs/config';

describe('RequestToLOSService', () => {
  let service: IRequestToLOSService;
  const customerId = 'customer123';

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
          minimum_loan_amount: 0,
          loan_boundary: 90000,
        },
      },
    ],
  };

  const mockLOSService: ILOSService = {
    interactionOutcome: function (
      secondaryUUID: string,
      losOutcomeDto: LOSOutcomeDTO,
    ): Promise<boolean> {
      return Promise.resolve(true);
    },
    interactionTarget: function (uuid: string): Promise<any> {
      return Promise.resolve(mockLOSResponse);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: IRequestToLOSService, useClass: RequestToLOSService },
        { provide: ILOSService, useValue: mockLOSService },
        {
          provide: IRequestToLOSRepository,
          useValue: mockRequestToLOSRepository,
        },
        { provide: IS3ClientService, useValue: createMock<S3ClientService>() },
        ConfigService,
      ],
    }).compile();
    service = module.get<IRequestToLOSService>(IRequestToLOSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('RequestToLOSService applyLoans', async () => {
    const idCardDetailsDTO: CustomerIdCardDetailsDTO =
      generateMockCustomerIdCardDetails();
    const selfieDto: SelfieLivenessDTO = generateMockSelfieLivenessDTO();
    jest.spyOn(mockLOSService, 'interactionTarget').mockResolvedValueOnce({
      ...mockLOSResponse,
      actions: [{ action: LOSStatus.LOAN_APPLICATION }],
    });
    const result = await service.applyLoans(
      '1234',
      idCardDetailsDTO,
      selfieDto,
    );
    expect(result).toEqual(true);
  });

  it('RequestToLOSService submitLoans', async () => {
    jest.spyOn(mockLOSService, 'interactionTarget').mockResolvedValueOnce({
      ...mockLOSResponse,
      actions: [{ action: LOSStatus.SUBMIT_LOAN }],
    });
    const result = await service.submitLoans(
      '1234',
      3178310,
      'pco1231',
      '1685361055160',
      3,
      'monthly',
      'weekly',
      customerId,
    );
    expect(result).toEqual(true);
  });

  it('RequestToLOSService getLoanBoundaries', async () => {
    const mockApplyLoansPresenter = new ApplyLoansPresenter();
    mockApplyLoansPresenter.minLoanAmount = 0;
    mockApplyLoansPresenter.maxLoanAmount = 90000;
    const result = await service.getLoanBoundaries('1234');
    expect(result).toEqual(mockApplyLoansPresenter);
  });
});
