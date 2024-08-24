import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICustLoansApplied } from '../../domain/model/cust-loans-applied.interface';
import { ICustLoansAppliedRepository } from '../../domain/repository/cust-loans-applied-respository.interface';
import { CustLoansApplied } from '../entities/cust-loans-applied.entity';

@Injectable()
export class CustLoansAppliedRepository implements ICustLoansAppliedRepository {
  constructor(
    @InjectRepository(CustLoansApplied)
    private readonly custLoansAppliedRepository: Repository<ICustLoansApplied>,
  ) {}

  findByCustId(custId: string): Promise<ICustLoansApplied[]> {
    return this.custLoansAppliedRepository.find({
      where: { custId, loanStatus: 'Loan Applied', isTerminated: false },
      order: { createdAt: 'desc' },
    });
  }

  findByPCOId(PCOId: string, custId: string): Promise<ICustLoansApplied> {
    return this.custLoansAppliedRepository.findOne({
      where: { PCOId, custId, isTerminated: false },
      order: { createdAt: 'desc' },
    });
  }
  save(custLoansApplied: ICustLoansApplied): Promise<ICustLoansApplied> {
    return this.custLoansAppliedRepository.save(custLoansApplied);
  }
}
