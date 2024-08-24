import { Test } from '@nestjs/testing';
import { EndpointName } from './endpoint-name.enum';
import { IntegratorErrorMappingEntity } from './integrator-error-mapping.entity';
import { IntegratorErrorMappingService } from './integrator-error-mapping.service';
import { IntegratorName } from './IntegratorName.enum';

describe('IntegratorErrorMappingService', () => {
  let service: IntegratorErrorMappingService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [IntegratorErrorMappingService],
    }).compile();
    service = module.get<IntegratorErrorMappingService>(
      IntegratorErrorMappingService,
    );
  });
  it('should be defined and intialise classes', () => {
    new IntegratorErrorMappingEntity();
    expect(service).toBeDefined();
  });

  describe('validateHttpCode', () => {
    it('should not throw err if http 200', async () => {
      expect(() => {
        service.validateHttpCode(
          200,
          'Success',
          IntegratorName.LMS,
          EndpointName.DASHBOARD,
        );
      }).not.toThrowError();
    });
    it('should not throw err if http 201', async () => {
      expect(() => {
        service.validateHttpCode(
          201,
          'Created',
          IntegratorName.LMS,
          EndpointName.DASHBOARD,
        );
      }).not.toThrowError();
    });
    it('should throw err if http 500', async () => {
      expect(() => {
        service.validateHttpCode(
          500,
          'Created',
          IntegratorName.LMS,
          EndpointName.DASHBOARD,
        );
      }).toThrowError();
    });
  });
  describe('validateResponseBodyStatusCodeAndErrorCode', () => {
    it('should not throw err if responseBodyStatusCode is null', async () => {
      expect(() => {
        service.validateResponseBodyStatusCodeAndErrorCode(
          null,
          IntegratorName.LMS,
          EndpointName.DASHBOARD,
        );
      }).not.toThrowError();
    });
    it('should throw err if LMS/LOS and responseBody.code is not null', async () => {
      expect(() => {
        service.validateResponseBodyStatusCodeAndErrorCode(
          { code: 500 },
          IntegratorName.LMS,
          EndpointName.DASHBOARD,
        );
      }).toThrowError();
    });
    it('should throw err if LMS/LOS and responseBody.rejection_code is not null', async () => {
      expect(() => {
        service.validateResponseBodyStatusCodeAndErrorCode(
          {
            data: {
              rejection_code: 4,
            },
          },
          IntegratorName.LMS,
          EndpointName.INTERACTION_TARGET,
        );
      }).toThrowError();
    });
    it('should not throw err if PEGPAY and responseBody.statusCode is 0', async () => {
      expect(() => {
        service.validateResponseBodyStatusCodeAndErrorCode(
          { statusCode: '0' },
          IntegratorName.PEGPAY,
          EndpointName.GET_STUDENT_DETAILS,
        );
      }).not.toThrowError();
    });
    it('should throw err if PEGPAY and responseBody.statusCode is 100', async () => {
      expect(() => {
        service.validateResponseBodyStatusCodeAndErrorCode(
          { statusCode: '100' },
          IntegratorName.PEGPAY,
          EndpointName.GET_STUDENT_DETAILS,
        );
      }).toThrowError();
    });
  });
});
