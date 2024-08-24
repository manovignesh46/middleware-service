import { mockWhitelistedStudentDetails } from '../../../domain/model/mocks/whitelisted-student-details.mock';
import { IWhitelistedStudentDetails } from '../../../domain/model/whitelistedStudentDetails.interface';
import { IWhitelistedStudentDetailsRepository } from '../../../domain/repository/whitelistedStudentDetailsRepository.interface';

export const mockWhitelistedStudentDetailsRepository: IWhitelistedStudentDetailsRepository =
  {
    save: function (
      whitelistStudentDetails: IWhitelistedStudentDetails,
    ): Promise<IWhitelistedStudentDetails> {
      return Promise.resolve(whitelistStudentDetails);
    },
    findAllStudentsByLeadId: function (
      leadId: string,
    ): Promise<IWhitelistedStudentDetails[]> {
      return Promise.resolve([{ ...mockWhitelistedStudentDetails, leadId }]);
    },
    removeStudentDetails: function (
      whitelistedStudentDetails: IWhitelistedStudentDetails,
    ): Promise<IWhitelistedStudentDetails> {
      return Promise.resolve(mockWhitelistedStudentDetails);
    },
    findStudentByLeadIdAndStudentId: function (
      leadId: string,
      studentId: string,
    ): Promise<IWhitelistedStudentDetails> {
      return Promise.resolve(mockWhitelistedStudentDetails);
    },
    findStudentByLeadIdAndStudentRegNumberAndSchoolCode: function (
      leadId: string,
      studentSchoolRegnNumber: string,
      studentSchoolCode: string,
    ): Promise<IWhitelistedStudentDetails> {
      return Promise.resolve(mockWhitelistedStudentDetails);
    },
    findByPaymentCodeInRegNumber: function (
      leadId: string,
      paymentCode: string,
    ): Promise<IWhitelistedStudentDetails> {
      return Promise.resolve(mockWhitelistedStudentDetails);
    },
    findByRegNumberInPaymentCode: function (
      leadId: string,
      regNumber: string,
    ): Promise<IWhitelistedStudentDetails> {
      return Promise.resolve(mockWhitelistedStudentDetails);
    },
  };
