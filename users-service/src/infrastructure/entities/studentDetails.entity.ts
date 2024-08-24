import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IStudentDetails } from '../../domain/model/studentDetails.interface';
import { BaseEntity } from './base.entity';
import { Gender } from '../../domain/enum/gender.enum';
import { ValidateStudentAccountSunlyteDto } from '../controllers/customers/dtos/validate-student-account-sunlyte.dto';
import { PegpayGetStudentDetailsResponseDto } from '../controllers/customers/dtos/pegpay-get-student-details.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { OvaProvider } from '../../domain/enum/ova-provider.enum';

@Entity()
export class StudentDetails extends BaseEntity implements IStudentDetails {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  studentId: string;

  @Column()
  @ApiProperty()
  associatedCustomerId: string;

  @Column({ nullable: true })
  @ApiProperty()
  aggregatorId: string;

  @Column({ nullable: true })
  @ApiProperty()
  requestReferenceNumber: string;

  @Column({ nullable: true })
  @ApiProperty()
  responseStatusCode: string;

  @Column({ nullable: true })
  @ApiProperty()
  responseStatusMessage: string;

  @Column({ nullable: true })
  @ApiProperty()
  studentSchoolRegnNumber: string;

  @Column({ nullable: true })
  @ApiProperty()
  studentFullName: string;

  @Column({ nullable: true })
  @ApiProperty()
  studentFirstName: string;

  @Column({ nullable: true })
  @ApiProperty()
  studentMiddleName: string;

  @Column({ nullable: true })
  @ApiProperty()
  studentSurname: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  studentDob: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty()
  studentDateCreated: Date;

  @Column({ nullable: true })
  @ApiProperty()
  studentGender: Gender;

  @Column({ nullable: true })
  @ApiProperty()
  studentClass: string;

  @Column({ nullable: true })
  @ApiProperty()
  studentSchoolCode: string;

  @Column({ nullable: true })
  @ApiProperty()
  schoolName: string;

  @Column({ nullable: true })
  @ApiProperty()
  currentSchoolFees: number;

  @Column({ nullable: true })
  @ApiProperty()
  minPayableMode: string;

  @Column({ type: 'bigint', nullable: true })
  @ApiProperty()
  minPayableAmount: number;

  @Column({ nullable: true })
  @ApiProperty()
  studentPaymentCode: string;

  @Column({ default: false })
  @ApiProperty()
  isCustomerConfirmed: boolean;

  @Column({ default: false })
  @ApiProperty()
  isStudentDeleted: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  studentPCOId: string;

  @Column({ default: false })
  @ApiProperty()
  isLOSUpdated: boolean;

  @Column({ default: false })
  @ApiProperty()
  isLOSDeleted: boolean;

  @Column({ default: true })
  isPartialPaymentAllowed: boolean;

  @Column({ nullable: true })
  studentOva: string;

  @Column({ enum: OvaProvider, nullable: true })
  ovaProvider: OvaProvider;

  @Column({ nullable: true })
  mtnOva: string;

  @Column({ nullable: true })
  airtelOva: string;

  @Column({ nullable: true, default: false })
  isComputedAmount: boolean;

  static transformPegpayGetStudentDetailsResponseDtoToStudentDetailsEntity(
    pegPayGetStudentDetailsResponseDto: PegpayGetStudentDetailsResponseDto,
  ): IStudentDetails {
    const studentDetails = new StudentDetails();
    studentDetails.studentFullName =
      pegPayGetStudentDetailsResponseDto.customerName;
    studentDetails.studentSchoolRegnNumber =
      pegPayGetStudentDetailsResponseDto.customerRef;
    studentDetails.schoolName = pegPayGetStudentDetailsResponseDto.schoolName;
    studentDetails.responseStatusCode =
      pegPayGetStudentDetailsResponseDto.statusCode;
    studentDetails.responseStatusMessage =
      pegPayGetStudentDetailsResponseDto.statusDescription;
    studentDetails.studentPaymentCode =
      pegPayGetStudentDetailsResponseDto.pegpayTranId || null;
    studentDetails.studentGender =
      pegPayGetStudentDetailsResponseDto.gender == 'Male'
        ? Gender.MALE
        : Gender.FEMALE;

    studentDetails.isPartialPaymentAllowed =
      pegPayGetStudentDetailsResponseDto.allowPartialPayments === '1';
    studentDetails.studentOva = pegPayGetStudentDetailsResponseDto.studentOva;
    studentDetails.studentClass =
      pegPayGetStudentDetailsResponseDto.studentLevelDescription;

    if (!isNaN(+pegPayGetStudentDetailsResponseDto.outstandingBalance)) {
      studentDetails.currentSchoolFees =
        +pegPayGetStudentDetailsResponseDto.outstandingBalance;
    }
    if (!isNaN(+pegPayGetStudentDetailsResponseDto.minimumPaymentAmount)) {
      studentDetails.minPayableAmount =
        +pegPayGetStudentDetailsResponseDto.minimumPaymentAmount;
    }
    return studentDetails;
  }

