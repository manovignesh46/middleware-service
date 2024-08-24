import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICustDedup } from '../../domain/model/custDedup.interface';
import { ICustDedupRepository } from '../../domain/repository/custDedupRespository.interface';
import { CustDedup } from '../entities/custDedup.entity';

@Injectable()
export class CustDedupRepository implements ICustDedupRepository {
  constructor(
    @InjectRepository(CustDedup)
    private readonly custDedupRepository: Repository<ICustDedup>,
  ) {}

  create(custDedup: ICustDedup): Promise<ICustDedup> {
    return this.custDedupRepository.save(custDedup);
  }
}
