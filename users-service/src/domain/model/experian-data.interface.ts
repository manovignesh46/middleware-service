import { ExperianRequestType } from '../enum/experian-request-type.enum';
import { IdType } from '../enum/id-type.enum';
import { IBase } from './base.interface';

export interface IExperianData extends IBase {
  id: string;
  idType: IdType;
  idValue: string;
  clientReferenceNumber: string;
  requestBody: string;
  requestType: ExperianRequestType;
  responseStatusCode: string;
  experianData: string;
  isDataSentToLOS: boolean;
  isActive: boolean;
  latency: number;
}
