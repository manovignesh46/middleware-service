import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiProperty } from '@nestjs/swagger';
import { promises } from 'dns';

export class UrlAndVersion {
  @ApiProperty()
  url: string;

  @ApiProperty()
  version: string;
}

export class PolicyDOCData {
  @ApiProperty({ type: UrlAndVersion })
  termsAndConditions: UrlAndVersion;

  @ApiProperty({ type: UrlAndVersion })
  privacyPolicy: UrlAndVersion;

  @ApiProperty({ type: UrlAndVersion })
  aboutFuraha: UrlAndVersion;
}

@Injectable()
export class PolicyDocsService {
  private logger = new Logger(PolicyDocsService.name);
  private POLICY_DOCS_BUCKET_NAME: string;
  private POLICY_DOC_DATA: PolicyDOCData;
  constructor(private readonly configService: ConfigService) {
    this.POLICY_DOCS_BUCKET_NAME =
      this.configService.get<string>('POLICY_DOCS_BUCKET_NAME') ||
      'test-furaha-policy-docs';

    this.POLICY_DOC_DATA = JSON.parse(
      this.configService.get<string>('POLICY_DOC_DATA') ||
        '{"termsAndConditions":{"url":"https://test-furaha-policy-docs.s3.eu-west-1.amazonaws.com/terms-and-conditions/v1/1.0.0-terms_and_conditions.pdf","version":"1.0.0"},"aboutFuraha":{"url":"https://test-furaha-policy-docs.s3.eu-west-1.amazonaws.com/about-furaha/v1/1.0.0-about_furaha.pdf","version":"1.0.0"},"privacyPolicy":{"url":"https://test-furaha-policy-docs.s3.eu-west-1.amazonaws.com/privacy-policy/v1/1.0.0-privacy_policy.pdf","version":"1.0.0"}}',
    );
  }

  async getPolicyDocs(): Promise<PolicyDOCData> {
    this.logger.log(this.getPolicyDocs.name);
    return this.POLICY_DOC_DATA;
  }
}
