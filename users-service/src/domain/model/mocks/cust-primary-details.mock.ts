import { randomUUID } from 'crypto';
import { ClientStatus } from '../../enum/clientStatus.enum';
import { ClientType } from '../../enum/clientType.enum';
import { IdCardStatus } from '../../enum/id-card-status.enum';
import { ICustPrimaryDetails } from '../custPrimaryDetails.interface';

export const mockCustPrimaryDetails: ICustPrimaryDetails = {
  id: '8ec69ca8-373a-49bb-b610-e3b52fbdf35c',
  leadId: randomUUID(),
  cognitoId: 'cognitoId123',
  clientType: ClientType.CLIENT,
  clientStatus: ClientStatus.ACTIVE,
  msisdnCountryCode: '+256',
  msisdn: '999999999',
  nationalIdNumber: '999999999',
  email: 'abc@abc.com',
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now()),
  surname: null,
  givenName: null,
  nationality: null,
  gender: null,
  dateOfBirth: undefined,
  NINOCR: null,
  cardNumber: null,
  dateOfExpiry: undefined,
  scannedImageFront: null,
  scannedImageBack: null,
  selfieImage: null,
  faceMatchPercentage: null,
  faceMatchStatus: null,
  liveliessCheckPercenatge: null,
  livelinessCheckStatus: null,
  totalLoans: 0,
  creditExpiryTime: undefined,
  preferredName: 'Johnny Bravo',
  idExpiryDays: 100,
  idStatus: IdCardStatus.ACTIVE,
  smsNextHours: 0,
  optOutReason: '',
  optOutFeedback: '',
  optOutDate: undefined,
  availableCreditLimit: 1100,
};
