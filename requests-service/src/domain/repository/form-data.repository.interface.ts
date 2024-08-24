import { IFormData } from '../model/form-data.interface';

export abstract class IFormDataRepository {
  abstract create(form: IFormData): Promise<IFormData>;
  abstract update(form: IFormData): Promise<IFormData>;
  abstract getById(id: string): Promise<IFormData>;
  abstract getByCustomerId(customerId: string): Promise<IFormData>;
  abstract getByFullMsisdn(fullMsisdn: string): Promise<IFormData>;
  abstract getByCustIdLoanIdAndTypeId(
    customerId: string,
    loanId: string,
    typeId: string,
  ): Promise<IFormData>;
}
