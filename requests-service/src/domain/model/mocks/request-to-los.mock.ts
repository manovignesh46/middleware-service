import { ApplicationStatus } from '../../enum/application-status.enum';
import { IRequestToLOS } from '../request-to-los.interface';

export const mockRequestToLOS: IRequestToLOS = {
  id: '26604d2b-8e31-4839-9f9b-18d5a45ab407',
  customerId: 'customerId123',
  secondaryUUID: 'secondaryUuid123',
  applicationStatus: ApplicationStatus.RUN_INITIATED,
  dataToCRM: '{"data": "sent to CRM}',
  respFromCRM: '{"data": "received from CRM}',
  createdAt: new Date(),
  updatedAt: new Date(),
};
