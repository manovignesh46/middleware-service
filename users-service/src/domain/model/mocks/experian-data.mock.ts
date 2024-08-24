import { ExperianRequestType } from '../../enum/experian-request-type.enum';
import { IdType } from '../../enum/id-type.enum';
import { KycEnquiryDto } from '../../services/experian-service.interface';
import { IExperianData } from '../experian-data.interface';

export const mockExperianData: IExperianData = {
  id: '1ebe50a7-e1d9-4aa4-89c3-41f9a5e93e61',
  idValue: 'customer123',
  idType: IdType.CUSTOMER,
  requestBody: JSON.stringify({
    data: { hello: 'world' },
    authorisationHeaders: { some: 'auth' },
  }),
  clientReferenceNumber: 'req123',
  requestType: ExperianRequestType.KYCV4,
  responseStatusCode: '200',
  experianData: JSON.stringify({ data: 'hello', status: 200 }),
  latency: 20,
  createdAt: new Date('01 Jan 1990'),
  updatedAt: new Date(Date.now()),
  isDataSentToLOS: false,
  isActive: true,
};

export const mockKycEnquiryDto: KycEnquiryDto = {
  idType: IdType.CUSTOMER,
  idValue: 'customer123',
  nationalIdNumber: 'nin123',
  isConsent: true,
};
