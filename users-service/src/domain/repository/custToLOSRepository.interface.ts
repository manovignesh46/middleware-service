import { ICustToLOS } from '../model/custToLOS.interface';

export abstract class ICustToLOSRepository {
  abstract createUpdate(custToLOS: ICustToLOS): Promise<ICustToLOS>;
}
