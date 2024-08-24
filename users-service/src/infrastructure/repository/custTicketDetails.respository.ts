import { Injectable } from '@nestjs/common';
import { ICustTicketDetails } from '../../domain/model/custTicketDetails.interface';
import { ICustTicketDetailsRepository } from '../../domain/repository/custTicketDetailsRepository.interface';
import { Repository } from 'typeorm';
import { CustTicketDetails } from '../entities/custTicketDetails.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustTicketDetailsRepository
  implements ICustTicketDetailsRepository
{
  constructor(
    @InjectRepository(CustTicketDetails)
    private readonly custTicketDetailsRepo: Repository<CustTicketDetails>,
  ) {}
  save(custTicketDetails: ICustTicketDetails): Promise<ICustTicketDetails> {
    return this.custTicketDetailsRepo.save(custTicketDetails);
  }
}
