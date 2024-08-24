import { Gender } from '../../enum/gender.enum';
import { OvaProvider } from '../../enum/ova-provider.enum';
import { IStudentDetails } from '../studentDetails.interface';

export const mockStudentDetails: IStudentDetails = {
  studentId: '123456789',
  studentFullName: 'John Desmond Doe',
  studentGender: Gender.MALE,
  studentClass: '1 HOPE',
  studentSchoolCode: '123',
  studentSchoolRegnNumber: 'abcd',
  schoolName: 'Furaha University',
  associatedCustomerId: '1234',
  currentSchoolFees: 90000,
  studentPCOId: '123456789',
  createdAt: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
  updatedAt: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
  isStudentDeleted: false,
  aggregatorId: '',
  requestReferenceNumber: '',
  responseStatusCode: '',
  responseStatusMessage: '',
  studentFirstName: 'John',
  studentMiddleName: 'Desmond',
  studentSurname: 'Doe',
  studentDob: undefined,
  studentDateCreated: undefined,
  minPayableMode: '',
  minPayableAmount: 0,
  studentPaymentCode: '4567895',
  isCustomerConfirmed: false,
  isLOSUpdated: false,
  isLOSDeleted: false,
  isPartialPaymentAllowed: false,
  studentOva: '10000101',
  ovaProvider: OvaProvider.MTN,
  mtnOva: 'pegpayova123',
  airtelOva: 'schpayova123',
  isComputedAmount: false,
};

export const mockStudentDetails2: IStudentDetails = {
  studentId: 'uuidstudent123',
  associatedCustomerId: 'uuidcustomer123',
  aggregatorId: 'aggregator123',
  requestReferenceNumber: 'refNum123',
  responseStatusCode: '0',
  responseStatusMessage: 'Mock Success',
  studentSchoolRegnNumber: 'schRegNum123',
  studentFullName: 'John Dorian Doe',
  studentFirstName: 'John',
  studentMiddleName: 'Dorian',
  studentSurname: 'Doe',
  studentDob: new Date('2010-12-25'),
  studentDateCreated: new Date('2020-01-01'),
  studentGender: undefined,
  studentClass: '1 Happiness',
  studentSchoolCode: 'studentSchoolCode123',
  schoolName: 'Kampala High School',
  currentSchoolFees: 1000000,
  minPayableMode: undefined,
  minPayableAmount: undefined,
  studentPaymentCode: '1004691132',
  studentPCOId: undefined,
  isCustomerConfirmed: false,
  isStudentDeleted: false,
  isLOSUpdated: false,
  isLOSDeleted: false,
  createdAt: undefined,
  updatedAt: undefined,
  isPartialPaymentAllowed: false,
  studentOva: '10000101',
  ovaProvider: OvaProvider.MTN,
  mtnOva: 'pegpayova123',
  airtelOva: 'schpayova123',
  isComputedAmount: false,
};
