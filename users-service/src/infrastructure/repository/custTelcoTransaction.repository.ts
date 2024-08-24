import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdType } from '../../domain/enum/id-type.enum';
import { ICustTelcoTransaction } from '../../domain/model/custTelcoTransaction.interface';
import { ICustTelcoTransactionRepository } from '../../domain/repository/custTelcoTransactionRepository.interface';
import { CustTelcoTransaction } from '../entities/custTelcoTransaction.entity';

@Injectable()
export class CustTelcoTransactionRepository
  implements ICustTelcoTransactionRepository
{
  constructor(
    @InjectRepository(CustTelcoTransaction)
    private readonly custTelcoTransactionRepository: Repository<ICustTelcoTransaction>,
  ) {}

  save(
    custTelcoTransaction: ICustTelcoTransaction,
  ): Promise<ICustTelcoTransaction> {
    return this.custTelcoTransactionRepository.save(custTelcoTransaction);
  }

  async update(
    custTelcoTransaction: ICustTelcoTransaction,
  ): Promise<ICustTelcoTransaction> {
    const exisitingCustTelcoTranc: ICustTelcoTransaction =
      await this.custTelcoTransactionRepository.findOne({
        where: { id: custTelcoTransaction.id },
      });
    return this.custTelcoTransactionRepository.save({
      ...exisitingCustTelcoTranc,
      ...custTelcoTransaction,
    });
  }

  findByLeadId(leadId: string): Promise<ICustTelcoTransaction> {
    return this.custTelcoTransactionRepository.findOne({
      where: { idType: IdType.LEAD, idValue: leadId },
    });
  }
}
