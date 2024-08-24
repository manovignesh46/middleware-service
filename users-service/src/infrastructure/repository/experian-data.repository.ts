import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdType } from '../../domain/enum/id-type.enum';
import { IExperianData } from '../../domain/model/experian-data.interface';
import { IExperianDataRepository } from '../../domain/repository/experian-data-repository.interface';
import { ExperianData } from '../entities/experian-data.entity';

@Injectable()
export class ExperianDataRepository implements IExperianDataRepository {
  constructor(
    @InjectRepository(ExperianData)
    private readonly experianRequestRepository: Repository<IExperianData>,
  ) {}

  getById(id: string): Promise<IExperianData> {
    return this.experianRequestRepository.findOneByOrFail({ id });
  }
  getByIdTypeIdValueAndIsActive(
    idType: IdType,
    idValue: string,
  ): Promise<IExperianData> {
    return this.experianRequestRepository.findOneBy({
      idType,
      idValue,
      isActive: true,
    });
  }
  create(experianRequest: IExperianData): Promise<IExperianData> {
    return this.experianRequestRepository.save(experianRequest);
  }
  async update(experianRequest: IExperianData): Promise<IExperianData> {
    const existingExperianRequest = await this.getById(experianRequest.id);
    return this.experianRequestRepository.save({
      ...existingExperianRequest,
      ...experianRequest,
    });
  }
}
