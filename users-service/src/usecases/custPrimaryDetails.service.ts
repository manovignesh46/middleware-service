import { Injectable, Logger } from '@nestjs/common';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { ICustPrimaryDetailsService } from '../domain/services/custPrimaryDetailsService.interface';

@Injectable()
export class CustPrimaryDetailsService implements ICustPrimaryDetailsService {
  constructor(
    private readonly custPrimaryDetailsRepository: ICustPrimaryDetailsRepository,
  ) {}
  createCustPrimaryDeatils(
    custPrimaryDetails: ICustPrimaryDetails,
  ): Promise<ICustPrimaryDetails> {
    return this.custPrimaryDetailsRepository.create(custPrimaryDetails);
  }

  private readonly logger = new Logger(CustPrimaryDetailsService.name);

  async findCustPrimaryDetails(
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
    email: string,
  ): Promise<ICustPrimaryDetails[]> {
    this.logger.log(this.findCustPrimaryDetails.name);
    return await this.custPrimaryDetailsRepository.findByNinMsisdnEmail(
      nationalIdNumber,
      msisdnCountryCode,
      msisdn,
      email,
    );
  }
}
