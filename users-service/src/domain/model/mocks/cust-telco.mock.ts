import { randomUUID } from 'crypto';
import { MatchStatus } from '../../enum/matchStatus.enum';
import { ICustTelco } from '../custTelco.interface';
import { IdType } from '../../enum/id-type.enum';
import { Gender } from '../../enum/gender.enum';

export const mockCustTelco: ICustTelco = {
  id: randomUUID(),
  idValue: '123',
  telcoId: '1234567',
  firstName: 'HAROLD',
  lastName: 'WANYAMA',
  msisdn: '874274234',
  nationalIdNumber: 'CM8105110600CH',
  middleName: 'jakdhasud',
  isBarred: true,
  registrationType: 'reg',
  ninComparison: MatchStatus.MATCHED,
  createdAt: new Date(),
  updatedAt: new Date(),
  idType: IdType.LEAD,
  gender: Gender.MALE,
  givenName: 'abcdef',
  msisdnCountryCode: '+256',
  dob: '01/08/1997',
  registrationDate: '01/12/2022',
  nationality: 'UG',
  isDataSentToLOS: false,
  idExpiry: undefined,
};

export const mockCustTelcoNotMatched: ICustTelco = {
  ...mockCustTelco,
  ninComparison: MatchStatus.NOT_MATCHED,
};
