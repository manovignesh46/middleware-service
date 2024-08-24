export abstract class ILMSService {
  abstract dashboard(productType: string, msisdn: string): Promise<any>;
  abstract getEKycState(fullMsisdn: string): Promise<any>;
  abstract getCustomerTelco(fullMsisdn: string): Promise<any>;
  abstract purgeCustomer(msisdnList: string[]): Promise<any>;
  abstract optOutCustomer(fullMsisdn: string): Promise<any>;
}
