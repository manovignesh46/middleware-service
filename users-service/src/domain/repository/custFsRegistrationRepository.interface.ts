import { ICustFsRegistration } from '../model/custFsRegistration.interface';

export abstract class ICustFsRegistrationRepository {
  abstract getByCustId(custId: string): Promise<ICustFsRegistration>;
  abstract getByRequesterId(
    fsRequesterId: number,
  ): Promise<ICustFsRegistration>;
  abstract save(custFsReg: ICustFsRegistration): Promise<ICustFsRegistration>;
}
