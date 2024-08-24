import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ICustLoansApplied } from '../../domain/model/cust-loans-applied.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class CustLoansApplied extends BaseEntity implements ICustLoansApplied {
  @PrimaryGeneratedColumn('uuid')
  applicationId: string;

  @Column()
  custId: string;

  @Column()
  offerId: string;

  @Column()
  PCOId: string;

  @Column()
  losLoansBoundaries: string;

  @Column({ nullable: true, type: 'decimal' })
  loanTotalAmount: number;

  @Column({ nullable: true })
  loanTenureInstallments: number;

  @Column({ nullable: true, type: 'decimal' })
  loanFees: number;

  @Column()
  loanStatus: string;

  @Column({ nullable: true, type: 'decimal' })
  loanInterestAmount: string;

  @Column({ nullable: true, type: 'decimal' })
  loanTotalAmountPayable: number;

  @Column({ nullable: true })
  loanRepayFrequecy: string;

  @Column({ nullable: true, type: 'decimal' })
  loanRepayAmount: number;

  @Column({ nullable: true })
  loanPreferedPaymentOn: string;

  @Column({ nullable: true })
  loanLastPaymentDate: Date;

  @Column({ default: false })
  isTerminated: boolean;
}
