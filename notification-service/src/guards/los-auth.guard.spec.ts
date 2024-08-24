import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { LOSAuthGuard } from './los-auth.guard';

describe('LOSAuthGuard', () => {
  let losAuthGuard: LOSAuthGuard;
  const mockConfigService: ConfigService = createMock<ConfigService>();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        LOSAuthGuard,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    losAuthGuard = module.get<LOSAuthGuard>(LOSAuthGuard);
  });

  it('should be defined', () => {
    expect(losAuthGuard).toBeDefined();
  });

  it('should return true if the correct API key is provided', () => {
    const mockExpectedApiKey = 'my-secret-api-key';
    const mockRequest = {
      headers: {
        'api-key': mockExpectedApiKey,
      },
    };
    const mockContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as any; // We are not using all properties of ExecutionContext in this test

    // Mock the ConfigService get method to return the expected API key
    jest.spyOn(mockConfigService, 'get').mockReturnValue(mockExpectedApiKey);
    const result = losAuthGuard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should return false if the incorrect API key is provided', () => {
    const mockExpectedApiKey = 'my-secret-api-key';
    const mockInvalidApiKey = 'invalid-api-key';
    const mockRequest = {
      headers: {
        'api-key': mockInvalidApiKey,
      },
    };
    const mockContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as any; // We are not using all properties of ExecutionContext in this test

    // Mock the ConfigService get method to return the expected API key
    jest.spyOn(mockConfigService, 'get').mockReturnValue(mockExpectedApiKey);

    const result = losAuthGuard.canActivate(mockContext);
    expect(result).toBe(false);
  });

  it('should return false if an error occurs while accessing the API key', () => {
    const mockRequest = {
      // No 'headers' property, simulating an error while accessing the 'api-key'
    };
    const mockContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as any; // We are not using all properties of ExecutionContext in this test

    // Mock the ConfigService get method to return the expected API key
    jest.spyOn(mockConfigService, 'get').mockReturnValue('my-secret-api-key');

    const result = losAuthGuard.canActivate(mockContext);
    expect(result).toBe(false);
  });
});
