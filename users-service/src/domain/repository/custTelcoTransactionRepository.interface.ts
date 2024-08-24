import { ICustTelcoTransaction } from '../model/custTelcoTransaction.interface';

export abstract class ICustTelcoTransactionRepository {
  abstract findByLeadId(leadId: string): Promise<ICustTelcoTransaction>;
  abstract save(
    custTelcoTransaction: ICustTelcoTransaction,
  ): Promise<ICustTelcoTransaction>;
  abstract update(
    custTelcoTransaction: ICustTelcoTransaction,
  ): Promise<ICustTelcoTransaction>;
}
