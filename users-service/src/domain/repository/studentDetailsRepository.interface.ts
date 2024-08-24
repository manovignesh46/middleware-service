import { IStudentDetails } from '../model/studentDetails.interface';

export abstract class IStudentDetailsRepository {
  abstract findByStudentUUID(studentId: any): Promise<IStudentDetails>;
  abstract countByAggregatorId(aggregatorId: string): Promise<number>;
  abstract countByCustomerIdAggregatorId(
    custId: string,
    aggregatorId: string,
  ): Promise<number>;
  abstract save(studentDetails: IStudentDetails): Promise<IStudentDetails>;

  abstract findByStudentIdCustId(
    studentId: string,
    studentAssociatedWith: string,
  ): Promise<IStudentDetails>;

  abstract findStudentByCustId(
    studentAssociatedWith: string,
  ): Promise<IStudentDetails[]>;

  abstract findByStudentIdCustIdRegID(
    studentId: string,
    studentAssociatedWith: string,
    studentSchoolRegnNumber: string,
  ): Promise<IStudentDetails>;

  abstract findBySchoolCodeCustIdRegId(
    studentSchoolCode: string,
    studentAssociatedWith: string,
    studentSchoolRegnNumber: string,
  ): Promise<IStudentDetails>;

  abstract findByPCOIdAndCustId(
    studentPCOId: string,
    associatedCustomerId: string,
  ): Promise<IStudentDetails>;
}
