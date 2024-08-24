import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICustToLOS } from 'src/domain/model/custToLOS.interface';
import { ICustToLOSRepository } from 'src/domain/repository/custToLOSRepository.interface';
import { Repository } from 'typeorm';
import { CustToLOS } from '../entities/custToLOS.entity';

@Injectable()
export class custToLOSRepository implements ICustToLOSRepository {
  constructor(
    @InjectRepository(CustToLOS)
    private readonly custToLOSRepository: Repository<ICustToLOS>,
  ) {}

  createUpdate(custToLOS: ICustToLOS): Promise<ICustToLOS> {
    return this.custToLOSRepository.save(custToLOS);
  }
}
