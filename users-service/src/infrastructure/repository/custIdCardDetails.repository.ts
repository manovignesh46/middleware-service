import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICustIdCardDetails } from '../../domain/model/custIdCardDetails.interface';
import { ICustIdCardDetailsRepository } from '../../domain/repository/custIdCardDetailsRepository.interface';
import { CustIdCardDetails } from '../entities/custIdCardDetails.entity';

@Injectable()
export class CustIdCardDetailsRepository
  implements ICustIdCardDetailsRepository
{
  constructor(
    @InjectRepository(CustIdCardDetails)
    private readonly custIdCardDetailsRepository: Repository<ICustIdCardDetails>,
  ) {}
  private logger = new Logger(CustIdCardDetailsRepository.name);

  findByCustId(custId: string): Promise<ICustIdCardDetails> {
    /* Null Check is CRITICAL as typeORM will return the 
    first entry in a table if custId is null or undefined*/
    if (!custId) {
      throw new Error(
        `Customer Id is undefined or null. Customer ID: ${custId}`,
      );
    }
    this.logger.log(this.findByCustId.name);
    this.logger.log(`Customer Id: ${custId}`);
    return this.custIdCardDetailsRepository.findOneBy({ custId });
  }

  findByCustIdOrFail(custId: string): Promise<ICustIdCardDetails> {
    if (!custId) {
      throw new Error(
        `Customer Id is undefined or null. Customer ID: ${custId}`,
      );
    }
    this.logger.log(this.findByCustIdOrFail.name);
    this.logger.log(`Customer Id: ${custId}`);
    return this.custIdCardDetailsRepository.findOneByOrFail({ custId });
  }

  save(custIdCardDetails: ICustIdCardDetails): Promise<ICustIdCardDetails> {
    return this.custIdCardDetailsRepository.save(custIdCardDetails);
  }
}
