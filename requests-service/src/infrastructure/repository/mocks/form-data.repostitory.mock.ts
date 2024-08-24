import { IFormData } from '../../../domain/model/form-data.interface';
import { mockFormData } from '../../../domain/model/mocks/form-data.mock';
import { IFormDataRepository } from '../../../domain/repository/form-data.repository.interface';

export const mockFormDataRepository: IFormDataRepository = {
  create: function (form: IFormData): Promise<IFormData> {
    return Promise.resolve(form);
  },
  update: function (form: IFormData): Promise<IFormData> {
    return Promise.resolve({ ...mockFormData, ...form });
  },
  getById: function (id: string): Promise<IFormData> {
    return Promise.resolve({ ...mockFormData, id });
  },
  getByCustomerId: function (customerId: string): Promise<IFormData> {
    return Promise.resolve({ ...mockFormData, customerId });
  },
  getByFullMsisdn: function (fullMsisdn: string): Promise<IFormData> {
    return Promise.resolve({ ...mockFormData, fullMsisdn });
  },
  getByCustIdLoanIdAndTypeId: function (
    customerId: string,
    loanId: string,
    typeId: string,
  ): Promise<IFormData> {
    return Promise.resolve({ ...mockFormData, customerId, loanId, typeId });
  },
};
