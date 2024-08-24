import { Injectable } from '@nestjs/common';
import { IFAQRepository } from '../../domain/repository/faqRepository.interface';
import { FAQ } from '../entities/faq.entity';
import { Repository } from 'typeorm';
import { IFAQ } from '../../domain/model/faq.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FAQRepository implements IFAQRepository {
  constructor(
    @InjectRepository(FAQ)
    private readonly faqRespository: Repository<IFAQ>,
  ) {}

  getAllFAQs(): Promise<FAQ[]> {
    return this.faqRespository.find({ where: { isActive: true } });
  }
}
