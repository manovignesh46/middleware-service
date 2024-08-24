import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICustScoringData } from '../../domain/model/custScoringData.interface';
import { ICustScoringDataRepository } from '../../domain/repository/custScoringDataRepository.interface';
import { CustScoringData } from '../entities/custScoringData.entity';

@Injectable()
export class CustScoringDataRepository implements ICustScoringDataRepository {
  constructor(
    @InjectRepository(CustScoringData)
    private readonly custScoringDataRepository: Repository<ICustScoringData>,
  ) {}

  findByLeadId(leadId: string): Promise<ICustScoringData> {
    return this.custScoringDataRepository.findOne({ where: { leadId } });
  }

  save(custScoringData: ICustScoringData): Promise<ICustScoringData> {
    return this.custScoringDataRepository.save(custScoringData);
  }
}
