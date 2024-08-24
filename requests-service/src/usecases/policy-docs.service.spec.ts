import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PolicyDocsService } from './policy-docs.service';

describe('PolicyDocsService', () => {
  let service: PolicyDocsService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PolicyDocsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => {
              return '{"termsAndConditions":{"url":"https://test-furaha-policy-docs.s3.eu-west-1.amazonaws.com/terms-and-conditions/v1/1.0.0-terms_and_conditions.pdf","version":"1.0.0"},"aboutFuraha":{"url":"https://test-furaha-policy-docs.s3.eu-west-1.amazonaws.com/about-furaha/v1/1.0.0-about_furaha.pdf","version":"1.0.0"},"privacyPolicy":{"url":"https://test-furaha-policy-docs.s3.eu-west-1.amazonaws.com/privacy-policy/v1/1.0.0-privacy_policy.pdf","version":"1.0.0"}}';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PolicyDocsService>(PolicyDocsService);
  });

  it('Should Return Correct Data', async () => {
    const response = await service.getPolicyDocs();
    expect(response).toEqual({
      aboutFuraha: {
        url: 'https://test-furaha-policy-docs.s3.eu-west-1.amazonaws.com/about-furaha/v1/1.0.0-about_furaha.pdf',
        version: '1.0.0',
      },
      privacyPolicy: {
        url: 'https://test-furaha-policy-docs.s3.eu-west-1.amazonaws.com/privacy-policy/v1/1.0.0-privacy_policy.pdf',
        version: '1.0.0',
      },
      termsAndConditions: {
        url: 'https://test-furaha-policy-docs.s3.eu-west-1.amazonaws.com/terms-and-conditions/v1/1.0.0-terms_and_conditions.pdf',
        version: '1.0.0',
      },
    });
  });
});
