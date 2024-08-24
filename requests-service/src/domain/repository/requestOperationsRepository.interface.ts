import { IRequestOperation } from '../model/requestOperation.interface';

export abstract class IRequestOperationRepository {
  abstract save(
    requestOperation: IRequestOperation,
  ): Promise<IRequestOperation>;
}
