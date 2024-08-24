import { Injectable, Logger } from '@nestjs/common';
import { IStudentDetails } from '../../domain/model/studentDetails.interface';
import { ISchoolAggregatorService } from '../../domain/services/schoolAggregatorService.interface';
import { RetrieveSchoolPayStudentDetailsDto } from '../controllers/customers/dtos/retrieveStudentDetails.dto';
import { ValidateStudentAccountSunlyteDto } from '../controllers/customers/dtos/validate-student-account-sunlyte.dto';
import { StudentDetails } from '../entities/studentDetails.entity';
import { SoapService } from './soap-client.service';

@Injectable()
export class SchoolPaySchoolAggregatorService
  implements ISchoolAggregatorService
{
  constructor(private readonly soapService: SoapService) {}
  private logger = new Logger(SchoolPaySchoolAggregatorService.name);

  async retrieveStudentDetails(
    retrieveSchoolPayStudentDetailsDto: RetrieveSchoolPayStudentDetailsDto,
  ): Promise<IStudentDetails> {
    this.logger.log(this.retrieveStudentDetails.name);
    const validateStudentAccountResponseDto: ValidateStudentAccountSunlyteDto =
      await this.soapService.validateSchoolPayStudentAccount(
        retrieveSchoolPayStudentDetailsDto.studentRegnNumber,
        retrieveSchoolPayStudentDetailsDto.requestReference,
      );

    //tranform response dto to studentDetails
    return StudentDetails.transformValidateStudentAccountSunlyteDtoToStudentDetailsEntity(
      validateStudentAccountResponseDto,
    );
  }
}
