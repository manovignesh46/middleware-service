import { ConfigService } from '@nestjs/config';
import { CredentialHelper } from './credential.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ICredentialHelper } from '../../domain/service/credential.service.interface';

describe('credentialHelper', () => {
  let service: ICredentialHelper;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ICredentialHelper, useClass: CredentialHelper },
        ConfigService,
      ],
    }).compile();
    service = module.get<ICredentialHelper>(ICredentialHelper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
