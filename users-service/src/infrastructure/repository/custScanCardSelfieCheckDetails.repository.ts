import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICustScanCardSelfieCheckDetails } from '../../domain/model/custScanCardSelfieCheckDetails.interface';
import { ICustScanCardSelfieCheckDetailsRepository } from '../../domain/repository/custScanCardSelfieCheckDetailsRepository.interface';
import { CustScanCardSelfieCheckDetails } from '../entities/custScanCardSelfieCheckDetails.entity';

@Injectable()
export class CustScanCardSelfieCheckDetailsRepository
  implements ICustScanCardSelfieCheckDetailsRepository
{
  constructor(
    @InjectRepository(CustScanCardSelfieCheckDetails)
    private readonly CustScanCardSelfieCheckDetailsRepository: Repository<ICustScanCardSelfieCheckDetails>,
  ) {}

  findByCustId(custId: string): Promise<ICustScanCardSelfieCheckDetails> {
    return this.CustScanCardSelfieCheckDetailsRepository.findOne({
      where: { custId },
    });
  }

  save(
    CustScanCardSelfieCheckDetails: ICustScanCardSelfieCheckDetails,
  ): Promise<ICustScanCardSelfieCheckDetails> {
    return this.CustScanCardSelfieCheckDetailsRepository.save(
      CustScanCardSelfieCheckDetails,
    );
  }
}
