import { SchoolAggregatorGetStudentDetailsRequestDto } from '../../infrastructure/controllers/customers/dtos/retrieveStudentDetails.dto';
import { IStudentDetails } from '../model/studentDetails.interface';

export abstract class ISchoolAggregatorService {
  abstract retrieveStudentDetails(
    schoolAggregatorGetStudentDetailsRequestDto: SchoolAggregatorGetStudentDetailsRequestDto,
  ): Promise<IStudentDetails>;
}
