import { Injectable, Logger } from '@nestjs/common';
import { IStudentDetails } from '../../domain/model/studentDetails.interface';
import { ISchoolAggregatorService } from '../../domain/services/schoolAggregatorService.interface';
import { PegpayGetStudentDetailsResponseDto } from '../controllers/customers/dtos/pegpay-get-student-details.response.dto';
import { RetrievePegPayStudentDetailsDto } from '../controllers/customers/dtos/retrieveStudentDetails.dto';
import { StudentDetails } from '../entities/studentDetails.entity';
import { SoapService } from './soap-client.service';

@Injectable()
export class PegPaySchoolAggregator implements ISchoolAggregatorService {
  constructor(private readonly soapService: SoapService) {}
  private logger = new Logger(PegPaySchoolAggregator.name);
  async retrieveStudentDetails(
    retrievePegPayStudentDetailsDto: RetrievePegPayStudentDetailsDto,
  ): Promise<IStudentDetails> {
    this.logger.log(this.retrieveStudentDetails.name);
    const pegpayGetStudentDetailsResponseDto: PegpayGetStudentDetailsResponseDto =
      await this.soapService.retrievePegPayStudentDetails(
        retrievePegPayStudentDetailsDto.studentRegnNumber,
        retrievePegPayStudentDetailsDto.schoolCode,
      );

    const studentDetails: IStudentDetails =
      StudentDetails.transformPegpayGetStudentDetailsResponseDtoToStudentDetailsEntity(
        pegpayGetStudentDetailsResponseDto,
      );

    if (studentDetails.responseStatusCode === '0') {
      studentDetails.studentSchoolCode =
        retrievePegPayStudentDetailsDto.schoolCode;
    }

    this.logger.debug(studentDetails);
    return studentDetails;
  }
}
