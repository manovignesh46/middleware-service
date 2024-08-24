import { stringList } from 'aws-sdk/clients/datapipeline';
import { IBase } from './base.interface';

export interface IWhitelistedSchool extends IBase {
  id: string;
  schoolName: string;
  district: string;
  emisCode: number;
  countryCode: string;
}
