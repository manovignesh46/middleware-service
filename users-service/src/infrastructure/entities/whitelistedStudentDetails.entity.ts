import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from '../../domain/enum/gender.enum';
import { IWhitelistedStudentDetails } from '../../domain/model/whitelistedStudentDetails.interface';
import { BaseEntity } from './base.entity';
import { WhitelistStatus } from '../../domain/enum/whitelistStatus.enum';
import { IStudentDetails } from '../../domain/model/studentDetails.interface';

@Entity()
export class WhitelistedStudentDetails
  extends BaseEntity
  implements IWhitelistedStudentDetails
{
  @PrimaryGeneratedColumn('uuid')
  studentId: string;

  @Column({ nullable: true })
  associatedCustomerId: string;

  @Column({ nullable: true })
  aggregatorId: string;

  @Column({ nullable: true })
  requestReferenceNumber: string;

  @Column({ nullable: true })
  responseStatusCode: string;

  @Column({ nullable: true })
  responseStatusMessage: string;

  @Column({ nullable: true })
  studentSchoolRegnNumber: string;

  @Column({ nullable: true })
  studentFullName: string;

  @Column({ nullable: true })
  studentFirstName: string;

  @Column({ nullable: true })
  studentMiddleName: string;

  @Column({ nullable: true })
  studentSurname: string;

  @Column({ nullable: true })
  studentDob: Date;

  @Column({ nullable: true })
  studentDateCreated: Date;

  @Column({ nullable: true })
  studentGender: Gender;

  @Column({ nullable: true })
  studentClass: string;

  @Column({ nullable: true })
  studentSchoolCode: string;

  @Column({ nullable: true })
  schoolName: string;

  @Column({ nullable: true })
  currentSchoolFees: number;

  @Column({ nullable: true })
  minPayableMode: string;

  @Column({ nullable: true })
  minPayableAmount: number;

  @Column({ nullable: true })
  studentPaymentCode: string;

  @Column({ nullable: true })
  studentPCOId: string;

  @Column({ nullable: true })
  isCustomerConfirmed: boolean;

  @Column({ nullable: true })
  isStudentDeleted: boolean;

  @Column({ nullable: true })
  isLOSUpdated: boolean;

  @Column({ nullable: true })
  isLOSDeleted: boolean;

  @Column({ nullable: true })
  leadId: string;

  @Column({ nullable: true })
  currentStatus: WhitelistStatus;

  @Column({ type: 'float', nullable: true })
  term1Fee: number;

  @Column({ type: 'float', nullable: true })
  term2Fee: number;

  @Column({ type: 'float', nullable: true })
  term3Fee: number;

  @Column({ nullable: true })
  termsAcademicYear: string;

  @Column({ type: 'float', nullable: true })
  totalTermsFee: number;

  @Column({ type: 'float', nullable: true })
  lastPaymentAmount: number;

  @Column({ nullable: true })
  lastPaymentDate: string;

  @Column({ nullable: true })
  paymentsCount: number;

  static transformStudentDetailToWhiteListed(
    studentDetails: IStudentDetails,
    leadId: string,
  ) {
    const whitelisted = new WhitelistedStudentDetails();
    whitelisted.studentId = studentDetails.studentId;
    whitelisted.associatedCustomerId = studentDetails.associatedCustomerId;
    whitelisted.aggregatorId = studentDetails.aggregatorId;
    whitelisted.requestReferenceNumber = studentDetails.requestReferenceNumber;
    whitelisted.responseStatusCode = studentDetails.responseStatusCode;
    whitelisted.responseStatusMessage = studentDetails.responseStatusMessage;
    whitelisted.studentSchoolRegnNumber =
      studentDetails.studentSchoolRegnNumber;
    whitelisted.studentFullName = studentDetails.studentFullName;
    whitelisted.studentFirstName = studentDetails.studentFirstName;
    whitelisted.studentMiddleName = studentDetails.studentMiddleName;
    whitelisted.studentSurname = studentDetails.studentSurname;
    whitelisted.studentDob = studentDetails.studentDob;
    whitelisted.studentDateCreated = studentDetails.studentDateCreated;
    whitelisted.studentGender = studentDetails.studentGender;
    whitelisted.studentClass = studentDetails.studentClass;
    whitelisted.studentSchoolCode = studentDetails.studentSchoolCode;
    whitelisted.schoolName = studentDetails.schoolName;
    whitelisted.currentSchoolFees = studentDetails.currentSchoolFees;
    whitelisted.minPayableMode = studentDetails.minPayableMode;
    whitelisted.minPayableAmount = studentDetails.minPayableAmount;
    whitelisted.studentPaymentCode = studentDetails.studentPaymentCode;
    whitelisted.studentPCOId = studentDetails.studentPCOId;
    whitelisted.isCustomerConfirmed = studentDetails.isCustomerConfirmed;
    whitelisted.isStudentDeleted = studentDetails.isStudentDeleted;
    whitelisted.isLOSUpdated = studentDetails.isLOSUpdated;
    whitelisted.isLOSDeleted = studentDetails.isLOSDeleted;
    whitelisted.leadId = leadId;
    whitelisted.currentStatus = null;
    whitelisted.term1Fee = 0;
    whitelisted.term2Fee = 0;
    whitelisted.term3Fee = 0;
    whitelisted.termsAcademicYear = null;
    whitelisted.totalTermsFee = 0;
    whitelisted.lastPaymentAmount = 0;
    whitelisted.lastPaymentDate = null;

    return whitelisted;
  }
}
