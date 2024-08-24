import { ICustLoansApplied } from '../model/cust-loans-applied.interface';

export abstract class ICustLoansAppliedRepository {
  abstract findByPCOId(
    PCOId: string,
    custId: string,
  ): Promise<ICustLoansApplied>;
  abstract save(
    custLoansApplied: ICustLoansApplied,
  ): Promise<ICustLoansApplied>;

  abstract findByCustId(custId: string): Promise<ICustLoansApplied[]>;
}
