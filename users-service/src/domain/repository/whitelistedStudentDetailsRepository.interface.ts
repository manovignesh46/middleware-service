import { IWhitelistedStudentDetails } from '../model/whitelistedStudentDetails.interface';

export abstract class IWhitelistedStudentDetailsRepository {
  abstract save(
    whitelistStudentDetails: IWhitelistedStudentDetails,
  ): Promise<IWhitelistedStudentDetails>;
  abstract findAllStudentsByLeadId(
    leadId: string,
  ): Promise<IWhitelistedStudentDetails[]>;

  abstract findStudentByLeadIdAndStudentId(
    leadId: string,
    studentId: string,
  ): Promise<IWhitelistedStudentDetails>;

  abstract removeStudentDetails(
    whitelistedStudentDetails: IWhitelistedStudentDetails,
  ): Promise<IWhitelistedStudentDetails>;

  abstract findStudentByLeadIdAndStudentRegNumberAndSchoolCode(
    leadId: string,
    studentSchoolRegnNumber: string,
    studentSchoolCode: string,
  ): Promise<IWhitelistedStudentDetails>;

  abstract findByPaymentCodeInRegNumber(
    leadId: string,
    paymentCode: string,
  ): Promise<IWhitelistedStudentDetails>;

  abstract findByRegNumberInPaymentCode(
    leadId: string,
    regNumber: string,
  ): Promise<IWhitelistedStudentDetails>;
}
