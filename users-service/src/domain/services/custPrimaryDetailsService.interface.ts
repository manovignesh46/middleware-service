import { ICustPrimaryDetails } from '../model/custPrimaryDetails.interface';

export abstract class ICustPrimaryDetailsService {
  abstract createCustPrimaryDeatils(
    custPrimaryDetails: ICustPrimaryDetails,
  ): Promise<ICustPrimaryDetails>;
  abstract findCustPrimaryDetails(
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
    email: string,
  ): Promise<ICustPrimaryDetails[]>;
}
