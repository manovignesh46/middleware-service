import { LoanDueStatus } from '../../domain/enum/loan-due-status.enum';
import { LoanRepaymentType } from '../../domain/enum/loan-repayment-type.enum';
import { LoanRepaymentMode } from '../../domain/enum/loan-repayment-mode.enum';
import { ICustLoanRepaymentRecord } from '../../domain/model/cust-loan-repayment-record.model';
import { LoanRepaymentStatus } from '../../domain/enum/loan-repayment-status.enum';
import { BaseEntity } from './base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CustLoanRepaymentRecord
  extends BaseEntity
  implements ICustLoanRepaymentRecord
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column({ type: 'bigint' })
  offerId: string;

  @Column({ type: 'bigint' })
  loanAccountNumber: string;

  @Column({ type: 'decimal', nullable: true })
  loanTotalAmount: number;

  @Column({ type: 'decimal', nullable: true })
  loanDueAmount: number;

  @Column({ type: 'timestamptz', nullable: true })
  loanDueDate: Date;

  @Column({ enum: LoanDueStatus, nullable: true })
  loanDueStatus: LoanDueStatus;

  @Column({ enum: LoanRepaymentType, nullable: true })
  loanRepaymentType: LoanRepaymentType;

  @Column({ type: 'decimal' })
  loanRepaymentAmount: number;

  @Column({ enum: LoanRepaymentMode, nullable: true })
  loanRepaymentMode: LoanRepaymentMode;

  @Column({ enum: LoanRepaymentStatus })
  loanRepaymentStatus: LoanRepaymentStatus;

  @Column({ nullable: true })
  loanRepaymentResponse: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  externalTransactionId: string;

  @Column({ nullable: true })
  statusReason: string;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true, type: 'int' })
  code: number;

  @Column({ nullable: true })
  referenceId: string;

  @Column({ nullable: true, type: 'decimal' })
  amountPaid: number;

  @Column({ nullable: true })
  paidDate: string;

  @Column({ nullable: true, type: 'decimal' })
  outstandingBalance: number;

  @Column({ nullable: true, type: 'decimal' })
  outstandingPrincipal: number;

  @Column({ nullable: true, type: 'decimal' })
  outstandingInterest: number;

  @Column({ nullable: true, type: 'decimal' })
  outstandingFee: number;
}
