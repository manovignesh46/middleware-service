export class StudentDetailsDTO {
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
  studentGender: string;
  studentClass: string;
  studentSchoolCode: string;
  schoolName: string;
  currentSchoolFees: number;
  minPayableMode: string;
  minPayableAmount: number;
  studentPaymentCode: string;
  studentPCOId: string;
  isCustomerConfirmed: boolean;
  isStudentDeleted: boolean;
  isLOSUpdated: boolean;
  isLOSDeleted: boolean;
}
