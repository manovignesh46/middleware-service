import { Gender } from '../enum/gender.enum';
import { OvaProvider } from '../enum/ova-provider.enum';
import { IBase } from './base.interface';

export interface IStudentDetails extends IBase {
  studentId: string;
  associatedCustomerId: string;
  aggregatorId: string;
  requestReferenceNumber: string;
  responseStatusCode: string;
  responseStatusMessage: string;
  studentSchoolRegnNumber: string;
  studentFullName: string;
  studentFirstName: string;
  studentMiddleName: string;
  studentSurname: string;
  studentDob: Date;
  studentDateCreated: Date;
  studentGender: Gender;
  studentClass: string;
  studentSchoolCode: string;
  schoolName: string;
  currentSchoolFees: number;
  minPayableMode: string;
  minPayableAmount: number;
  isPartialPaymentAllowed: boolean;
  studentOva: string;
  ovaProvider: OvaProvider;
  mtnOva: string;
  airtelOva: string;
  studentPaymentCode: string;
  studentPCOId: string;
  isCustomerConfirmed: boolean;
  isStudentDeleted: boolean;
  isLOSUpdated: boolean;
  isLOSDeleted: boolean;
  isComputedAmount: boolean;
}
