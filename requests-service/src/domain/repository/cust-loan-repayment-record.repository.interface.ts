import { ICustLoanRepaymentRecord } from '../model/cust-loan-repayment-record.model';

export abstract class ICustLoanRepaymentRecordRepository {
  abstract save(
    custLoanRepaymentRecord: ICustLoanRepaymentRecord,
  ): Promise<ICustLoanRepaymentRecord>;
  abstract update(
    custLoanRepaymentRecord: ICustLoanRepaymentRecord,
  ): Promise<ICustLoanRepaymentRecord>;
  abstract getById(id: string): Promise<ICustLoanRepaymentRecord>;
  abstract getRepayRecord(id: string): Promise<ICustLoanRepaymentRecord>;
}
