import { IBase } from './base.interface';

export interface IRequestOperation extends IBase {
  id: string;
  custId: string;
  opName: string;
  opState: string;
  opDate: Date;
  remark: string;
}
