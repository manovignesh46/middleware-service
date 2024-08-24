export class LOSStudentDetailsDto {
  custId: string;
  losRefNumber: string;
  studentId: string;
  studentPCOId: string;
  createdAt: Date;

  constructor(
    custId: string,
    losRefNumber: string,
    studentId: string,
    studentPCOId: string,
    createdAt: Date,
  ) {
    this.custId = custId;
    this.losRefNumber = losRefNumber;
    this.studentId = studentId;
    this.studentPCOId = studentPCOId;
    this.createdAt = createdAt;
  }
}
