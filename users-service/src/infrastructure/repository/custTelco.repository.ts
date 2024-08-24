import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ICustTelco } from '../../domain/model/custTelco.interface';
import { ICustTelcoRepository } from '../../domain/repository/custTelcoRepository.interface';
import { CustTelco } from '../entities/custTelco.entity';
import { IdType } from '../../domain/model/user-device.interface';

@Injectable()
export class CustTelcoRepository implements ICustTelcoRepository {
  constructor(
    @InjectRepository(CustTelco)
    private readonly custTelcoRepository: Repository<ICustTelco>,
  ) {}

  findByLeadIdList(leadIdList: string[]): Promise<ICustTelco[]> {
    return this.custTelcoRepository.find({
      where: {
        idType: IdType.LEAD,
        idValue: In(leadIdList),
      },
    });
  }

  updateCustTelcoList(custTelco: ICustTelco[]): Promise<ICustTelco[]> {
    return this.custTelcoRepository.save(custTelco);
  }
  findByFullMsisdnAndLeadId(
    msisdnCountryCode: string,
    msisdn: string,
    leadId: string,
  ): Promise<ICustTelco> {
    return this.custTelcoRepository.findOne({
      where: {
        msisdnCountryCode,
        msisdn,
        idType: IdType.LEAD,
        idValue: leadId,
      },
    });
  }

  save(custTelco: ICustTelco): Promise<ICustTelco> {
    return this.custTelcoRepository.save(custTelco);
  }

  findByLeadId(leadId: string): Promise<ICustTelco> {
    return this.custTelcoRepository.findOne({
      where: { idType: IdType.LEAD, idValue: leadId },
    });
  }
}
