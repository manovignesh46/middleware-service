import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICustLoanRepaymentRecord } from '../../domain/model/cust-loan-repayment-record.model';
import { ICustLoanRepaymentRecordRepository } from '../../domain/repository/cust-loan-repayment-record.repository.interface';
import { CustLoanRepaymentRecord } from '../entities/cust-loan-repayment-record.entity';

@Injectable()
export class CustLoanRepaymentRecordRepository
  implements ICustLoanRepaymentRecordRepository
{
  private logger = new Logger(CustLoanRepaymentRecordRepository.name);
  constructor(
    @InjectRepository(CustLoanRepaymentRecord)
    private readonly repository: Repository<ICustLoanRepaymentRecord>,
  ) {}
  getRepayRecord(id: string): Promise<ICustLoanRepaymentRecord> {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }

  save(
    custLoanRepaymentRecord: ICustLoanRepaymentRecord,
  ): Promise<ICustLoanRepaymentRecord> {
    this.logger.log(this.save.name);
    return this.repository.save(custLoanRepaymentRecord);
  }

  async update(
    custLoanRepaymentRecord: ICustLoanRepaymentRecord,
  ): Promise<ICustLoanRepaymentRecord> {
    this.logger.log(this.update.name);
    const existingRecord = await this.getById(custLoanRepaymentRecord.id);
    return this.repository.save({
      ...existingRecord,
      ...custLoanRepaymentRecord,
    });
  }

  getById(id: string): Promise<ICustLoanRepaymentRecord> {
    this.logger.log(this.getById.name);
    return this.repository.findOne({ where: { id } });
  }
}
