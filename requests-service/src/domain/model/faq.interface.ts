import { IBase } from './base.interface';

export interface IFAQ extends IBase {
  id: string;
  category: string;
  faq: string;
  faqAns: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}
