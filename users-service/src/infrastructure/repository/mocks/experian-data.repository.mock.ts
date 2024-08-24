import { IdType } from '../../../domain/enum/id-type.enum';
import { IExperianData } from '../../../domain/model/experian-data.interface';
import { mockExperianData } from '../../../domain/model/mocks/experian-data.mock';
import { IExperianDataRepository } from '../../../domain/repository/experian-data-repository.interface';

export const mockExperianDataReposiotry: IExperianDataRepository = {
  getById: function (id: string): Promise<IExperianData> {
    return Promise.resolve({ ...mockExperianData, id });
  },
  create: function (experianRequest: IExperianData): Promise<IExperianData> {
    return Promise.resolve(experianRequest);
  },
  update: function (experianRequest: IExperianData): Promise<IExperianData> {
    return Promise.resolve({ ...mockExperianData, ...experianRequest });
  },
  getByIdTypeIdValueAndIsActive: function (
    idType: IdType,
    idValue: string,
  ): Promise<IExperianData> {
    return Promise.resolve({ ...mockExperianData, idType, idValue });
  },
};
