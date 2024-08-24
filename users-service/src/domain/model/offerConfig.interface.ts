import { IBase } from './base.interface';

export interface IOfferConfig extends IBase {
  offerId: string;
  offerName: string;
  offerDescription: string;
  offerImage: string;
  offerProvider: string;
  activeStatus: string;
  tenure: number;
  roi: string;
  noOfInstallment: string;
  repaymentFrequency: string;
  offerLimit: number;
  applicationFee: string;
}
