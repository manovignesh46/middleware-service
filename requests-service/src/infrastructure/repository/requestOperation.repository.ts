import { Injectable, Logger } from '@nestjs/common';
import { IRequestOperation } from '../../domain/model/requestOperation.interface';
import { IRequestOperationRepository } from '../../domain/repository/requestOperationsRepository.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestOperation } from '../entities/requestOperation.entity';

@Injectable()
export class RequestOperationRepository implements IRequestOperationRepository {
  private logger = new Logger(RequestOperationRepository.name);
  constructor(
    @InjectRepository(RequestOperation)
    private readonly requestOperationRepository: Repository<IRequestOperation>,
  ) {}

  save(requestOperation: IRequestOperation): Promise<IRequestOperation> {
    this.logger.log(this.save.name);
    return this.requestOperationRepository.save(requestOperation);
  }
}
