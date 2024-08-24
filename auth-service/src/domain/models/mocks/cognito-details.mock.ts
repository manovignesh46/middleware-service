import { ICognitoDetail } from '../cognito-detail.interface';
import { mockDevice } from './device.mock';

export const mockCognitoDetail: ICognitoDetail = {
  customerId: 'customerId123',
  cognitoId: 'cognitoId123',
  msisdnCountryCode: '+65',
  msisdn: '99999999',
  devices: [mockDevice],
  createdAt: new Date('2001-01-01'),
  updatedAt: new Date('2001-01-02'),
  failedLoginAttempts: 0,
  otpSentCount: 0,
  loginLockedAt: null,
  loginUnLockedAt: null,
};
