import { ConfigService } from '@nestjs/config';
import { CredentialHelper } from './credential.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('credentialHelper', () => {
  let service: CredentialHelper;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [CredentialHelper, ConfigService],
    }).compile();
    service = module.get<CredentialHelper>(CredentialHelper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
