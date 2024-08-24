import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRequestToLOS } from '../../domain/model/request-to-los.interface';
import { IRequestToLOSRepository } from '../../domain/repository/request-to-los.repository.interface';
import { RequestToLOS } from '../entities/request-to-los.entity';

export class RequestToLOSRepository implements IRequestToLOSRepository {
  constructor(
    @InjectRepository(RequestToLOS)
    private requestToLosRepository: Repository<RequestToLOS>,
  ) {}
  create(custToLOS: IRequestToLOS): Promise<IRequestToLOS> {
    return this.requestToLosRepository.save(custToLOS);
  }
}
