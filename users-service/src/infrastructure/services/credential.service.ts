import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICredentialHelper } from '../../domain/services/credential.service.interface';
import {
  fromContainerMetadata,
  fromEnv,
  fromIni,
} from '@aws-sdk/credential-providers';
import { AwsCredentialIdentityProvider } from '@aws-sdk/types';

@Injectable()
export class CredentialHelper implements ICredentialHelper {
  private logger = new Logger(CredentialHelper.name);
  private credentialSource: string;
  private iniProfile: string;

  constructor(private configService: ConfigService) {
    //values are 'shared-ini', 'container-metadata', 'iam-user'
    this.credentialSource =
      configService.get<string>('AWS_CREDENTIAL_SOURCE') ||
      'container-metadata';
    this.iniProfile = configService.get<string>('AWS_INI_PROFILE') || 'furaha';
  }
  getCredentials(): AwsCredentialIdentityProvider {
    this.logger.log(`Setting up AWS credentials from ${this.credentialSource}`);
    switch (this.credentialSource) {
      case 'shared-ini':
        this.logger.log(`Shared ini profile is ${this.iniProfile}`);
        return fromIni({ profile: this.iniProfile });

      case 'container-metadata':
        return fromContainerMetadata();

      case 'iam-user':
        this.logger.log(
          'Obtaining AWS credentials from AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.',
        );
        return fromEnv();

      default:
        this.logger.error(
          'Invalid Credentials source. Have you set the AWS_CREDENTIAL_SOURCE to shared-ini / container-metadata / iam-user',
        );
        break;
    }
  }
}
