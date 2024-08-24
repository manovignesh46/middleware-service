import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { AxiosResponse } from 'axios';
import { ResponseStatusCode } from '../../../domain/enum/responseStatusCode.enum';
import { AuthServiceClient } from './auth-service-client.service';
import { mockDevice } from './mocks/device.mock';

jest.mock('@nestjs/axios');

describe('AuthServiceClient', () => {
  let authServiceClient: AuthServiceClient;
  const httpService: HttpService = createMock<HttpService>();
  const configService: ConfigService = createMock<ConfigService>();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(configService, 'get').mockImplementation((envName) => {
      switch (envName) {
        case 'AUTH_SERVICE_HOSTNAME':
          return 'http://localhost:3000/v1';

        case 'INTERNAL_API_KEY':
          return 'api-password';

        default:
          break;
      }
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthServiceClient,
        { provide: HttpService, useValue: httpService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    authServiceClient = module.get<AuthServiceClient>(AuthServiceClient);
  });

  describe('getDevices', () => {
    const customerId = 'customerId123';
    it('should send a notification successfully', async () => {
      const response = {
        data: {
          status: ResponseStatusCode.SUCCESS,
          data: {
            deviceList: [{ ...mockDevice }],
          },
        },
      } as AxiosResponse;
      const spy = jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(of(response));
      await authServiceClient.getDevices(customerId);
      expect(spy).toHaveBeenCalledWith(
        `http://localhost:3000/v1/auth/internal/list-devices/${customerId}`,
        { headers: { 'internal-api-key': 'api-password' } },
      );
    });

    it('should handle error response', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          status: 500,
          message: 'Some Error With Auth Service',
        },
      } as AxiosResponse;
      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse));

      const response = authServiceClient.getDevices(customerId);
      // Act
      await expect(response).rejects.toThrow(mockResponse.data.message);
    });

    it('should handle network error', async () => {
      const error = new Error('Network error');
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => {
        throw error;
      });

      await expect(authServiceClient.getDevices(customerId)).rejects.toThrow(
        error,
      );
    });
  });
});
