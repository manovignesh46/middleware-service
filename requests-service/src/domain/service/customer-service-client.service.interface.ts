import { CustomerIdCardDetailsDTO } from '../../infrastructure/controllers/requests/dtos/customerIdCardDetails.dto';
import { OfferDetailsDTO } from '../../infrastructure/controllers/requests/dtos/offerDetails.dto';
import { SelfieLivenessDTO } from '../../infrastructure/controllers/requests/dtos/selfieLiveness.dto';
import { StudentDetailsDTO } from '../../infrastructure/controllers/requests/dtos/studentDetails.dto';

export abstract class ICustomerServiceClient {
  abstract getMsisdn(customerId: string): Promise<{
    msisdnCountryCode: string;
    msisdn: string;
    preferredName: string;
    platformApplicationEndpoint: string;
    availableCreditLimit: number;
  }>;
  abstract getTargetApiUUID(customerId: string): Promise<string>;
  abstract getIdCardDetails(
    customerId: string,
  ): Promise<CustomerIdCardDetailsDTO>;
  abstract getCustomerSelfieLiveness(
    customerId: string,
  ): Promise<SelfieLivenessDTO>;
  abstract getOfferDetails(offerId: string): Promise<OfferDetailsDTO>;
  abstract getStudentDetails(
    studentPCOId: string,
    custId: string,
  ): Promise<StudentDetailsDTO>;

  abstract terminateOngoingLoan(custId: string): Promise<boolean>;
}
