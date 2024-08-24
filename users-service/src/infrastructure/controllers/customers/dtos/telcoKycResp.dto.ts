import { stringList } from 'aws-sdk/clients/datapipeline';

export class TelcoKYCResp {
  id: number;
  countrycode: number;
  msisdn: number;
  firstname: string;
  lastname: string;
  givenname: string;
  nin: string;
  dob: string;
  gender: string;
  registration: string;
  nationality: string;
}
