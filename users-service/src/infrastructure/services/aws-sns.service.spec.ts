import {
  CreatePlatformEndpointCommandOutput,
  DeleteEndpointCommandOutput,
  GetEndpointAttributesCommandOutput,
  ListTopicsCommandOutput,
  NotFoundException,
  SetEndpointAttributesCommandOutput,
  SNSClient,
  SubscribeCommandOutput,
  UnsubscribeCommandOutput,
} from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ICredentialHelper } from '../../domain/services/credential.service.interface';
import { EndpointArnStatus, SNSService } from './aws-sns.service';

describe('SNSService', () => {
  let service: SNSService;
  let mockSNSClient: any;
  let mockConfigService: any;
  let mockCredentialHelper: ICredentialHelper;

  const mockGetEndpointAttributes: GetEndpointAttributesCommandOutput = {
    $metadata: {
      httpStatusCode: 200,
      requestId: 'b3dc8120-4e3b-5b1d-9427-dc35d20edfce',
      extendedRequestId: undefined,
      cfId: undefined,
      attempts: 1,
      totalRetryDelay: 0,
    },
    Attributes: {
      Enabled: 'true',
      Token: '<myfirebasetoken>',
    },
  };

  const mockCreateEndpoint: CreatePlatformEndpointCommandOutput = {
    $metadata: {
      httpStatusCode: 200,
      requestId: '9ce0e418-2718-5335-b642-b90dbdc334cd',
      attempts: 1,
      totalRetryDelay: 0,
    },
    EndpointArn: 'my endpoint arn',
  };

  const mockListTopicsResponse: ListTopicsCommandOutput = {
    $metadata: {},
    Topics: [
      { TopicArn: 'arn:aws:sns:ap-southeast-1:123456123456:topic1' },
      { TopicArn: 'arn:aws:sns:ap-southeast-1:123456123456:topic2' },
      { TopicArn: 'arn:aws:sns:ap-southeast-1:123456123456:topic3' },
    ],
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockSNSClient = {
      send: jest.fn(),
    };
    mockConfigService = {
      get: jest.fn(),
    };
    mockCredentialHelper = {
      getCredentials: jest.fn().mockResolvedValue(null),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SNSService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: SNSClient, useValue: mockSNSClient },
        { provide: ICredentialHelper, useValue: mockCredentialHelper },
      ],
    }).compile();
    service = module.get<SNSService>(SNSService);

    service = new SNSService(mockConfigService, mockCredentialHelper);
    service['snsClient'] = mockSNSClient;
  });

  it('should return VALID if the endpoint attributes are valid', async () => {
    // Mock the successful response of GetEndpointAttributesCommand
    mockSNSClient.send.mockResolvedValue(mockGetEndpointAttributes);
    const isValid = await service.isValidEndpointArn(
      'endpoint-arn',
      '<myfirebasetoken>',
    );
    expect(isValid).toBe(EndpointArnStatus.VALID);
    expect(mockSNSClient.send).toHaveBeenCalledTimes(1);
    expect(mockSNSClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        constructor: expect.any(Function),
        input: {
          EndpointArn: 'endpoint-arn',
        },
      }),
    );
  });
  it('should return INVALID_ATTRIBUTES if the endpoint attributes device token is different', async () => {
    // Mock the successful response of GetEndpointAttributesCommand
    mockSNSClient.send.mockResolvedValue(mockGetEndpointAttributes);
    const isValid = await service.isValidEndpointArn(
      'endpoint-arn',
      '<some different firebase token - refreshed token>',
    );
    expect(isValid).toBe(EndpointArnStatus.INVALID_ATTRIBUTES);
  });

  it('should return NOT_FOUND if the endpoint does not exist', async () => {
    // Mock the NotFoundException to simulate non-existent endpoint
    mockSNSClient.send.mockRejectedValueOnce(
      new NotFoundException({ $metadata: {}, message: 'hi' }),
    );

    const isValid = await service.isValidEndpointArn(
      'non-existent-arn',
      '<myfirebasetoken>',
    );

    expect(isValid).toBe(EndpointArnStatus.NOT_FOUND);
    expect(mockSNSClient.send).toHaveBeenCalledTimes(1);
  });

  it('should re-throw the error if an unexpected error occurs', async () => {
    // Mock an unexpected error
    const error = new Error('Something went wrong');
    mockSNSClient.send.mockRejectedValueOnce(error);

    await expect(
      service.isValidEndpointArn('endpoint-arn', 'firebase-token'),
    ).rejects.toThrow(error);
  });
  it('should create a platform application endpoint', async () => {
    // Mock the successful response of CreatePlatformEndpointCommand
    mockSNSClient.send.mockResolvedValueOnce(mockCreateEndpoint);

    const endpointArn = await service.createPlatformApplicationEndpoint(
      'firebase-token',
      'platform-application-arn',
    );

    expect(endpointArn).toBe('my endpoint arn');
    expect(mockSNSClient.send).toHaveBeenCalledTimes(1);
    expect(mockSNSClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        constructor: expect.any(Function),
        input: {
          PlatformApplicationArn: 'platform-application-arn',
          Token: 'firebase-token',
        },
      }),
    );
  });

  it('should throw an error if the endpoint creation fails', async () => {
    // Mock an error response to simulate failed endpoint creation
    const error = new Error('Endpoint creation failed');
    mockSNSClient.send.mockRejectedValueOnce(error);

    await expect(
      service.createPlatformApplicationEndpoint('firebase-token'),
    ).rejects.toThrowError('Endpoint creation failed');
  });

  it('should update the endpoint attributes', async () => {
    // Mock the successful response of SetEndpointAttributesCommand
    mockSNSClient.send.mockResolvedValueOnce(
      {} as SetEndpointAttributesCommandOutput,
    );

    await service.updateEndpointAttributes(
      'endpoint-arn',
      'new-firebase-token',
    );

    expect(mockSNSClient.send).toHaveBeenCalledTimes(1);
    expect(mockSNSClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        constructor: expect.any(Function),
        input: {
          EndpointArn: 'endpoint-arn',
          Attributes: {
            Enabled: 'true',
            Token: 'new-firebase-token',
          },
        },
      }),
    );
  });

  it('should delete the endpoint', async () => {
    // Mock the successful response of DeleteEndpointCommand
    mockSNSClient.send.mockResolvedValueOnce({} as DeleteEndpointCommandOutput);

    await service.deleteEndpoint('endpoint-arn');

    expect(mockSNSClient.send).toHaveBeenCalledTimes(1);
    expect(mockSNSClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        constructor: expect.any(Function),
        input: {
          EndpointArn: 'endpoint-arn',
        },
      }),
    );
  });

  it('should subscribe the endpoint to the topic', async () => {
    // Mock the successful response of SubscribeCommand
    mockSNSClient.send.mockResolvedValueOnce({
      SubscriptionArn: 'subscription-arn',
    } as SubscribeCommandOutput);

    const result = await service.subscribeEndpointToTopic(
      'endpoint-arn',
      'topic-arn',
    );

    expect(mockSNSClient.send).toHaveBeenCalledTimes(1);
    expect(mockSNSClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          TopicArn: 'topic-arn',
          Protocol: 'application',
          Endpoint: 'endpoint-arn',
          ReturnSubscriptionArn: true,
        },
      }),
    );
    expect(result).toEqual({
      topicArn: 'topic-arn',
      subscriptionArn: 'subscription-arn',
    });
  });

  it('should unsubscribe the endpoint from the topic', async () => {
    // Mock the successful response of UnsubscribeCommand
    mockSNSClient.send.mockResolvedValueOnce({} as UnsubscribeCommandOutput);

    const response = await service.unsubscribeEndpointFromTopic(
      'subscription-arn',
    );

    expect(mockSNSClient.send).toHaveBeenCalledTimes(1);
    expect(mockSNSClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        constructor: expect.any(Function),
        input: {
          SubscriptionArn: 'subscription-arn',
        },
      }),
    );
    expect(response).toEqual({});
  });

  it('should return an array of matching topic ARNs', async () => {
    // Mock the response of ListTopicsCommand
    mockSNSClient.send.mockResolvedValueOnce(mockListTopicsResponse);

    const result = await service.getTopicArnsFromNames(['topic1', 'topic3']);

    expect(mockSNSClient.send).toHaveBeenCalledTimes(1);
    expect(mockSNSClient.send).toHaveBeenCalledWith(expect.any(Object));
    expect(result).toEqual([
      'arn:aws:sns:ap-southeast-1:123456123456:topic1',
      'arn:aws:sns:ap-southeast-1:123456123456:topic3',
    ]);
  });
});
