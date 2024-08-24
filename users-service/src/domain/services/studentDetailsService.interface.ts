import { StatusMessagePresenter } from '../../infrastructure/controllers/common/statusMessage.presenter';
import { AddStudentDetailsDTO } from '../../infrastructure/controllers/customers/dtos/addStudentDetails.dto';
import { ConfirmStudentDetailsDto } from '../../infrastructure/controllers/customers/dtos/confirmStudentDetails.dto';
import { DeleteStudentDetailsDTO } from '../../infrastructure/controllers/customers/dtos/deleteStudentDetails.dto';
import { RetrieveStudentDetailsDto } from '../../infrastructure/controllers/customers/dtos/retrieveStudentDetails.dto';
import { ConfirmStudentDetailsPresenter } from '../../infrastructure/controllers/customers/presenters/confirmStudentDetails.presenter';
import { RetrieveStudentDetailsPresenter } from '../../infrastructure/controllers/customers/presenters/retrieveStudentDetails.presenter';
import { IOfferConfig } from '../model/offerConfig.interface';
import { IStudentDetails } from '../model/studentDetails.interface';

export abstract class IStudentDetailsService {
  abstract retrieveStudentDetails(
    retrieveStudentDetailsDto: RetrieveStudentDetailsDto,
    custId: string,
  ): Promise<RetrieveStudentDetailsPresenter>;
  abstract confirmStudentDetails(
    custId: string,
    confirmStudentDetailsDto: ConfirmStudentDetailsDto,
  ): Promise<ConfirmStudentDetailsPresenter>;
  abstract getAllStudent(
    custId: string,
  ): Promise<RetrieveStudentDetailsPresenter[]>;

  abstract deleteStudent(
    custId: string,
    deleteStudentDetailsDTO: DeleteStudentDetailsDTO,
  ): Promise<StatusMessagePresenter<null>>;

  abstract getStudentOfferDetails(offerId: string): Promise<IOfferConfig>;

  abstract getStudentDetails(
    studentPCOId: string,
    custId: string,
  ): Promise<IStudentDetails>;

  abstract getWhiteListedStudent(
    custId: string,
  ): Promise<RetrieveStudentDetailsPresenter[]>;

  abstract deleteWhitelistedStudentDetails(
    custId: string,
    studentId: string,
  ): Promise<boolean>;

  abstract addWhitelistedStudentDetails(
    custId: string,
    addStudentDetailsDTO: AddStudentDetailsDTO,
  ): Promise<boolean>;
}
