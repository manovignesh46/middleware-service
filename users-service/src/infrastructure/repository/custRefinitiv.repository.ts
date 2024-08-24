import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, MoreThan, Repository } from 'typeorm';
import { ICustRefinitiv } from '../../domain/model/custRefinitiv.interface';
import { ICustRefinitivRepository } from '../../domain/repository/custRefinitivRepository.interface';
import { CustRefinitiv } from '../entities/custRefinitiv.entity';

@Injectable()
export class CustRefinitivRepository implements ICustRefinitivRepository {
  constructor(
    @InjectRepository(CustRefinitiv)
    private readonly custRefinitivRepository: Repository<ICustRefinitiv>,
  ) {}

  findUnResolvedCase(): Promise<ICustRefinitiv[]> {
    return this.custRefinitivRepository.find({
      where: [
        {
          resultsCount: MoreThan(0),
          resolutionDone: IsNull(),
        },
        {
          resultsCount: MoreThan(0),
          resolutionDone: In(['NO', '']),
        },
      ],
    });
  }

  save(custRefinitiv: ICustRefinitiv): Promise<ICustRefinitiv> {
    return this.custRefinitivRepository.save(custRefinitiv);
  }

  findByLeadId(leadId: string): Promise<ICustRefinitiv> {
    return this.custRefinitivRepository.findOne({
      where: { idValue: leadId, idType: 'LEAD' },
    });
  }
}
