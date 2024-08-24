import { ICustPrimaryDetails } from '../model/custPrimaryDetails.interface';

export abstract class ICustPrimaryDetailsRepository {
  abstract getByCustomerId(customerId: string): Promise<ICustPrimaryDetails>;
  abstract create(
    custPrimaryDetails: ICustPrimaryDetails,
  ): Promise<ICustPrimaryDetails>;

  abstract findByMsisdn(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<ICustPrimaryDetails>;
  abstract findByNinMsisdnEmail(
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
    email: string,
  ): Promise<ICustPrimaryDetails[]>;
  abstract findByNinMsisdn(
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<ICustPrimaryDetails>;
  abstract getCustomerByLeadId(leadId: string): Promise<ICustPrimaryDetails>;
  abstract deleteCustomer(customerId: string): Promise<ICustPrimaryDetails>;
  abstract getCustomerByCustomerId(id: string): Promise<ICustPrimaryDetails>;
  abstract updateCustomer(
    customer: ICustPrimaryDetails,
  ): Promise<ICustPrimaryDetails>;
  abstract getByEmail(
    email: string,
    custId: string,
  ): Promise<ICustPrimaryDetails>;
  abstract getZeroLoansCust(): Promise<ICustPrimaryDetails[]>;
  abstract decrementIdExpiryDays(): Promise<void>;
  abstract getCustomersByIdExpiryDaysList(): Promise<ICustPrimaryDetails[]>;
  abstract setExpiredIdStatus(): Promise<void>;
}
