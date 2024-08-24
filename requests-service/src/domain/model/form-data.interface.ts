import { FormType } from '../enum/form-type.enum';
import { IBase } from './base.interface';

export interface IFormData extends IBase {
  id: string;
  customerId: string;
  fullMsisdn: string;
  loanId: string;
  typeId: string;
  formData: string;
  formType: FormType;
  formStatus: string;
  s3Bucket: string;
  s3DocPath: string;
  s3PresignedUrl: string;
  s3UrlUpdatedAt: Date;
  requestCount: number;
  createdBy: string;
  updatedBy: string;
}
