import { IdType } from '../enum/id-type.enum';
import { IBase } from './base.interface';

export interface ICustTelcoTransaction extends IBase {
  id: string;
  idType: IdType;
  idValue: string;
  telcoId: string;
  transactionData: string;
  isDataSentToLOS: boolean;
  isActive: boolean;
}
