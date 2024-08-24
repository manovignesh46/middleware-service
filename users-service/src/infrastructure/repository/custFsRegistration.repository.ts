import { Injectable } from '@nestjs/common';
import { ICustFsRegistration } from '../../domain/model/custFsRegistration.interface';
import { ICustFsRegistrationRepository } from '../../domain/repository/custFsRegistrationRepository.interface';
import { Repository } from 'typeorm';
import { CustFsRegistration } from '../entities/custFsRegistration.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustFsRegistrationRepository
  implements ICustFsRegistrationRepository
{
  constructor(
    @InjectRepository(CustFsRegistration)
    private readonly custFsRegistrationRepository: Repository<CustFsRegistration>,
  ) {}
  getByRequesterId(fsRequesterId: number): Promise<ICustFsRegistration> {
    return this.custFsRegistrationRepository.findOne({
      where: { fsRequesterId },
    });
  }
  save(custFsReg: ICustFsRegistration): Promise<ICustFsRegistration> {
    return this.custFsRegistrationRepository.save(custFsReg);
  }
  getByCustId(custId: string): Promise<ICustFsRegistration> {
    return this.custFsRegistrationRepository.findOne({ where: { custId } });
  }
}
