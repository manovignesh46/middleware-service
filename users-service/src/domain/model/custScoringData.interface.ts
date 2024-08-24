import { IBase } from './base.interface';

export interface ICustScoringData extends IBase {
  id: string;
  leadId: string;
  employmentNature: string;
  monthlyGrossIncome: string;
  activeBankAccount: string;
  yearsInCurrentPlace: string;
  maritalStatus: string;
  numberOfSchoolKids: string;
  creditScore: number;
  prequalifiedAmount: string;
}
