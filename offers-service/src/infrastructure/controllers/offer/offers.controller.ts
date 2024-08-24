import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IOfferService } from '../../../domain/services/offerService.interface';
import { SoapService } from '../../services/soap-client.service';
import { StatusMessagePresenter } from '../common/statusMessage.presenter';

@Controller({
  path: 'v1/offers',
  version: '1',
})
@ApiTags('offers')
export class OffersController {
  constructor(
    private readonly offersService: IOfferService,
    private readonly soapService: SoapService,
  ) {}

  @Get('validate-student-account/:studentid')
  async verifyStudentAccount(@Param('studentid') studentId: string) {
    const validateStudentResponse =
      await this.soapService.validateStudentAccount(studentId);

    let status: number;
    let message: string;
    if (!validateStudentResponse) {
      status = 6001;
      message = 'Invalid Response from sunlyte endpoint';
      return new StatusMessagePresenter(status, message);
    }
    status = 2000;
    message = 'Student Details Verified';
    return new StatusMessagePresenter(status, message, validateStudentResponse);
  }
}
