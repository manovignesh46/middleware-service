import { IBase } from './base.interface';
import { ApplicationStatus } from '../enum/application-status.enum';

export interface IRequestToLOS extends IBase {
  id: string;
  customerId: string;
  secondaryUUID: string;
  applicationStatus: ApplicationStatus;
  dataToCRM: string;
  respFromCRM: string;
}
