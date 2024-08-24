import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../../../domain/enum/gender.enum';
import { IStudentDetails } from '../../../../domain/model/studentDetails.interface';
import { IWhitelistedStudentDetails } from '../../../../domain/model/whitelistedStudentDetails.interface';

export class RetrieveStudentDetailsPresenter {
  @ApiProperty()
  studentId: string;

  @ApiProperty()
  studentName: string;

  @ApiProperty()
  schoolCode: string;

  @ApiProperty()
  schoolName: string;

  @ApiProperty()
  studentRegnNumber: string;

  @ApiProperty()
  aggregatorId: string;

  @ApiProperty()
  studentClass: string;

  @ApiProperty()
  studentGender: Gender;

  @ApiProperty()
  currentFees: number;

  @ApiProperty()
  studentPCOId: string;

  @ApiProperty()
  paymentCode: string;

  schoolNameComparisonFailed: boolean;

  constructor(
    studentId: string,
    studentName: string,
    schoolCode: string,
    schoolName: string,
    studentRegnNumber: string,
    studentClass: string,
    studentGender: Gender,
    currentFees: number,
    studentPCOId: string,
    aggregatorId: string,
    paymentCode: string,
    schoolNameComparisonFailed: boolean,
  ) {
    this.studentId = studentId;
    this.studentName = studentName;
    this.schoolCode = schoolCode;
    this.schoolName = schoolName;
    this.studentRegnNumber = studentRegnNumber;
    this.studentClass = studentClass;
    this.studentGender = studentGender;
    this.currentFees = currentFees;
    this.studentPCOId = studentPCOId;
    this.aggregatorId = aggregatorId;
    this.paymentCode = paymentCode;
    this.schoolNameComparisonFailed = schoolNameComparisonFailed;
  }

  static studentDetailsPresenter(
    studentDetailsList: IStudentDetails[],
  ): RetrieveStudentDetailsPresenter[] {
    const presenterList: RetrieveStudentDetailsPresenter[] = [];
    for (const studentDetails of studentDetailsList) {
      const presenter = new RetrieveStudentDetailsPresenter(
        studentDetails.studentId,
        studentDetails.studentFullName,
        studentDetails.studentSchoolCode,
        studentDetails.schoolName,
        studentDetails.studentSchoolRegnNumber,
        studentDetails.studentClass,
        studentDetails.studentGender,
        studentDetails.currentSchoolFees,
        studentDetails.studentPCOId,
        studentDetails.aggregatorId,
        studentDetails.studentPaymentCode,
        false,
      );

      presenterList.push(presenter);
    }
    return presenterList;
  }

  static whitelistedStudentDetailsPresenter(
    whitelistedStudentDetailsList: IWhitelistedStudentDetails[],
  ): RetrieveStudentDetailsPresenter[] {
    const presenterList: RetrieveStudentDetailsPresenter[] = [];
    if (whitelistedStudentDetailsList) {
      for (const whitelistedStudentDetails of whitelistedStudentDetailsList) {
        const presenter = new RetrieveStudentDetailsPresenter(
          whitelistedStudentDetails.studentId,
          whitelistedStudentDetails.studentFullName,
          whitelistedStudentDetails.studentSchoolCode,
          whitelistedStudentDetails.schoolName
            ? whitelistedStudentDetails.schoolName
            : '',
          whitelistedStudentDetails.studentSchoolRegnNumber,
          whitelistedStudentDetails.studentClass,
          whitelistedStudentDetails.studentGender
            ? whitelistedStudentDetails.studentGender
            : undefined,
          whitelistedStudentDetails.currentSchoolFees
            ? whitelistedStudentDetails.currentSchoolFees
            : undefined,
          whitelistedStudentDetails.studentPCOId
            ? whitelistedStudentDetails.studentPCOId
            : '',
          whitelistedStudentDetails.aggregatorId,
          whitelistedStudentDetails?.studentPaymentCode,
          false,
        );

        presenterList.push(presenter);
      }
    }

    return presenterList;
  }
}
