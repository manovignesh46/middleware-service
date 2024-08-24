import { randomUUID } from 'crypto';
import { DedupStatus } from '../../enum/dedupStatus.enum';
import { ICustDedup } from '../custDedup.interface';

export const mockCustDedup: ICustDedup = {
  id: randomUUID(),
  leadId: randomUUID(),
  dedupRefNumber: randomUUID(),
  dedupStatus: DedupStatus.WIP,
  msisdn: '+256999999999',
  nationalIdNumber: '999999999',
  email: 'abc@abc.com',
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now()),
};