  static transformValidateStudentAccountSunlyteDtoToStudentDetailsEntity(
    validateStudentAccountResponseDto: ValidateStudentAccountSunlyteDto,
  ) {
    let studentFullName = validateStudentAccountResponseDto?.OUT_FIRST_NAME;
    if (validateStudentAccountResponseDto?.OUT_MIDDLE_NAME) {
      studentFullName +=
        ' ' + validateStudentAccountResponseDto?.OUT_MIDDLE_NAME;
    }
    if (validateStudentAccountResponseDto?.OUT_SURNAME) {
      studentFullName += ' ' + validateStudentAccountResponseDto?.OUT_SURNAME;
    }

    const studentDetails = new StudentDetails();

    //Transform to studentDetails
    studentDetails.responseStatusCode =
      validateStudentAccountResponseDto?.responseStatusCode;
    studentDetails.responseStatusMessage =
      validateStudentAccountResponseDto?.responseStatusMessage;
    studentDetails.studentFullName = studentFullName;
    studentDetails.studentFirstName =
      validateStudentAccountResponseDto?.OUT_FIRST_NAME;
    studentDetails.studentMiddleName =
      validateStudentAccountResponseDto?.OUT_MIDDLE_NAME;
    studentDetails.studentSurname =
      validateStudentAccountResponseDto?.OUT_SURNAME;
    studentDetails.studentSchoolRegnNumber =
      validateStudentAccountResponseDto?.OUT_STUDENT_REGISTRATION_NUMBER;
    studentDetails.studentClass =
      validateStudentAccountResponseDto?.OUT_STUDENT_CLASS;
    studentDetails.studentPaymentCode =
      validateStudentAccountResponseDto?.OUT_STUDENT_PAYMENT_CODE;
    studentDetails.schoolName =
      validateStudentAccountResponseDto?.OUT_SCHOOL_NAME;
    studentDetails.studentSchoolCode =
      validateStudentAccountResponseDto?.OUT_SCHOOL_CODE;
    if (validateStudentAccountResponseDto?.OUT_OUTSTANDING_BALANCE) {
      studentDetails.currentSchoolFees = parseFloat(
        validateStudentAccountResponseDto.OUT_OUTSTANDING_BALANCE,
      );
    }
    if (validateStudentAccountResponseDto?.OUT_DATE_CREATED) {
      studentDetails.studentDateCreated = new Date(
        validateStudentAccountResponseDto.OUT_DATE_CREATED,
      );
    }
    if (validateStudentAccountResponseDto?.OUT_DATE_OF_BIRTH) {
      studentDetails.studentDob = new Date(
        validateStudentAccountResponseDto.OUT_DATE_OF_BIRTH,
      );
    }

    //parse student OVA
    if (validateStudentAccountResponseDto?.AIRTEL_OVA) {
      studentDetails.airtelOva = validateStudentAccountResponseDto?.AIRTEL_OVA;
    }
    if (validateStudentAccountResponseDto?.MTN_OVA) {
      studentDetails.mtnOva = validateStudentAccountResponseDto?.MTN_OVA;
    }

    //parse gender
    if (validateStudentAccountResponseDto?.OUT_STUDENT_GENDER === 'MALE') {
      studentDetails.studentGender = Gender.MALE;
    }
    if (validateStudentAccountResponseDto?.OUT_STUDENT_GENDER === 'FEMALE') {
      studentDetails.studentGender = Gender.FEMALE;
    }
    return studentDetails;
  }
}
